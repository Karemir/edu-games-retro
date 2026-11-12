import { TweenPlugin } from "./TweenPlugin.js";

// TODO(port): not implemented yet; the property is ignored with a warning when a tween uses it.
export class TintPlugin extends TweenPlugin {
	public static propName: string = "tint";

	public onInitTween(target: Object, value: any, tween: any): boolean {
		console.warn("GreenSock plugin not implemented: tint");
		return true;
	}
}
