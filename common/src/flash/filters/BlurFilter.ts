import { BitmapFilter } from "./BitmapFilter.js";

/** Stored only; not rendered yet (see TODO.md). */
export class BlurFilter extends BitmapFilter {
	public blurX: number;
	public blurY: number;
	public quality: number;

	constructor(blurX: number = 4, blurY: number = 4, quality: number = 1) {
		super();
		this.blurX = blurX;
		this.blurY = blurY;
		this.quality = quality;
	}
}
