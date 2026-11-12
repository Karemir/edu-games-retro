import { AssetLoader } from "./AssetLoader.js";
import { createContainerUI } from "./ContainerUI.js";
import { DisplayObject } from "./flash/display/DisplayObject.js";
import { LoaderInfo } from "./flash/display/LoaderInfo.js";
import { MovieClip } from "./flash/display/MovieClip.js";
import { Stage } from "./flash/display/Stage.js";
import { IOErrorEvent } from "./flash/events/IOErrorEvent.js";
import { ProgressEvent } from "./flash/events/ProgressEvent.js";
import type { Class } from "./flash/utils/Class.js";

/**
 * Plays the part of the Flash Player: builds the stage inside `container` and instantiates the root class
 * (the SWF's document class, e.g. Preloader) with `stage` and `loaderInfo` already available.
 * The root's `loaderInfo` reports AssetLoader progress and a root MovieClip reaches its last
 * frame when all assets are loaded, which is what the original Preloader waits for.
 *
 * Layout: the game canvas keeps the SWF aspect ratio and fits inside the container leaving `margin`
 * (a fraction, 0.1 = 10%) on every side. Behind it a heavily blurred copy of the game is stretched over the whole
 * container, ignoring the aspect, like the filler video players show. The blur is done on a tiny canvas (no CSS filter on
 * the full-size element, which is heavy and can flicker), and the backdrop is only refreshed once a frame is completely drawn. The container needs a size (the page decides).
 * `stage.scaleMode`/`align` set by the game have no effect: the container does the scaling.
 */
export function bootstrap(container: HTMLElement, rootClass: Class, frameRate: number = 30, width: number = 960, height: number = 600, margin: number = 0.1): Stage {
	container.style.position = "relative";
	container.style.overflow = "hidden";
	container.style.background = "#000";

	// backdrop: the finished frame is averaged down to `small`, blurred into `backdrop`, which the browser stretches over the container
	const aspect = height / width;
	const backdrop = document.createElement("canvas");
	backdrop.width = 192;
	backdrop.height = Math.max(1, Math.round(192 * aspect));
	backdrop.style.cssText = "position:absolute;left:0;top:0;width:100%;height:100%;";
	container.appendChild(backdrop);

	const canvas = document.createElement("canvas");
	canvas.id = "stage";
	canvas.width = width;
	canvas.height = height;
	canvas.style.cssText = "position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);outline:none;";
	container.appendChild(canvas);

	createContainerUI(container);

	const stage = new Stage(canvas, width, height);
	stage.frameRate = frameRate;

	const layout = () => {
		const scale = Math.min(container.clientWidth * (1 - 2 * margin) / width, container.clientHeight * (1 - 2 * margin) / height);
		const cssW = Math.max(1, width * scale), cssH = Math.max(1, height * scale);
		canvas.style.width = cssW + "px";
		canvas.style.height = cssH + "px";
		const dpr = window.devicePixelRatio || 1;
		stage.resize(Math.max(1, Math.round(cssW * dpr)), Math.max(1, Math.round(cssH * dpr)));
	};
	new ResizeObserver(layout).observe(container);
	layout();

	const small = document.createElement("canvas");
	small.width = 48;
	small.height = Math.max(1, Math.round(48 * aspect));
	const smallCtx = small.getContext("2d");
	const bctx = backdrop.getContext("2d");
	const canBlur = "filter" in bctx;
	const steps: HTMLCanvasElement[] = []; // repeated halving averages the pixels; one big drawImage would only sample a few of them
	stage.onRender = () => {
		let w = canvas.width, h = canvas.height;
		for (let i = 0; w >> 1 > small.width; i++) {
			w >>= 1;
			h >>= 1;
			const c = steps[i] || (steps[i] = document.createElement("canvas"));
			if (c.width != w || c.height != h) {
				c.width = w;
				c.height = h;
			}
		}
		let src: HTMLCanvasElement = canvas;
		for (let i = 0, sw = canvas.width; sw >> 1 > small.width; i++) {
			sw >>= 1;
			steps[i].getContext("2d").drawImage(src, 0, 0, steps[i].width, steps[i].height);
			src = steps[i];
		}
		smallCtx.drawImage(src, 0, 0, small.width, small.height);
		// slight overscan so the blur has real pixels at the edges
		const ox = backdrop.width * 0.1, oy = backdrop.height * 0.1;
		bctx.clearRect(0, 0, backdrop.width, backdrop.height);
		if (canBlur) (bctx as any).filter = "blur(9px) saturate(1.3)";
		bctx.drawImage(small, -ox, -oy, backdrop.width + 2 * ox, backdrop.height + 2 * oy);
		if (canBlur) (bctx as any).filter = "none";
	};

	const info = new LoaderInfo();
	AssetLoader.onProgress((loaded, total) => {
		info.bytesLoaded = loaded;
		info.bytesTotal = total;
		info.dispatchEvent(new ProgressEvent(ProgressEvent.PROGRESS, false, false, loaded, total));
	});
	AssetLoader.onError((url, err) => info.dispatchEvent(new IOErrorEvent(IOErrorEvent.IO_ERROR, false, false, "Error loading " + url + ": " + err)));
	canvas.addEventListener("pointerdown", () => AssetLoader.audioContext.resume());

	DisplayObject._rootInit = { stage, loaderInfo: info };
	const root = new rootClass();
	if (root instanceof MovieClip) {
		root._totalFrames = 2;
		AssetLoader.whenComplete().then(() => { root._currentFrame = 2; });
	}
	stage.addChild(root);
	stage.start();
	(window as any).__stage = stage; // debug hook for scripts/browser-test.mjs
	return stage;
}
