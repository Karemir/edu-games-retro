import { BitmapFilter } from "./BitmapFilter.js";

/** Rendered by DisplayObject as a canvas shadow (approximation: blur, strength stacking; no inner/knockout/hideObject). */
export class DropShadowFilter extends BitmapFilter {
	public distance: number;
	public angle: number;
	public color: number;
	public alpha: number;
	public blurX: number;
	public blurY: number;
	public strength: number;
	public quality: number;
	public inner: boolean;
	public knockout: boolean;
	public hideObject: boolean;

	constructor(distance: number = 4, angle: number = 45, color: number = 0, alpha: number = 1, blurX: number = 4, blurY: number = 4,
		strength: number = 1, quality: number = 1, inner: boolean = false, knockout: boolean = false, hideObject: boolean = false) {
		super();
		this.distance = distance;
		this.angle = angle;
		this.color = color;
		this.alpha = alpha;
		this.blurX = blurX;
		this.blurY = blurY;
		this.strength = strength;
		this.quality = quality;
		this.inner = inner;
		this.knockout = knockout;
		this.hideObject = hideObject;
	}

	public clone(): BitmapFilter {
		return new DropShadowFilter(this.distance, this.angle, this.color, this.alpha, this.blurX, this.blurY, this.strength, this.quality, this.inner, this.knockout, this.hideObject);
	}
}
