import { AssetLoader } from "./AssetLoader.js";
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
 * container, ignoring the aspect, like the filler video players show. The container needs a size (the page decides).
 * `stage.scaleMode`/`align` set by the game have no effect: the container does the scaling.
 */
export function bootstrap(container: HTMLElement, rootClass: Class, frameRate: number = 30, width: number = 960, height: number = 600, margin: number = 0.1): Stage {
	container.style.position = "relative";
	container.style.overflow = "hidden";
	container.style.background = "#000";

	const backdrop = document.createElement("canvas");
	backdrop.width = 64;
	backdrop.height = Math.max(1, Math.round(64 * height / width));
	backdrop.style.cssText = "position:absolute;left:0;top:0;width:100%;height:100%;filter:blur(48px) saturate(1.3);transform:scale(1.25);";
	container.appendChild(backdrop);

	const canvas = document.createElement("canvas");
	canvas.id = "stage";
	canvas.width = width;
	canvas.height = height;
	canvas.style.cssText = "position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);outline:none;";
	container.appendChild(canvas);

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

	const bctx = backdrop.getContext("2d");
	stage.onRender = () => {
		bctx.drawImage(canvas, 0, 0, backdrop.width, backdrop.height);
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
