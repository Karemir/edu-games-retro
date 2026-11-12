import { TweenPlugin } from "./TweenPlugin.js";

/**
 * Directional blur along the target's motion, like GreenSock's MotionBlurPlugin: how far the target moved
 * since the previous update, times `strength`, is the blur length. Usage: `{ x: 100, motionBlur: true }`
 * or `{ motionBlur: { strength: 2 } }`. Rendering is done by DisplayObject (see `_motionBlur`).
 * Not supported: quality, fastMode, padding, rotation-aware blurs.
 */
export class MotionBlurPlugin extends TweenPlugin {
	public static propName: string = "motionBlur";

	private target: any;
	private strength: number = 1;
	private lastX: number;
	private lastY: number;

	public onInitTween(target: Object, value: any, tween: any): boolean {
		this.target = target;
		if (typeof value == "object" && value.strength != undefined) this.strength = Number(value.strength);
		this.lastX = this.target.x;
		this.lastY = this.target.y;
		return true;
	}

	public setRatio(ratio: number): void {
		if (ratio >= 1) {
			this.onDisable();
			return;
		}
		this.target._motionBlur = { dx: this.target.x - this.lastX, dy: this.target.y - this.lastY, strength: this.strength };
		this.lastX = this.target.x;
		this.lastY = this.target.y;
	}

	public onDisable(): void {
		this.target._motionBlur = null;
	}
}
