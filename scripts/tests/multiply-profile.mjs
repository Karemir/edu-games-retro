// CPU-profiles ~4s of gameplay (freeplay screen) and prints the top self-time functions.
export default async ({ ev, click, pt, sleep, send, goto }) => {
	await goto("/games/multiply/");
	for (let i = 0; i < 150 && !(await ev(`!!window.__stage && window.__stage._children.some(c => c.constructor.name == 'MenuView')`)); i++) await sleep(100);
	await sleep(500);
	const freeplay = await pt(650, 355);
	await click(freeplay.x, freeplay.y);
	for (let i = 0; i < 50 && !(await ev(`window.__stage._children.some(c => c.constructor.name == 'GameView')`)); i++) await sleep(100);
	await sleep(1500);
	await send("Profiler.enable");
	await send("Profiler.setSamplingInterval", { interval: 200 });
	await send("Profiler.start");
	await sleep(4000);
	const { result } = await send("Profiler.stop");
	const prof = result.profile;
	const self = new Map();
	const dt = prof.timeDeltas;
	const byId = new Map(prof.nodes.map(n => [n.id, n]));
	prof.samples.forEach((id, i) => {
		const n = byId.get(id), cf = n.callFrame;
		const key = `${cf.functionName || "(anon)"}  ${cf.url.split("/").slice(-2).join("/")}:${cf.lineNumber + 1}`;
		self.set(key, (self.get(key) || 0) + (dt[i] || 0));
	});
	const total = [...self.values()].reduce((a, b) => a + b, 0);
	console.log("total sampled ms:", (total / 1000).toFixed(0));
	for (const [k, v] of [...self.entries()].sort((a, b) => b[1] - a[1]).slice(0, 18)) console.log(`${(v / total * 100).toFixed(1).padStart(5)}%  ${(v / 1000).toFixed(0).padStart(5)} ms  ${k}`);
};
