import assert from "node:assert/strict";

const robotX = `(() => { const i = [...document.querySelectorAll('#container img')].find(e => e.src.includes('/robo/')); return i ? i.getBoundingClientRect().x : null; })()`;
const tilesShown = `(() => { const p = document.querySelector('.tile')?.parentElement; return !!p && getComputedStyle(p).display != 'none'; })()`;

export default async ({ ev, shot, click, sleep, goto }) => {
	await goto("/");
	await sleep(1500);
	const tiles = JSON.parse(await ev(`JSON.stringify([...document.querySelectorAll('.tile')].map(t => ({ tag: t.tagName, href: t.getAttribute('href'), soon: t.classList.contains('soon'), label: t.textContent.replace(/soon/i, '').trim(), stamped: /soon/i.test(t.textContent) })))`));
	assert.equal(tiles.length, 4);
	assert.deepEqual(tiles.filter(t => t.href).map(t => t.href), ["games/multiply/", "games/logic/"], "ported games are links");
	assert.deepEqual(tiles.filter(t => t.soon).map(t => t.label), ["Wyścigi Literek", "Ogród"], "unported games are stamped");
	assert.ok(tiles.filter(t => t.soon).every(t => t.stamped && t.tag == "DIV"), "soon tiles are not links");
	assert.ok(await ev("document.fonts.check('19px MBold')"), "label font loaded");
	await shot("hub-1");

	for (const [index, game, expectChild] of [[0, "multiply", "MenuView"], [1, "logic", "MenuView"]]) {
		await goto("/");
		await sleep(1200);
		const r = JSON.parse(await ev(`JSON.stringify(document.querySelectorAll('a.tile')[${index}].getBoundingClientRect())`));
		const t0 = Date.now();
		await click(r.x + r.width / 2, r.y + 40);
		await sleep(250);
		assert.equal(await ev(tilesShown), false, game + ": buttons are hidden while loading");
		const x1 = await ev(robotX);
		assert.ok(x1 != null, game + ": robot is shown");
		await shot(`hub-loading-${game}-a`);
		await sleep(300);
		const x2 = await ev(robotX);
		assert.ok(x2 > x1, `${game}: robot walks to the right (${x1} -> ${x2})`);
		await shot(`hub-loading-${game}-b`);
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
