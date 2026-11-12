import assert from "node:assert/strict";

export default async ({ ev, shot, click, sleep, goto }) => {
	await goto("/");
	await sleep(1500);
	const tiles = JSON.parse(await ev(`JSON.stringify([...document.querySelectorAll('.tile')].map(t => ({ tag: t.tagName, href: t.getAttribute('href'), soon: t.classList.contains('soon'), label: t.textContent.replace(/soon/i, '').trim(), stamped: /soon/i.test(t.textContent) })))`));
	console.log(JSON.stringify(tiles));
	assert.equal(tiles.length, 4);
	assert.deepEqual(tiles.filter(t => t.href).map(t => t.href), ["games/multiply/", "games/logic/"], "ported games are links");
	assert.deepEqual(tiles.filter(t => t.soon).map(t => t.label), ["Wyścigi Literek", "Ogród"], "unported games are stamped");
	assert.ok(tiles.filter(t => t.soon).every(t => t.stamped && t.tag == "DIV"), "soon tiles are not links");
	assert.ok(await ev("document.fonts.check('19px MBold')"), "label font loaded");
	await shot("hub-1");
	// hover a live tile
	const r = JSON.parse(await ev(`JSON.stringify(document.querySelector('a.tile').getBoundingClientRect())`));
	await click(r.x + r.width / 2, r.y + 40);
	await sleep(2500);
	assert.ok((await ev("location.pathname")).endsWith("/games/multiply/"), "link opens Multiply");
	await ev("history.back()");
	await sleep(1500);
	assert.equal(await ev("location.pathname"), "/", "back returns to the hub");
};
