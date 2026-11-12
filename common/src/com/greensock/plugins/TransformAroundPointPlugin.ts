import { TweenPlugin } from "./TweenPlugin.js";

// TODO(port): not implemented yet; the property is ignored with a warning when a tween uses it.
export class TransformAroundPointPlugin extends TweenPlugin {
	public static propName: string = "transformAroundPoint";

	public onInitTween(target: Object, value: any, tween: any): boolean {
		console.warn("GreenSock plugin not implemented: transformAroundPoint");
		return true;
	}
}
