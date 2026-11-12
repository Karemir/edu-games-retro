import { AssetLoader } from "@edugames/common/AssetLoader.js";
import { createAuthorCredit } from "@edugames/common/ContainerUI.js";

interface HubGame {
	title: string;
	/** Page of the game, or null while it is not ported: the tile then carries a "soon" stamp and is not a link. */
	href: string | null;
	icon: string;
	/** Line of the layout (0 = first). */
	row: number;
}

const GAMES: HubGame[] = [
	{ title: "Mat Wieża", href: "games/multiply/", icon: "hub/assets/icons/multiply.png", row: 0 },
	{ title: "RoBo", href: "games/logic/", icon: "hub/assets/icons/logic.png", row: 0 },
	{ title: "Wyścigi Literek", href: null, icon: "hub/assets/icons/letters.png", row: 0 },
	{ title: "Ogród", href: "games/garden/", icon: "hub/assets/icons/garden.png", row: 1 },
];

const WIDTH = 960, HEIGHT = 600, MARGIN = 0.1;
/** The loader always lasts at least this long, however fast the assets arrive. */
const MIN_LOADER_MS = 1000;
/** Walk cycle of the robot (Logic's bottom-right frames: 1, 2, 1, 3). */
const ROBOT_FRAMES = ["hub/assets/robo/BR_1.png", "hub/assets/robo/BR_2.png", "hub/assets/robo/BR_1.png", "hub/assets/robo/BR_3.png"];

/** Sizes are written in "stage pixels" (px of the 960x600 layout the games use) through the --u custom property. */
const u = (n: number) => "calc(" + n + " * var(--u))";

function el<K extends keyof HTMLElementTagNameMap>(tag: K, css: string, parent?: HTMLElement): HTMLElementTagNameMap[K] {
	const e = document.createElement(tag);
	e.style.cssText = css;
	if (parent) parent.appendChild(e);
	return e;
}

const container = document.getElementById("container");
container.style.cssText = "position:relative;overflow:hidden;background:#000;";

const style = document.createElement("style");
style.textContent = `
	@font-face { font-family: "MBold"; src: url("hub/assets/MYRIADPRO-BOLD.OTF"); }
	.tile { transition: transform .12s ease-out; }
	a.tile:hover, a.tile:focus-visible { transform: translateY(${u(-5)}); outline: none; }
	a.tile:hover img, a.tile:focus-visible img { filter: drop-shadow(0 0 ${u(8)} #fff); }
	a.tile:active { transform: translateY(${u(-2)}); }
`;
document.head.appendChild(style);

// backdrop: the forest of Multiply's game background stretched over the whole window and blurred (static, so a CSS blur is fine here)
const backdrop = el("div", "position:absolute;left:-5%;top:-5%;width:110%;height:110%;background:url(hub/assets/hubBg.jpg) center/100% 100%;filter:blur(40px) saturate(1.3);");
container.appendChild(backdrop);

const stage = el("div", `position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:${u(WIDTH)};height:${u(HEIGHT)};`
	+ "background:url(hub/assets/hubBg.jpg) center/100% 100%;overflow:hidden;", container);

const panel = el("div", `position:absolute;left:50%;top:${u(335)};transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;gap:${u(22)};`
	+ `padding:${u(24)} ${u(44)} ${u(18)};border-radius:${u(22)};background:rgba(20,40,10,.45);`, stage);
const rows = [0, 1].map(() => el("div", `display:flex;gap:${u(46)};`, panel));

