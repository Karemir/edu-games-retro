import { AssetLoader } from "./AssetLoader.js";
import { DisplayObject } from "./flash/display/DisplayObject.js";
import { LoaderInfo } from "./flash/display/LoaderInfo.js";
import { MovieClip } from "./flash/display/MovieClip.js";
import { Stage } from "./flash/display/Stage.js";
import { IOErrorEvent } from "./flash/events/IOErrorEvent.js";
import { ProgressEvent } from "./flash/events/ProgressEvent.js";
import type { Class } from "./flash/utils/Class.js";

/**
 * Plays the part of the Flash Player: creates the stage on a canvas and instantiates the root class
 * (the SWF's document class, e.g. Preloader) with `stage` and `loaderInfo` already available.
 * The root's `loaderInfo` reports AssetLoader progress and a root MovieClip reaches its last
 * frame when all assets are loaded, which is what the original Preloader waits for.
 */
export function bootstrap(canvas: HTMLCanvasElement, rootClass: Class, frameRate: number = 30): Stage {
	const stage = new Stage(canvas);
	stage.frameRate = frameRate;
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
	return stage;
}
