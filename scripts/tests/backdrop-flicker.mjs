// Compares two ways of shrinking the game canvas into the 64px backdrop while the game animates, on a 2x display:
// "direct" (one drawImage, what shipped) and "halving" (repeated 2x downscales, i.e. area averaging).
// Reports the mean frame-to-frame change of each: lower = steadier backdrop.
const has = name => `window.__stage._children.some(c => c.constructor.name == '${name}')`;

const record = ms => `(async () => {
	const st = window.__stage;
	const game = document.getElementById('stage');
	const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
	const direct = mk(64, 40), directCtx = direct.getContext('2d', { willReadFrequently: true });
	const halves = [];
	for (let w = game.width >> 1, h = game.height >> 1; w > 64; w >>= 1, h >>= 1) halves.push(mk(w, h));
	const out = mk(64, 40), outCtx = out.getContext('2d', { willReadFrequently: true });
	const fr = { direct: [], halving: [] };
	const prev = st.onRender;
	st.onRender = () => {
		prev();
		directCtx.drawImage(game, 0, 0, 64, 40);
		fr.direct.push(directCtx.getImageData(0, 0, 64, 40).data.slice());
		let src = game;
		for (const h of halves) { h.getContext('2d').drawImage(src, 0, 0, h.width, h.height); src = h; }
		outCtx.drawImage(src, 0, 0, 64, 40);
		fr.halving.push(outCtx.getImageData(0, 0, 64, 40).data.slice());
	};
	await new Promise(r => setTimeout(r, ${ms}));
	st.onRender = prev;
	const stat = frames => {
		let sum = 0, max = 0;
		for (let i = 1; i < frames.length; i++) {
			let d = 0; const a = frames[i - 1], b = frames[i];
			for (let k = 0; k < a.length; k += 4) d += Math.abs(a[k] - b[k]) + Math.abs(a[k + 1] - b[k + 1]) + Math.abs(a[k + 2] - b[k + 2]);
			d /= (a.length / 4) * 3; sum += d; max = Math.max(max, d);
		}
		return { meanJump: +(sum / (frames.length - 1)).toFixed(2), maxJump: +max.toFixed(2) };
	};
	return JSON.stringify({ canvas: game.width + 'x' + game.height, frames: fr.direct.length, direct: stat(fr.direct), halving: stat(fr.halving) });
})()`;

export default async ({ ev, click, press, pt, sleep, send, goto }) => {
	await send("Emulation.setDeviceMetricsOverride", { width: 1000, height: 700, deviceScaleFactor: Number(process.env.DPR ?? 2), mobile: false });
	await goto("/games/multiply/");
	for (let i = 0; i < 150 && !(await ev(`!!window.__stage && ${has("MenuView")}`)); i++) await sleep(100);
	await sleep(1000);
	const p = await pt(650, 355);
	await click(p.x, p.y);
	for (let i = 0; i < 50 && !(await ev(has("GameView"))); i++) await sleep(100);
	await sleep(2000);
	const rec = ev(record(7000)); // sampling while we play
	for (let a = 0; a < 2; a++) {
		const q = await ev(`(() => { let r = null; const walk = o => { if (o.constructor.name == 'MultiplyInput' && o.question) r = o.question.result; (o._children || []).forEach(walk); }; walk(window.__stage); return r; })()`);
		for (const ch of String(q)) await press(ch, "Digit" + ch, 48 + Number(ch));
		await press("Enter", "Enter", 13);
		await sleep(3200);
	}
	console.log("animating game:", await rec);
};
