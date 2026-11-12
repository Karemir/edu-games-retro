import { TweenPlugin } from "./TweenPlugin.js";

// TODO(port): not implemented yet; the property is ignored with a warning when a tween uses it.
export class RemoveTintPlugin extends TweenPlugin {
	public static propName: string = "removeTint";

	public onInitTween(target: Object, value: any, tween: any): boolean {
		console.warn("GreenSock plugin not implemented: removeTint");
		return true;
	}
}
