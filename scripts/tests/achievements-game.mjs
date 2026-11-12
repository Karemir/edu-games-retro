import assert from "node:assert/strict";

const has = name => `window.__stage._children.some(c => c.constructor.name == '${name}')`;

export default async ({ ev, shot, click, pt, sleep, goto }) => {
	await goto("/");
	await sleep(500);
	await ev("localStorage.clear(); 'ok'");
	await goto("/games/multiply/");
	for (let i = 0; i < 150 && !(await ev(`!!window.__stage && ${has("MenuView")}`)); i++) await sleep(100);
	await sleep(800);

	// unlock "Złota rybka" through the real proxy, like GameProxy does after 10 correct answers
	await ev(`(async () => { const { AppFacade } = await import('/games/multiply/dist/AppFacade.js'); AppFacade.GetInstance().retrieveProxy('AchievementProxy').AddAchievement(1); })()`);
	await sleep(700);
	assert.equal(await ev("localStorage.getItem('edugames:achievements')"), "[1]", "unlock is stored");
	await shot("ach-1-popup");
	// unlocking the same one again does nothing
	await ev(`(async () => { const { AppFacade } = await import('/games/multiply/dist/AppFacade.js'); AppFacade.GetInstance().retrieveProxy('AchievementProxy').AddAchievement(1); })()`);
	assert.equal(await ev("localStorage.getItem('edugames:achievements')"), "[1]", "no duplicates");

	// the garden button of the menu opens the garden page
	await sleep(3500);
	const garden = await pt(899, 424); // btnGarden of MenuView
	await click(garden.x, garden.y);
	await sleep(2500);
	assert.ok((await ev("location.pathname")).endsWith("/games/garden/"), "garden button opens the garden page");
	for (let i = 0; i < 100 && !(await ev(`!!window.__stage && ${has("GardenScreen")}`)); i++) await sleep(100);
	assert.ok(await ev(has("GardenScreen")), "garden screen is shown");
	await sleep(1500);
	await shot("ach-2-garden");
	// leave with the back arrow of the garden screen
	await ev("history.back()");
	await sleep(1500);
	assert.ok((await ev("location.pathname")).endsWith("/games/multiply/"));
};
