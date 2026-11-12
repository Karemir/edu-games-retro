import assert from "node:assert/strict";

// Boots Letters and plays: menu -> snail selection -> tournaments -> map -> a whole race (typing the words) -> result popup.
const names = `JSON.stringify(window.__stage._children.map(c => c.constructor.name))`;
const word = `(() => { let r = null; const walk = o => { if (o.constructor.name == 'RaceScreen') r = o; (o._children || []).forEach(walk); }; walk(window.__stage); return r && r.displayedText ? r.displayedText.textFields.map(t => t.text).join('') : null; })()`;

export default async ({ ev, shot, click, pt, press, sleep, goto }) => {
	await goto("/");
	await sleep(400);
	await ev("localStorage.clear(); 'ok'");
	await goto("/games/letters/");
	for (let i = 0; i < 300 && !(await ev(`!!window.__stage && window.__stage._children.length > 1`)); i++) await sleep(100);
	await sleep(2000);
	assert.ok((await ev(names)).includes("MainMenuScreen"), "menu is shown");
	await shot("letters-1-menu");

	const step = async (x, y, waitMs, expect, label) => {
		const p = await pt(x, y);
		await click(p.x, p.y);
		await sleep(waitMs);
		if (expect) assert.ok((await ev(names)).includes(expect), `${label}: expected ${expect}, got ${await ev(names)}`);
	};
	await step(779, 395, 2500, "MainMenuScreen", "GRAJ");     // snail selection panel appears on the menu
	await shot("letters-2-snails");
	await step(271, 352, 3500, "MainMenuScreen", "START");    // tournament choice panel
	await shot("letters-3-tournaments");
	await step(473, 187, 4000, "RaceSummaryScreen", "race 1"); // map of places
	await shot("letters-4-map");
	await step(259, 395, 4000, "RaceScreen", "race button");  // the race
	await shot("letters-5-race");
	assert.ok(await ev(word), "the word is shown by SplitTextField");

	let words = 0, last = "", same = 0;
	for (let guard = 0; guard < 80 && same < 3; guard++) {
		const w = await ev(word);
		if (!w) { await sleep(300); continue; }
		same = w == last ? same + 1 : 0;
		last = w;
		for (const ch of w) {
			const code = ch.toUpperCase().charCodeAt(0);
			await press(ch.toLowerCase(), "Key" + ch.toUpperCase(), code < 128 ? code : 0);
			await sleep(120);
		}
		words++;
		if (words == 1) await shot("letters-6-typing");
		await sleep(600);
	}
	assert.ok(words >= 10, `typed ${words} words`);
	await sleep(1500);
	await shot("letters-7-finish");
	const achievements = JSON.parse(await ev("localStorage.getItem('edugames:achievements') || '[]'"));
	assert.ok(achievements.includes(8), "5 words in a row unlock achievement 8: " + achievements);
	console.log(`typed ${words} words, achievements: ${achievements}`);
};
