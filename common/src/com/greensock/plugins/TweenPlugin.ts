/** Base of the plugins that handle special tween properties (`autoAlpha`, `tint`, ...). */
export class TweenPlugin {
	public static readonly API: number = 2;
	public static propName: string = "";

	private static registry: { [prop: string]: typeof TweenPlugin } = {};

	public propName: string = "";
	public overwriteProps: string[] = [];

	/** Called when the tween starts. Return false to have the tween handle the property itself. */
	public onInitTween(target: Object, value: any, tween: any): boolean { return true; }

	/** Called when the tween ends or is killed, to undo what the plugin left on the target. */
	public onDisable(): void {}

	/** Called on every update with the eased progress (0 → 1). */
	public setRatio(ratio: number): void {}

	public static activate(plugins: Array<any>): boolean {
		for (const p of plugins) TweenPlugin.registry[p.propName] = p;
		return true;
	}

	public static create(prop: string): TweenPlugin {
		const c = TweenPlugin.registry[prop];
		return c ? new c() : null;
	}
}
