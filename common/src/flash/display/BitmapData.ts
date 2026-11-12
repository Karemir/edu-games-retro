export type BitmapSource = ImageBitmap | HTMLImageElement | HTMLCanvasElement | OffscreenCanvas;

export class BitmapData {
	public source: BitmapSource;
	public width: number;
	public height: number;
	public transparent: boolean;

	constructor(width: number, height: number, transparent: boolean = true, fillColor: number = 0xFFFFFFFF) {
		this.width = width;
		this.height = height;
		this.transparent = transparent;
		const c = document.createElement("canvas");
		c.width = width;
		c.height = height;
		const alpha = ((fillColor >>> 24) & 0xFF) / 255;
		if (alpha > 0) {
			const ctx = c.getContext("2d");
			ctx.fillStyle = "rgba(" + ((fillColor >> 16) & 0xFF) + "," + ((fillColor >> 8) & 0xFF) + "," + (fillColor & 0xFF) + "," + alpha + ")";
			ctx.fillRect(0, 0, width, height);
		}
		this.source = c;
	}

	/** PORT: wraps an already decoded browser image (AS3 builds BitmapData from pixels or a Loader). */
	public static fromSource(source: BitmapSource): BitmapData {
		const bd = new BitmapData(1, 1);
		bd.source = source;
		bd.width = source.width;
		bd.height = source.height;
		return bd;
	}

	public clone(): BitmapData {
		return BitmapData.fromSource(this.source);
	}

	public dispose(): void {
		this.width = this.height = 0;
	}
}
