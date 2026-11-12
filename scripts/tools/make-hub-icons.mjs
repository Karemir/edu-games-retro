// Build-time tool (run through the browser runner): crops the main image of each game into a rounded-square hub icon in the
// style of the garden button (same size, thin outline) and writes them to hub/assets/icons/. Also crops the hub background
// (the forest at the foot of Multiply's tall game background, away from the crane tower) to hub/assets/hubBg.jpg.
//   node scripts/browser-test.mjs scripts/tools/make-hub-icons.mjs --headless
import { writeFileSync } from "node:fs";

const W = 174, H = 170; // 2x the 87x85 garden button
const SOURCES = [
	{ name: "multiply", src: "flash originals/EduGameMultiply/Assets/MenuBg.png", crop: [20, 20, 410, 400] },
	{ name: "logic", src: "flash originals/EduGameLogic/Assets/MenuBg.jpg", crop: [135, 125, 300, 293] },
	{ name: "letters", src: "flash originals/EduGameLetters/Assets/menuBg.png", crop: [105, 95, 400, 391] },
];

// 960:600 window into Multiply's 560x3000 forest strip
const BG = { src: "flash originals/EduGameMultiply/Assets/gameBg.jpg", crop: [150, 2744, 410, 256], out: [1440, 900] };

export default async ({ ev, goto }) => {
	await goto("/");
	const result = await ev(`(async () => {
		const load = src => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = '/' + encodeURI(src); });
		// border colour of the real garden button (a thin dark outline): darkest opaque pixel along its left edge
		const g = await load('hub/assets/icons/garden.png');
		const gc = document.createElement('canvas'); gc.width = g.width; gc.height = g.height;
		const gx = gc.getContext('2d'); gx.drawImage(g, 0, 0);
		let border = [255, 255, 255];
		for (let x = 0; x < 5; x++) { const p = gx.getImageData(x, g.height >> 1, 1, 1).data; if (p[3] > 200 && p[0] + p[1] + p[2] < border[0] + border[1] + border[2]) border = [p[0], p[1], p[2]]; }
		const color = 'rgb(' + border.join(',') + ')';
		const out = {};
		for (const s of ${JSON.stringify(SOURCES)}) {
			const img = await load(s.src);
			const c = document.createElement('canvas'); c.width = ${W}; c.height = ${H};
			const x = c.getContext('2d');
			const r = 16, b = 3;
			x.save();
			x.beginPath(); x.roundRect(b / 2, b / 2, ${W} - b, ${H} - b, r); x.clip();
			x.imageSmoothingQuality = 'high';
			x.drawImage(img, s.crop[0], s.crop[1], s.crop[2], s.crop[3], 0, 0, ${W}, ${H});
			x.restore();
			x.lineWidth = b; x.strokeStyle = color;
			x.beginPath(); x.roundRect(b / 2, b / 2, ${W} - b, ${H} - b, r); x.stroke();
			out[s.name] = c.toDataURL('image/png').split(',')[1];
		}
		const bg = await load(${JSON.stringify(BG.src)});
		const bc = document.createElement('canvas'); bc.width = ${BG.out[0]}; bc.height = ${BG.out[1]};
		const bx = bc.getContext('2d'); bx.imageSmoothingQuality = 'high';
		bx.drawImage(bg, ${BG.crop.join(",")}, 0, 0, bc.width, bc.height);
		const bgData = bc.toDataURL('image/jpeg', 0.92).split(',')[1];
		return JSON.stringify({ color, out, bgData });
	})()`);
	const { color, out, bgData } = JSON.parse(result);
	console.log("garden border colour:", color);
	for (const [name, b64] of Object.entries(out)) {
		writeFileSync(`hub/assets/icons/${name}.png`, Buffer.from(b64, "base64"));
		console.log("wrote hub/assets/icons/" + name + ".png");
	}
	writeFileSync("hub/assets/hubBg.jpg", Buffer.from(bgData, "base64"));
	console.log("wrote hub/assets/hubBg.jpg");
};
