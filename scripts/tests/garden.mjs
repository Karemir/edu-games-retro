// Seeds localStorage (unlocked achievements + a placed reward), opens the garden page and screenshots it.
const has = name => `window.__stage._children.some(c => c.constructor.name == '${name}')`;

export default async ({ ev, shot, click, pt, send, sleep, goto }) => {
	await goto("/");
	await sleep(500);
	await ev(`localStorage.setItem('edugames:achievements', JSON.stringify([1,2,3,4,5,9,15,21])); localStorage.setItem('edugames:garden', JSON.stringify({ "1": 5, "4": 21 })); 'ok'`);
	await goto("/games/garden/");
	for (let i = 0; i < 150 && !(await ev(`!!window.__stage && window.__stage._children.length > 1`)); i++) await sleep(100);
	await sleep(2500);
	console.log("stage children:", await ev(`JSON.stringify(window.__stage._children.map(c => c.constructor.name))`));
	await shot("garden-1");

	const garden = `window.__stage._children.find(c => c.constructor.name == 'GardenScreen')`;
	// open the drawer with the shovel button
	let p = await pt(926, 566);
	await click(p.x, p.y);
	await sleep(1500);
	await shot("garden-2-drawer");
	const items = JSON.parse(await ev(`JSON.stringify(${garden}.items.map((it, i) => { const g = it.localToGlobal({ x: 0, y: 0 }); return { i, id: it.itemId, bought: it.isBought, x: Math.round(g.x), y: Math.round(g.y), vis: it.visible && it.stage != null }; }))`));
	console.log("items:", JSON.stringify(items.filter(i => i.bought)));
	const item = items.find(i => i.bought && i.id == 1 && i.x > 0 && i.x < 960 && i.y > 0 && i.y < 600);
	console.log("dragging item:", JSON.stringify(item));
	if (item) {
		const spot = JSON.parse(await ev(`JSON.stringify((() => { const sp = ${garden}.spots[8]; const g = sp.localToGlobal({ x: 0, y: 0 }); return { x: Math.round(g.x), y: Math.round(g.y) }; })())`));
		console.log("target spot 8:", JSON.stringify(spot));
		const from = await pt(item.x, item.y), to = await pt(spot.x, spot.y);
		await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: from.x, y: from.y });
		await send("Input.dispatchMouseEvent", { type: "mousePressed", x: from.x, y: from.y, button: "left", clickCount: 1 });
		for (let k = 1; k <= 12; k++) {
			await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: from.x + (to.x - from.x) * k / 12, y: from.y + (to.y - from.y) * k / 12, buttons: 1 });
			await sleep(30);
		}
		await send("Input.dispatchMouseEvent", { type: "mouseReleased", x: to.x, y: to.y, button: "left", clickCount: 1 });
		await sleep(800);
		await shot("garden-3-dropped");
		console.log("garden storage:", await ev("localStorage.getItem('edugames:garden')"));
	}
};
