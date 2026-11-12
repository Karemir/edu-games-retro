import { MovieClip } from "@edugames/common/flash/display/MovieClip.js";
import { Rectangle } from "@edugames/common/flash/geom/Rectangle.js";
import { Event } from "@edugames/common/flash/events/Event.js";
import type { Bitmap } from "@edugames/common/flash/display/Bitmap.js";
import type { Class } from "@edugames/common/flash/utils/Class.js";
import { ITEM_SHEET_ZOOM, ITEM_SHEETS } from "./ItemSheets.js";

/**
 * PORT: stands in for the vector library symbols (itm_1 .. itm_21) of the original ogrod_popr_01.swc. Their frames were
 * exported once with JPEXS (see scripts/tools/make-garden-items.mjs) and packed into one sprite sheet per symbol.
 * Plays its timeline like a Flash MovieClip: one frame per ENTER_FRAME while on the stage, until stop().
 */
export class ItemClip extends MovieClip {
	private sheet: Bitmap;
	private frames: number;
	private frameW: number;
	private frameH: number;
	private cols: number;
	private playing: boolean = true;

	constructor(symbol: string, sheetClass: Class) {
		super();
		const info = ITEM_SHEETS[symbol];
		this.sheet = new sheetClass() as Bitmap;
		this.frames = info.frames;
		this.frameW = info.w;
		this.frameH = info.h;
		this.cols = info.cols;
		this._totalFrames = info.frames;
		this.addEventListener(Event.ADDED_TO_STAGE, this.OnItemAdded);
		this.addEventListener(Event.REMOVED_FROM_STAGE, this.OnItemRemoved);
	}

	private OnItemAdded(e: Event): void {
		this.addEventListener(Event.ENTER_FRAME, this.OnItemFrame);
	}

	private OnItemRemoved(e: Event): void {
		this.removeEventListener(Event.ENTER_FRAME, this.OnItemFrame);
	}

	private OnItemFrame(e: Event): void {
		if (this.playing && this.frames > 1) this._currentFrame = this._currentFrame % this.frames + 1;
	}

	public play(): void { this.playing = true; }
	public stop(): void { this.playing = false; }

	public gotoAndStop(frame: any, scene: string = null): void {
		this._currentFrame = Math.min(Math.max(1, Number(frame)), this.frames);
		this.playing = false;
	}

	public gotoAndPlay(frame: any, scene: string = null): void {
		this._currentFrame = Math.min(Math.max(1, Number(frame)), this.frames);
		this.playing = true;
	}

	public nextFrame(): void { this.gotoAndStop(this._currentFrame + 1); }
	public prevFrame(): void { this.gotoAndStop(this._currentFrame - 1); }

	public _selfBounds(): Rectangle | null {
		return new Rectangle(0, 0, this.frameW / ITEM_SHEET_ZOOM, this.frameH / ITEM_SHEET_ZOOM);
	}

	public _drawSelf(ctx: CanvasRenderingContext2D): void {
		const src = this.sheet.bitmapData.source;
		if (!src) return;
		const i = this._currentFrame - 1;
		ctx.imageSmoothingEnabled = true;
		ctx.drawImage(src, (i % this.cols) * this.frameW, Math.floor(i / this.cols) * this.frameH, this.frameW, this.frameH,
			0, 0, this.frameW / ITEM_SHEET_ZOOM, this.frameH / ITEM_SHEET_ZOOM);
	}
}
