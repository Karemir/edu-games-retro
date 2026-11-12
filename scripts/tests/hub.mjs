import assert from "node:assert/strict";

const robotX = `(() => { const i = [...document.querySelectorAll('#container img')].find(e => e.src.includes('/robo/')); return i ? i.getBoundingClientRect().x : null; })()`;
const tilesShown = `(() => { const t = document.querySelector('.tile'); return !!t && t.getClientRects().length > 0; })()`; // rendered at all (a hidden ancestor removes the boxes)

export default async ({ ev, shot, click, sleep, goto }) => {
	await goto("/");
	await sleep(1500);
	const tiles = JSON.parse(await ev(`JSON.stringify([...document.querySelectorAll('.tile')].map(t => ({ tag: t.tagName, href: t.getAttribute('href'), soon: t.classList.contains('soon'), label: t.textContent.replace(/soon/i, '').trim(), stamped: /soon/i.test(t.textContent) })))`));
	assert.equal(tiles.length, 4);
	assert.deepEqual(tiles.filter(t => t.href).map(t => t.href), ["games/multiply/", "games/logic/", "games/letters/", "games/garden/"], "ported games are links");
	assert.deepEqual(tiles.filter(t => t.soon).map(t => t.label), [], "no game is left unported");
	assert.ok(tiles.filter(t => t.soon).every(t => t.stamped && t.tag == "DIV"), "soon tiles are not links");
	assert.ok(await ev("document.fonts.check('19px MBold')"), "label font loaded");
	const boxes = JSON.parse(await ev(`JSON.stringify([...document.querySelectorAll('.tile')].map(t => { const r = t.getBoundingClientRect(); return { cx: r.x + r.width / 2, y: r.y }; }))`));
	const [a, b, c, garden] = boxes;
	assert.ok(Math.abs(a.y - b.y) < 2 && Math.abs(b.y - c.y) < 2, "three games share a line");
	assert.ok(garden.y > a.y + 80, "garden is on a line below");
	assert.ok(Math.abs(garden.cx - b.cx) < 3, "garden is centred under the games");
	await shot("hub-1");

	for (const [index, game, expectChild] of [[0, "multiply", "MenuView"], [1, "logic", "MenuView"], [2, "letters", "MainMenuScreen"], [3, "garden", "GardenScreen"]]) {
		await goto("/");
		await sleep(1200);
		const r = JSON.parse(await ev(`JSON.stringify(document.querySelectorAll('a.tile')[${index}].getBoundingClientRect())`));
		const t0 = Date.now();
		await click(r.x + r.width / 2, r.y + 40);
		await sleep(150);
		assert.equal(await ev(tilesShown), false, game + ": buttons are hidden while loading");
		const x1 = await ev(robotX);
		assert.ok(x1 != null, game + ": robot is shown");
		await sleep(250);
		const x2 = await ev(robotX); // measured back to back: a screenshot in between could outlast the 1 s loader
		assert.ok(x2 > x1, `${game}: robot walks to the right (${x1} -> ${x2})`);
		await shot(`hub-loading-${game}`);
		assert.equal(await ev("location.pathname"), `/games/${game}/`);

		let ms = 0;
		for (let i = 0; i < 150; i++) {
			if (await ev(`!!window.__stage && window.__stage._children.some(c => c.constructor.name == '${expectChild}')`)) { ms = Date.now() - t0; break; }
			await sleep(50);
		}
		assert.ok(ms > 0, game + ": game started");
		assert.ok(ms >= 1000, `${game}: loader lasted at least 1 s (${ms} ms)`);
		console.log(`${game}: game on screen ${ms} ms after the press`);
		await sleep(800);
		await shot(`hub-started-${game}`);
		await ev("history.back()");
		await sleep(1500);
		assert.equal(await ev("location.pathname"), "/", game + ": back returns to the hub");
		assert.equal(await ev(tilesShown), true, game + ": hub tiles are back");
	}
};
