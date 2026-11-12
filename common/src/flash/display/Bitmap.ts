import { Rectangle } from "../geom/Rectangle.js";
import { AS3_NATIVE } from "../utils/bindMethods.js";
import type { BitmapData } from "./BitmapData.js";
import { DisplayObject } from "./DisplayObject.js";

export class Bitmap extends DisplayObject {
	static readonly [AS3_NATIVE] = true;

	public bitmapData: BitmapData;
	public smoothing: boolean;
	public pixelSnapping: string;

	constructor(bitmapData: BitmapData = null, pixelSnapping: string = "auto", smoothing: boolean = false) {
		super();
		this.bitmapData = bitmapData;
		this.pixelSnapping = pixelSnapping;
		this.smoothing = smoothing;
	}

	public _selfBounds(): Rectangle | null {
		return this.bitmapData ? new Rectangle(0, 0, this.bitmapData.width, this.bitmapData.height) : null;
	}

	public _drawSelf(ctx: CanvasRenderingContext2D): void {
		if (!this.bitmapData) return;
		ctx.imageSmoothingEnabled = this.smoothing;
		ctx.drawImage(this.bitmapData.source, 0, 0);
	}
}
