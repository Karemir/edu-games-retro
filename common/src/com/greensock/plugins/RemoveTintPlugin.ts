import { TintPlugin } from "./TintPlugin.js";

/** `{ removeTint: true }`: tweens the target's ColorTransform back to normal. */
export class RemoveTintPlugin extends TintPlugin {
	public static propName: string = "removeTint";

	protected endValues(color: number): number[] {
		return [1, 1, 1, 0, 0, 0];
	}
}
