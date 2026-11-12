import { writeFileSync } from "node:fs";
import { join } from "node:path";

export default async ({ ev, click, sleep, send, goto }) => {
	await goto("/games/multiply/");
	for (let i = 0; i < 150 && !(await ev("!!window.__stage && window.__stage._children.some(c => c.constructor.name == 'MenuView')")); i++) await sleep(100);
	await sleep(500);
	// tween the Arcade button sideways with and without blur, linear and fast
	await ev(`(async () => {
		const { TweenLite } = await import('/common/dist/com/greensock/TweenLite.js');
		const { Linear } = await import('/common/dist/com/greensock/easing/Linear.js');
		const menu = window.__stage._children.find(c => c.constructor.name == 'MenuView');
		TweenLite.to(menu.btnArcade, 1, { x: 100, ease: Linear.easeNone, motionBlur: true });   // horizontal
		TweenLite.to(menu.btnFreeplay, 1, { y: 0, ease: Linear.easeNone, motionBlur: true });   // vertical
		TweenLite.to(menu.btnGarden, 1, { y: 0, ease: Linear.easeNone }); // vertical, no blur
	})()`);
	await sleep(400);
	const res = await send("Page.captureScreenshot", { format: "png" });
	writeFileSync(join("test-output", "blur-mid.png"), Buffer.from(res.result.data, "base64"));
	console.log("[shot] blur-mid");
	await sleep(1200);
	console.log("blur state after tween:", await ev("window.__stage._children.find(c => c.constructor.name == 'MenuView').btnArcade._motionBlur"));
};
