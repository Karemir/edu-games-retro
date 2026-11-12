import { Rectangle } from "../geom/Rectangle.js";
import { AS3_NATIVE, bindNativeMethods } from "../utils/bindMethods.js";
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
		return this.bitmapData && this.bitmapData.source ? new Rectangle(0, 0, this.bitmapData.width, this.bitmapData.height) : null;
	}

	public _drawSelf(ctx: CanvasRenderingContext2D): void {
		if (!this.bitmapData || !this.bitmapData.source) return;
		ctx.imageSmoothingEnabled = this.smoothing;
		const m = ctx.getTransform();
		if (m.b == 0 && m.c == 0 && m.a > 0 && m.d > 0) {
			// Without rotation the edges are snapped to whole device pixels. Anti-aliasing each edge on its own leaves a faint seam
			// between bitmaps that touch (they share a fractional edge); snapped, neighbours share the very same pixel boundary.
			const w = this.bitmapData.width, h = this.bitmapData.height;
			const x0 = Math.round(m.e), y0 = Math.round(m.f);
			const x1 = Math.max(x0 + 1, Math.round(m.e + m.a * w)), y1 = Math.max(y0 + 1, Math.round(m.f + m.d * h));
			ctx.save();
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.drawImage(this.bitmapData.source, 0, 0, w, h, x0, y0, x1 - x0, y1 - y0);
			ctx.restore();
			return;
		}
		ctx.drawImage(this.bitmapData.source, 0, 0);
	}
}
bindNativeMethods(Bitmap);
