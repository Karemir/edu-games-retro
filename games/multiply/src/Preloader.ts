import { DisplayObject } from "@edugames/common/flash/display/DisplayObject.js";
import { MovieClip } from "@edugames/common/flash/display/MovieClip.js";
import { Sprite } from "@edugames/common/flash/display/Sprite.js";
import { StageAlign } from "@edugames/common/flash/display/StageAlign.js";
import { StageScaleMode } from "@edugames/common/flash/display/StageScaleMode.js";
import { Event } from "@edugames/common/flash/events/Event.js";
import { IOErrorEvent } from "@edugames/common/flash/events/IOErrorEvent.js";
import { ProgressEvent } from "@edugames/common/flash/events/ProgressEvent.js";
import { getDefinitionByName } from "@edugames/common/flash/utils/getDefinitionByName.js";
import type { Class } from "@edugames/common/flash/utils/Class.js";

/**
 * ...
 * @author Perz
 */
export class Preloader extends MovieClip {
	// PORT: minimal loading indicator, filling the original "TODO show loader" spots.
	private loaderBar: Sprite;

	constructor() {
		super();
		if (this.stage) {
			this.stage.scaleMode = StageScaleMode.NO_SCALE;
			this.stage.align = StageAlign.TOP_LEFT;
		}
		this.addEventListener(Event.ENTER_FRAME, this.checkFrame);
		this.loaderInfo.addEventListener(ProgressEvent.PROGRESS, this.progress);
		this.loaderInfo.addEventListener(IOErrorEvent.IO_ERROR, this.ioError);

		// TODO show loader
		this.loaderBar = new Sprite();
		this.loaderBar.x = 330;
		this.loaderBar.y = 290;
		this.addChild(this.loaderBar);
		this.progress(new ProgressEvent(ProgressEvent.PROGRESS, false, false, 0, 1));
	}

	private ioError(e: IOErrorEvent): void {
		console.log(e.text); // PORT: trace()
	}

	private progress(e: ProgressEvent): void {
		// TODO update loader
		const g = this.loaderBar.graphics;
		g.clear();
		g.beginFill(0xCCCCCC);
		g.drawRect(0, 0, 300, 20);
		g.beginFill(0x3388CC);
		g.drawRect(0, 0, 300 * (e.bytesTotal > 0 ? e.bytesLoaded / e.bytesTotal : 0), 20);
	}

	private checkFrame(e: Event): void {
		if (this.currentFrame == this.totalFrames) {
			this.stop();
			this.loadingFinished();
		}
	}

	private loadingFinished(): void {
		this.removeEventListener(Event.ENTER_FRAME, this.checkFrame);
		this.loaderInfo.removeEventListener(ProgressEvent.PROGRESS, this.progress);
		this.loaderInfo.removeEventListener(IOErrorEvent.IO_ERROR, this.ioError);

		// TODO hide loader
		this.removeChild(this.loaderBar);

		this.startup();
	}

	private startup(): void {
		const mainClass: Class = getDefinitionByName("Main") as Class;
		this.addChild(new mainClass() as DisplayObject);
	}
}
