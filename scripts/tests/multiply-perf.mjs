// Plays freeplay (no timer) answering correctly and samples frame cost per phase. Prints a table.
const PHASES = Number(process.env.PHASES ?? 8), ANSWERS = Number(process.env.ANSWERS ?? 4), SAMPLE_MS = 3000;

const setup = `(async () => {
	const { EventDispatcher } = await import('/common/dist/flash/events/EventDispatcher.js');
	const { TweenLite } = await import('/common/dist/com/greensock/TweenLite.js');
	const st = window.__stage;
	const P = window.__perf = { frames: 0, renderMs: 0, enterMs: 0, ticks: 0 };
	const render = st.render.bind(st);
	st.render = () => { const t = performance.now(); render(); P.renderMs += performance.now() - t; P.frames++; };
	const be = EventDispatcher.broadcastEnterFrame;
	EventDispatcher.broadcastEnterFrame = () => { const t = performance.now(); be(); P.enterMs += performance.now() - t; };
	P.stats = () => {
		let nodes = 0, bitmaps = 0, texts = 0, sprites = 0;
		const walk = o => { nodes++; const n = o.constructor.name; if (n == 'Bitmap') bitmaps++; else if (n == 'TextField') texts++; else sprites++; (o._children || []).forEach(walk); };
		walk(st);
		return { nodes, bitmaps, texts, frameTargets: EventDispatcher.frameTargets.size, tweens: TweenLite.active.length };
	};
	P.question = () => { let r = null; const walk = o => { if (o.constructor.name == 'MultiplyInput' && o.question) r = o.question.result; (o._children || []).forEach(walk); }; walk(st); return r; };
})()`;

export default async ({ ev, shot, click, press, pt, sleep, goto }) => {
	await goto("/games/multiply/");
	for (let i = 0; i < 150 && !(await ev(`!!window.__stage && window.__stage._children.some(c => c.constructor.name == 'MenuView')`)); i++) await sleep(100);
	await sleep(500);
	await ev(setup);
	const freeplay = await pt(650, 355);
	await click(freeplay.x, freeplay.y);
	for (let i = 0; i < 50 && !(await ev(`window.__stage._children.some(c => c.constructor.name == 'GameView')`)); i++) await sleep(100);
	await sleep(1500);

	const sample = async label => {
		await ev("Object.assign(window.__perf, { frames: 0, renderMs: 0, enterMs: 0 })");
		await sleep(SAMPLE_MS);
		const p = await ev("JSON.stringify({ f: window.__perf.frames, r: window.__perf.renderMs, e: window.__perf.enterMs, s: window.__perf.stats() })");
		const { f, r, e, s } = JSON.parse(p);
		console.log(`${label.padEnd(8)} fps ${(f / (SAMPLE_MS / 1000)).toFixed(1).padStart(5)}  render ${(r / f).toFixed(2).padStart(6)} ms  enterFrame ${(e / f).toFixed(2).padStart(6)} ms  nodes ${String(s.nodes).padStart(4)} bitmaps ${String(s.bitmaps).padStart(4)} text ${String(s.texts).padStart(3)}  enterFrame-listeners ${String(s.frameTargets).padStart(4)}  tweens ${s.tweens}`);
	};
	console.log("phase    (after N correct answers)");
	await sample("start");
	let answered = 0;
	for (let ph = 1; ph <= PHASES; ph++) {
		for (let a = 0; a < ANSWERS; a++) {
			const q = await ev("window.__perf.question()");
			if (q == null) { console.log("no question found"); return; }
			for (const ch of String(q)) await press(ch, "Digit" + ch, 48 + Number(ch));
			await press("Enter", "Enter", 13);
			answered++;
			await sleep(3500); // block drop + animations
		}
		await sample(`${answered} ans`);
	}
	await shot("perf-end");
};
