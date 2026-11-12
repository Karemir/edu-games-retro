import { GameAudio } from "./GameAudio.js";
import type { AudioKind } from "./GameAudio.js";

export interface ContainerUIOptions {
	/** Where the back button goes when there is no history to go back to. */
	backUrl?: string;
	author?: string;
}

const ICON_BACK = '<path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>';
const ICON_MUSIC = '<path d="M9 17V6l10-2v11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="6.5" cy="17.5" r="2.5" fill="currentColor"/><circle cx="16.5" cy="15.5" r="2.5" fill="currentColor"/>';
const ICON_SFX = '<path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z" fill="currentColor"/><path d="M15.5 9a4.5 4.5 0 010 6M18 6.5a8 8 0 010 11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>';
const SLASH = '<path d="M4 4l16 16" stroke="#d33" stroke-width="2.6" stroke-linecap="round"/>';

const BUTTON_STYLE = "position:absolute;z-index:2;width:44px;height:44px;border:0;padding:0;border-radius:12px;background:#fff;color:#222;"
	+ "box-shadow:0 2px 10px rgba(0,0,0,.35);cursor:pointer;display:flex;align-items:center;justify-content:center;";

function svg(inner: string): string {
	return '<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">' + inner + "</svg>";
}

function button(label: string, css: string, inner: string, onClick: () => void): HTMLButtonElement {
	const b = document.createElement("button");
	b.type = "button";
	b.setAttribute("aria-label", label);
	b.title = label;
	b.style.cssText = BUTTON_STYLE + css;
	b.innerHTML = svg(inner);
	b.addEventListener("click", () => {
		onClick();
		b.blur(); // keep keyboard input (Enter/Space) with the game
	});
	return b;
}

/**
 * Chrome shared by every game, drawn as DOM on top of the container (not part of the game's canvas):
 * back button (top left), music and effects mute buttons (top right), author credit (bottom right).
 */
export function createContainerUI(container: HTMLElement, options: ContainerUIOptions = {}): void {
	const gap = "max(12px,1.5vmin)";

	container.appendChild(button("Back", "left:" + gap + ";top:" + gap + ";", ICON_BACK, () => {
		if (history.length > 1) history.back();
		else location.assign(options.backUrl || "../../");
	}));

	const mute = (kind: AudioKind, label: string, icon: string, right: string): void => {
		const b = button(label, "right:" + right + ";top:" + gap + ";", icon, () => {
			GameAudio.setMuted(kind, !GameAudio.isMuted(kind));
			paint();
		});
		const paint = () => {
			const m = GameAudio.isMuted(kind);
			b.innerHTML = svg(icon + (m ? SLASH : ""));
			b.setAttribute("aria-pressed", String(m));
			b.title = (m ? "Unmute " : "Mute ") + label.toLowerCase();
		};
		b.dataset.mute = kind;
		paint();
		container.appendChild(b);
	};
	mute("sfx", "Effects", ICON_SFX, gap);
	mute("music", "Music", ICON_MUSIC, "calc(" + gap + " + 52px)");

	const credit = document.createElement("div");
	credit.textContent = options.author ?? "by Michał Perzak";
	credit.style.cssText = "position:absolute;z-index:2;right:" + gap + ";bottom:" + gap + ";color:#fff;font:600 14px/1 system-ui,sans-serif;"
		+ "text-shadow:0 1px 4px rgba(0,0,0,.7);pointer-events:none;user-select:none;";
	container.appendChild(credit);
}
