export type AudioKind = "music" | "sfx";

const STORAGE_KEY = "edugames:muted:";

/**
 * The one audio graph of the page: a context with a music bus and an effects bus, each with its own mute
 * (remembered in localStorage). Sound.play() routes looping sounds to music and one-shots to effects.
 */
export class GameAudio {
	private static _context: AudioContext = null;
	private static buses: { [kind: string]: GainNode } = {};

	public static get context(): AudioContext {
		if (!GameAudio._context) {
			const ctx = new AudioContext();
			for (const kind of ["music", "sfx"] as AudioKind[]) {
				const g = ctx.createGain();
				g.gain.value = GameAudio.isMuted(kind) ? 0 : 1;
				g.connect(ctx.destination);
				GameAudio.buses[kind] = g;
			}
			GameAudio._context = ctx;
		}
		return GameAudio._context;
	}

	public static bus(kind: AudioKind): GainNode {
		GameAudio.context;
		return GameAudio.buses[kind];
	}

	public static isMuted(kind: AudioKind): boolean {
		try {
			return localStorage.getItem(STORAGE_KEY + kind) == "1";
		} catch (e) {
			return false;
		}
	}

	public static setMuted(kind: AudioKind, muted: boolean): void {
		try {
			localStorage.setItem(STORAGE_KEY + kind, muted ? "1" : "0");
		} catch (e) {}
		if (GameAudio._context) GameAudio.buses[kind].gain.value = muted ? 0 : 1;
	}
}
