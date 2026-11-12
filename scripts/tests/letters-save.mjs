import assert from "node:assert/strict";

// New game -> win a race -> the progress is in localStorage -> reload -> starting a game loads the last save (no resume button).
const names = `JSON.stringify(window.__stage._children.map(c => c.constructor.name))`;
const menu = `window.__stage._children.find(c => c.constructor.name == 'MainMenuScreen')`;
const word = `(() => { let r = null; const walk = o => { if (o.constructor.name == 'RaceScreen') r = o; (o._children || []).forEach(walk); }; walk(window.__stage); return r && r.displayedText ? r.displayedText.textFields.map(t => t.text).join('') : null; })()`;

export default async ({ ev, shot, click, pt, press, sleep, goto }) => {
	await goto("/");
	await sleep(400);
	await ev("localStorage.clear(); 'ok'");
	await goto("/games/letters/");
	for (let i = 0; i < 300 && !(await ev(`!!window.__stage && ${menu}`)); i++) await sleep(100);
	await sleep(1500);
	assert.equal(await ev(`${menu}.resume.parent == null`), true, "the resume button is not shown");

	const step = async (x, y, waitMs) => { const p = await pt(x, y); await click(p.x, p.y); await sleep(waitMs); };
	await step(779, 395, 2500); // GRAJ
	await step(271, 352, 3500); // START (new game)
	assert.ok(await ev("localStorage.getItem('SharedObject:eduLetters')"), "the new game is saved at once");
	await step(473, 187, 4000); // race 1 -> map
	await step(259, 395, 4000); // race
	let last = "", same = 0;
	for (let guard = 0; guard < 80 && same < 3; guard++) {
		const w = await ev(word);
		if (!w) { await sleep(300); continue; }
		same = w == last ? same + 1 : 0;
		last = w;
		for (const ch of w) { const code = ch.toUpperCase().charCodeAt(0); await press(ch.toLowerCase(), "Key" + ch.toUpperCase(), code < 128 ? code : 0); await sleep(120); }
		await sleep(600);
	}
	await step(480, 300, 3500); // click the place popup: the result is recorded when it is dismissed
	await shot("letters-save-0-after-popup");
	const saved = JSON.parse(await ev("localStorage.getItem('SharedObject:eduLetters')")).game;
	console.log("saved results:", JSON.stringify(saved.tournamentResults), "statuses:", JSON.stringify(saved.tournamentStatuses));
	assert.ok(saved.tournamentResults.flat().some(v => v > 0), "the race score is saved");
	const total = saved.tournamentResults.flat().reduce((a, b) => a + b, 0);

	// reload: the game carries on
	await goto("/games/letters/");
	for (let i = 0; i < 300 && !(await ev(`!!window.__stage && ${menu}`)); i++) await sleep(100);
	await sleep(2000);
	assert.equal(await ev(`${menu}.resume.parent == null`), true, "still no resume button after a reload");
	await shot("letters-save-1-menu");
	await step(779, 395, 3000); // GRAJ: the last save is loaded, the snail selection is skipped
	assert.ok(await ev(`!!${menu}.tournamentPanel`), "the tournament selection is shown straight away");
	assert.ok(!(await ev(`${menu}.currentPanel === ${menu}.newGamePanel`)), "the new game panel is not used");
	const progress = await ev(`(async () => { const { AppFacade } = await import('/games/letters/dist/AppFacade.js'); const g = AppFacade.GetInstance().retrieveProxy('GameData'); return JSON.stringify({ total: g.tournamentResults.flat().reduce((a, b) => a + b, 0), completion: g.GetTotalCompletion(), racers: g.racers.length, player: g.racers[0].name }); })()`);
	console.log("restored:", progress);
	assert.equal(JSON.parse(progress).total, total, "the scores are back");
	await shot("letters-save-2-resumed");
};
