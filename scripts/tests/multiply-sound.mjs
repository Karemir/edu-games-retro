// Does a key press in the game create an effect sound, and does it reach the audio output?
const has = name => `window.__stage._children.some(c => c.constructor.name == '${name}')`;

export default async ({ ev, click, press, pt, sleep, goto }) => {
	await goto("/games/multiply/");
	for (let i = 0; i < 150 && !(await ev(`!!window.__stage && ${has("MenuView")}`)); i++) await sleep(100);
	await sleep(1000);
	await ev(`(async () => {
		const { Sound } = await import('/common/dist/flash/media/Sound.js');
		const { GameAudio } = await import('/common/dist/GameAudio.js');
		const log = window.__soundLog = [];
		const play = Sound.prototype.play;
		Sound.prototype.play = function (...a) {
			const ch = play.apply(this, a);
			log.push({ length: Math.round(this.length), buffer: !!this.buffer, loops: a[1] || 0, ctx: GameAudio.context.state, sfxGain: GameAudio.bus('sfx').gain.value, musicGain: GameAudio.bus('music').gain.value });
			return ch;
		};
	})()`);
	const p = await pt(650, 355);
	await click(p.x, p.y);
	for (let i = 0; i < 50 && !(await ev(has("GameView"))); i++) await sleep(100);
	await sleep(1500);
	await ev("window.__soundLog.length = 0");
	await press("5", "Digit5", 53);
	await sleep(300);
	await press("Backspace", "Backspace", 8);
	await sleep(300);
	console.log("sounds played by two key presses:", JSON.stringify(await ev("window.__soundLog")));
	console.log("soundsEnabled:", await ev(`(async () => { const { AppFacade } = await import('/games/multiply/dist/AppFacade.js'); const s = AppFacade.GetInstance().retrieveProxy('SoundProxy'); return JSON.stringify({ soundsEnabled: s.soundsEnabled, musicEnabled: s.musicEnabled }); })()`));
};
