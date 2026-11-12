import assert from "node:assert/strict";

// stage.children[0] is the Preloader; the game's views are added to the stage itself
const has = name => `window.__stage._children.some(c => c.constructor.name == '${name}')`;

export default async ({ ev, shot, click, press, sleep, goto }) => {
	await goto("/games/multiply/");
	for (let i = 0; i < 150 && !(await ev(`!!window.__stage && ${has("MenuView")}`)); i++) await sleep(100);
	assert.ok(await ev(has("MenuView")), "menu did not appear");
	await sleep(500);
	await shot("play-1-menu");

	const r = JSON.parse(await ev("JSON.stringify(document.getElementById('stage').getBoundingClientRect())"));
	await click(r.x + 520, r.y + 355); // arcade button
	for (let i = 0; i < 50 && !(await ev(has("GameView"))); i++) await sleep(100);
	assert.ok(await ev(has("GameView")), "game did not start");
	await sleep(1500);
	await shot("play-2-game");

	for (const [k, c, kc] of [["1", "Digit1", 49], ["2", "Digit2", 50], ["Enter", "Enter", 13]]) { await press(k, c, kc); await sleep(200); }
	await sleep(1500);
	await shot("play-3-after-answer");
	await sleep(1500);
};
