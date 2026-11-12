import { TweenPlugin } from "./TweenPlugin.js";

/** Tweens `alpha` and keeps `visible` in sync: hidden at 0, shown otherwise. */
export class AutoAlphaPlugin extends TweenPlugin {
	public static propName: string = "autoAlpha";

	private target: any;
	private start: number;
	private change: number;

	public onInitTween(target: Object, value: any, tween: any): boolean {
		this.target = target;
		this.start = this.target.alpha;
		this.change = Number(value) - this.start;
		return true;
	}

	public setRatio(ratio: number): void {
		this.target.alpha = this.start + this.change * ratio;
		this.target.visible = this.target.alpha != 0;
	}
}
