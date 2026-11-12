import { createAuthorCredit } from "@edugames/common/ContainerUI.js";

interface HubGame {
	title: string;
	/** Page of the game, or null while it is not ported: the tile then carries a "soon" stamp and is not a link. */
	href: string | null;
	icon: string;
}

const GAMES: HubGame[] = [
	{ title: "Mat Wieża", href: "games/multiply/", icon: "hub/assets/icons/multiply.png" },
	{ title: "RoBo", href: "games/logic/", icon: "hub/assets/icons/logic.png" },
	{ title: "Wyścigi Literek", href: null, icon: "hub/assets/icons/letters.png" },
	{ title: "Ogród", href: null, icon: "hub/assets/icons/garden.png" },
];

const WIDTH = 960, HEIGHT = 600, MARGIN = 0.1;

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

const panel = el("div", `position:absolute;left:50%;top:${u(330)};transform:translate(-50%,-50%);display:flex;gap:${u(46)};`
	+ `padding:${u(24)} ${u(44)} ${u(18)};border-radius:${u(22)};background:rgba(20,40,10,.45);`, stage);

for (const g of GAMES) {
	const tile = g.href ? el("a", "", panel) : el("div", "", panel);
	tile.className = "tile" + (g.href ? "" : " soon");
	tile.style.cssText = `position:relative;display:flex;flex-direction:column;align-items:center;gap:${u(8)};width:${u(110)};text-decoration:none;`
		+ (g.href ? "cursor:pointer;" : "cursor:default;");
	if (g.href) {
		(tile as HTMLAnchorElement).href = g.href;
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

const layout = () => {
	const scale = Math.min(container.clientWidth * (1 - 2 * MARGIN) / WIDTH, container.clientHeight * (1 - 2 * MARGIN) / HEIGHT);
	container.style.setProperty("--u", Math.max(0.1, scale) + "px");
};
new ResizeObserver(layout).observe(container);
layout();
