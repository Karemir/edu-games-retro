import { TweenPlugin } from "./TweenPlugin.js";

/**
 * Tweens the target's ColorTransform towards a solid colour: `{ tint: 0xFF0000 }` (full tint, multipliers to 0 and offsets to the colour).
 * Not supported: the `{ color, amount }` object form.
 */
export class TintPlugin extends TweenPlugin {
	public static propName: string = "tint";

	protected target: any;
	protected start: number[];
	protected end: number[];

	public onInitTween(target: Object, value: any, tween: any): boolean {
		this.target = target;
		const ct = this.target.transform.colorTransform;
		this.start = [ct.redMultiplier, ct.greenMultiplier, ct.blueMultiplier, ct.redOffset, ct.greenOffset, ct.blueOffset];
		this.end = this.endValues(Number(value));
		return true;
	}

	protected endValues(color: number): number[] {
		return [0, 0, 0, (color >> 16) & 0xFF, (color >> 8) & 0xFF, color & 0xFF];
	}

	public setRatio(ratio: number): void {
		const ct = this.target.transform.colorTransform;
		const v = this.start.map((s, i) => s + (this.end[i] - s) * ratio);
		ct.redMultiplier = v[0];
		ct.greenMultiplier = v[1];
		ct.blueMultiplier = v[2];
		ct.redOffset = v[3];
		ct.greenOffset = v[4];
		ct.blueOffset = v[5];
	}
}
