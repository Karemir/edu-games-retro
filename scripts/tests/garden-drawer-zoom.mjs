// Opens the garden drawer and saves a zoomed crop of it, optionally at a given device scale factor (DPR env).
import { writeFileSync } from "node:fs";
import { join } from "node:path";

export default async ({ ev, click, pt, sleep, send, goto }) => {
	if (process.env.DPR) await send("Emulation.setDeviceMetricsOverride", { width: 1000, height: 700, deviceScaleFactor: Number(process.env.DPR), mobile: false });
	await goto("/");
	await sleep(400);
	await ev(`localStorage.setItem('edugames:achievements', JSON.stringify([1,2,3,4,5,9,15,21])); 'ok'`);
	await goto("/games/garden/");
	for (let i = 0; i < 150 && !(await ev(`!!window.__stage && window.__stage._children.length > 1`)); i++) await sleep(100);
	await sleep(2000);
	const p = await pt(926, 566);
	await click(p.x, p.y);
	await sleep(1500);
	const o = await pt(860, 60);
	const res = await send("Page.captureScreenshot", { format: "png", clip: { x: o.x, y: o.y, width: 100 * o.k, height: 330 * o.k, scale: 3 / o.k } });
	const name = process.env.OUT || "drawer-zoom";
	writeFileSync(join("test-output", name + ".png"), Buffer.from(res.result.data, "base64"));
	console.log("[shot]", name, "stage scale", o.k.toFixed(3), "dpr", process.env.DPR || "default");
};
