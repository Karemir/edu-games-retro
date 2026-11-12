import { writeFileSync } from "node:fs";
import { join } from "node:path";

const has = name => `window.__stage._children.some(c => c.constructor.name == '${name}')`;

export default async ({ ev, shot, click, pt, sleep, send, goto }) => {
	await goto("/games/multiply/");
	for (let i = 0; i < 150 && !(await ev(`!!window.__stage && ${has("MenuView")}`)); i++) await sleep(100);
	const arcade = await pt(520, 355);
	await click(arcade.x, arcade.y);
	for (let i = 0; i < 50 && !(await ev(has("GameView"))); i++) await sleep(100);
	await sleep(1500);
	const crop = async (name, x, y, w, h) => { // stage coordinates
		const o = await pt(x, y);
		const res = await send("Page.captureScreenshot", { format: "png", clip: { x: o.x, y: o.y, width: w * o.k, height: h * o.k, scale: 3 / o.k } });
		writeFileSync(join("test-output", name + ".png"), Buffer.from(res.result.data, "base64"));
		console.log("[shot]", name);
	};
	await crop("fonts-hud", 0, 380, 400, 220);   // timer, height, question, button
	await crop("fonts-stone", 540, 40, 300, 150); // question in the stone panel
	// dump the text fields with their geometry
	console.log(await ev(`(() => { const out = []; const walk = (o, p) => { if (o.constructor.name == 'TextField') { const g = o.localToGlobal({x:0,y:0}); out.push(JSON.stringify({ text: o.text, size: o.defaultTextFormat.size, font: o.defaultTextFormat.font, autoSize: o.autoSize, x: Math.round(g.x), y: Math.round(g.y), w: Math.round(o.width), h: Math.round(o.height), tw: Math.round(o.textWidth), th: Math.round(o.textHeight) })); } (o._children || []).forEach(c => walk(c)); }; walk(window.__stage); return out.join('\\n'); })()`));
};
