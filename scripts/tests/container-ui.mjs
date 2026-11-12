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
	for (const kind of ["music", "sfx"]) {
		const b = JSON.parse(await ev(rect(`button[data-mute=${kind}]`)));
		assert.ok(vw - (b.x + b.w) < 100 && b.y < 30, kind + " button is top-right");
		await click(b.x + b.w / 2, b.y + b.h / 2);
		assert.equal(await ev(`(async () => (await ${audio}).GameAudio.isMuted('${kind}'))()`), true, kind + " muted after click");
		assert.equal(await ev(`(async () => (await ${audio}).GameAudio.bus('${kind}').gain.value)()`), 0, kind + " bus silent");
		assert.equal(await ev(`document.querySelector('button[data-mute=${kind}]').getAttribute('aria-pressed')`), "true");
	}
	await shot("ui-muted");
	// the state survives a reload
	await goto("/games/multiply/");
	await sleep(1500);
	assert.equal(await ev(`document.querySelector('button[data-mute=music]').getAttribute('aria-pressed')`), "true", "music mute remembered");
	// unmute music again
	const m = JSON.parse(await ev(rect("button[data-mute=music]")));
	await click(m.x + m.w / 2, m.y + m.h / 2);
	assert.equal(await ev(`(async () => (await ${audio}).GameAudio.isMuted('music'))()`), false);
	await shot("ui-music-on");
};
