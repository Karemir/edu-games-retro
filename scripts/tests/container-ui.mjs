import assert from "node:assert/strict";

const rect = sel => `JSON.stringify((() => { const e = document.querySelector(${JSON.stringify(sel)}); const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height, text: e.textContent, bg: getComputedStyle(e).backgroundColor, radius: getComputedStyle(e).borderRadius }; })())`;

export default async ({ ev, shot, click, sleep, goto }) => {
	await goto("/games/multiply/");
	for (let i = 0; i < 150 && !(await ev(`!!window.__stage && window.__stage._children.some(c => c.constructor.name == 'MenuView')`)); i++) await sleep(100);
	await ev("localStorage.clear()");
	await sleep(500);
	const vw = await ev("innerWidth"), vh = await ev("innerHeight");

	const back = JSON.parse(await ev(rect("button[aria-label=Back]")));
	assert.ok(back.x < 30 && back.y < 30, "back button is top-left");
	assert.equal(back.bg, "rgb(255, 255, 255)");
	assert.notEqual(back.radius, "0px");

	const credit = JSON.parse(await ev(`JSON.stringify((() => { const d = [...document.querySelectorAll('#container div')].find(e => e.textContent.includes('Perzak')); const r = d.getBoundingClientRect(); return { right: r.right, bottom: r.bottom, text: d.textContent }; })())`));
	assert.ok(vw - credit.right < 30 && vh - credit.bottom < 30, "author is bottom-right");
	assert.ok(credit.text.includes("Michał Perzak"));

	const audio = "import('/common/dist/GameAudio.js')";
	const muted = kind => ev(`(async () => (await ${audio}).GameAudio.isMuted('${kind}'))()`);
	const gain = kind => ev(`(async () => (await ${audio}).GameAudio.bus('${kind}').gain.value)()`);
	// defaults: music starts muted (until the user turns it on), effects start on
	assert.equal(await muted("music"), true, "music is muted initially");
	assert.equal(await muted("sfx"), false, "effects are on initially");
	assert.equal(await gain("music"), 0);
	assert.equal(await gain("sfx"), 1);

	for (const kind of ["music", "sfx"]) {
		const before = await muted(kind);
		const b = JSON.parse(await ev(rect(`button[data-mute=${kind}]`)));
		assert.ok(vw - (b.x + b.w) < 100 && b.y < 30, kind + " button is top-right");
		await click(b.x + b.w / 2, b.y + b.h / 2);
		assert.equal(await muted(kind), !before, kind + " toggled by a click");
		assert.equal(await gain(kind), before ? 1 : 0, kind + " bus follows");
		assert.equal(await ev(`document.querySelector('button[data-mute=${kind}]').getAttribute('aria-pressed')`), String(!before));
	}
	await shot("ui-toggled"); // music on, effects muted
	// the state survives a reload
	await goto("/games/multiply/");
	await sleep(1500);
	assert.equal(await muted("music"), false, "music setting remembered");
	assert.equal(await muted("sfx"), true, "effects setting remembered");
};