for (const g of GAMES) {
	const tile = g.href ? el("a", "", rows[g.row]) : el("div", "", rows[g.row]);
	tile.className = "tile" + (g.href ? "" : " soon");
	tile.style.cssText = `position:relative;display:flex;flex-direction:column;align-items:center;gap:${u(8)};width:${u(110)};text-decoration:none;`
		+ (g.href ? "cursor:pointer;" : "cursor:default;");
	if (g.href) {
		(tile as HTMLAnchorElement).href = g.href;
		tile.addEventListener("click", e => {
			if ((e as MouseEvent).metaKey || (e as MouseEvent).ctrlKey || (e as MouseEvent).shiftKey || (e as MouseEvent).button != 0) return; // let the browser open it in a new tab
			e.preventDefault();
			launch(g.href);
		});
	} else {
		tile.setAttribute("aria-disabled", "true");
		tile.title = g.title + " (soon)";
	}

	const art = el("div", `position:relative;width:${u(87)};height:${u(85)};`, tile);
	const img = el("img", `width:100%;height:100%;display:block;${g.href ? "" : "filter:grayscale(.65) brightness(.8);"}`, art);
	img.src = g.icon;
	img.alt = "";
	img.draggable = false;
	if (!g.href) {
		const stamp = el("span", `position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(-14deg);padding:${u(1)} ${u(8)};`
			+ `border:${u(3)} solid #d6302a;border-radius:${u(5)};color:#d6302a;background:rgba(255,255,255,.88);`
			+ `font:800 ${u(17)}/1.15 system-ui,sans-serif;letter-spacing:${u(1.5)};text-transform:uppercase;white-space:nowrap;`
			+ "box-shadow:0 1px 4px rgba(0,0,0,.4);", art);
		stamp.textContent = "soon";
	}

	const label = el("div", `font-family:MBold,system-ui,sans-serif;font-size:${u(19)};line-height:1.1;color:#fff;text-align:center;`
		+ "text-shadow:0 1px 4px rgba(0,0,0,.85);", tile);
	label.textContent = g.title;
}

createAuthorCredit(container);

// Pressing a game: hide the buttons, let the robot walk left to right while the game's assets load, then start the game in this page.
let launching = false;

async function launch(base: string): Promise<void> {
	if (launching) return;
	launching = true;
	// resolve everything against the hub page first: pushState below changes what relative URLs mean
	const gameRoot = new URL(base, location.href).href;
	const robotFrames = ROBOT_FRAMES.map(f => new URL(f, location.href).href);
	history.pushState(null, "", base); // Back (popstate) brings the hub back; reloading this URL opens the game's own page
	panel.style.display = "none";

	const track = el("div", `position:absolute;left:50%;top:${u(330)};transform:translate(-50%,-50%);width:${u(640)};height:${u(120)};`
		+ `border-radius:${u(22)};background:rgba(20,40,10,.45);`, stage);
	const robot = el("img", `position:absolute;left:0;top:${u(18)};width:${u(65)};height:${u(85)};display:block;`, track);
	robot.draggable = false;
	robot.alt = "";
	const startedAt = performance.now();
	let boot: ((container: HTMLElement) => void) | null = null;

	AssetLoader.basePath = gameRoot; // the game's embeds are relative to its own folder
	const gameModule: string = "../../" + base + "dist/Boot.js";
	import(gameModule).then(m => { boot = m.boot; }); // importing registers every embed, which starts the loading

	const frame = (now: number) => {
		const elapsed = now - startedAt;
		const real = boot && AssetLoader.total > 0 ? AssetLoader.done / AssetLoader.total : 0;
		const progress = Math.min(real, elapsed / MIN_LOADER_MS);
		robot.src = robotFrames[Math.floor(elapsed / 110) % robotFrames.length];
		robot.style.left = u(20 + progress * (640 - 40 - 65));
		if (progress >= 1 && boot) {
			container.replaceChildren();
			container.removeAttribute("style");
			boot(container);
		} else {
			requestAnimationFrame(frame);
		}
	};
	requestAnimationFrame(frame);
}

window.addEventListener("popstate", () => location.reload());

const layout = () => {
	const scale = Math.min(container.clientWidth * (1 - 2 * MARGIN) / WIDTH, container.clientHeight * (1 - 2 * MARGIN) / HEIGHT);
	container.style.setProperty("--u", Math.max(0.1, scale) + "px");
};
new ResizeObserver(layout).observe(container);
layout();
