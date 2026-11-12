import assert from "node:assert/strict";

const main = "window.__stage._children[0]._children.find(c => c.constructor.name == 'Main')";

export default async ({ ev, shot, click, sleep, goto }) => {
	await goto("/games/multiply/");
	for (let i = 0; i < 100 && !(await ev(`!!window.__stage && !!${main}`)); i++) await sleep(100);
	assert.ok(await ev(`!!${main}`), "Main was not created: preloader never finished");
	await sleep(500);
	await shot("multiply-1-loaded");

	// the page has no body margin override: the canvas sits at (8, 8)
	const r = JSON.parse(await ev("JSON.stringify(document.getElementById('stage').getBoundingClientRect())"));
	await click(r.x + 100, r.y + 80);
	assert.equal(await ev("document.getElementById('stage').style.cursor"), "pointer", "buttonMode cursor");
	await sleep(300);
	assert.ok(await ev(`${main}.box.y`) > 100, "tween should be moving the box down");
	await shot("multiply-2-clicked");
	await sleep(2500);
	assert.equal(await ev(`${main}.box.y`), 40, "tween chain should return the box");
	assert.equal(await ev(`${main}.label.text`), "clicks: 1");
	await sleep(1500); // leave the window up a moment
};
