// Boots Logic and walks menu -> difficulty -> level -> game, screenshotting each screen.
const names = `JSON.stringify(window.__stage._children.map(c => c.constructor.name))`;

export default async ({ ev, shot, click, pt, sleep, goto }) => {
	await goto("/games/logic/");
	for (let i = 0; i < 200 && !(await ev(`!!window.__stage && window.__stage._children.length > 1`)); i++) await sleep(100);
	await sleep(1500);
	console.log("1 stage:", await ev(names));
	await shot("logic-1-menu");

	let p = await pt(787, 395); // GRAJ
	await click(p.x, p.y);
	await sleep(1500);
	console.log("2 stage:", await ev(names));
	await shot("logic-2-after-play");

	p = await pt(192, 254); // easy robot
	await click(p.x, p.y);
	await sleep(1500);
	console.log("3 stage:", await ev(names));
	await shot("logic-3-levels");

	p = await pt(55, 252); // level 1
	await click(p.x, p.y);
	await sleep(2500);
	console.log("4 stage:", await ev(names));
	await shot("logic-4-game");

	const robotPos = `JSON.stringify((() => { let r = null; const walk = o => { if (o.constructor.name == 'Character') r = { x: Math.round(o.x), y: Math.round(o.y) }; (o._children || []).forEach(walk); }; walk(window.__stage); return r; })())`;
	console.log("robot before:", await ev(robotPos));
	p = await pt(108, 427); // forward x2
	await click(p.x, p.y); await sleep(400);
	await click(p.x, p.y); await sleep(600);
	await shot("logic-5-commands");
	p = await pt(108, 479); // execute
	await click(p.x, p.y);
	await sleep(1500);
	await shot("logic-6-running");
	await sleep(4000);
	console.log("robot after:", await ev(robotPos));
	await shot("logic-7-after-run");
};
