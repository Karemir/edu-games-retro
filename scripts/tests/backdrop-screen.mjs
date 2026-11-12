// Screenshots a corner that only shows the backdrop, N times in a row, while the game idles.
// A steady backdrop gives (almost) identical screenshots; flicker gives many different ones.
import { createHash } from "node:crypto";
const has = name => `window.__stage._children.some(c => c.constructor.name == '${name}')`;

export default async ({ ev, click, pt, sleep, send, goto }) => {
	await send("Emulation.setDeviceMetricsOverride", { width: 1000, height: 700, deviceScaleFactor: Number(process.env.DPR ?? 2), mobile: false });
	await goto("/games/multiply/");
	for (let i = 0; i < 150 && !(await ev(`!!window.__stage && ${has("MenuView")}`)); i++) await sleep(100);
	await sleep(1500);
	const p = await pt(650, 355);
	await click(p.x, p.y);
	for (let i = 0; i < 50 && !(await ev(has("GameView"))); i++) await sleep(100);
	await sleep(2500);
	const N = 40, hashes = new Map();
	for (let i = 0; i < N; i++) {
		const r = await send("Page.captureScreenshot", { format: "png", clip: { x: 150, y: 560, width: 700, height: 100, scale: 1 } }); // bottom strip, outside the game
		const h = createHash("md5").update(r.result.data).digest("hex").slice(0, 8);
		hashes.set(h, (hashes.get(h) || 0) + 1);
		await sleep(30);
	}
	console.log(`distinct backdrop images in ${N} screenshots: ${hashes.size}`, [...hashes.values()].join(","));
};
