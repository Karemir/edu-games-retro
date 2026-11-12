import { Rectangle } from "../geom/Rectangle.js";
import { AS3_NATIVE, bindNativeMethods } from "../utils/bindMethods.js";
import { DisplayObjectContainer } from "./DisplayObjectContainer.js";
import type { DisplayObject } from "./DisplayObject.js";
import { Graphics } from "./Graphics.js";

export class Sprite extends DisplayObjectContainer {
	static readonly [AS3_NATIVE] = true;

	public graphics: Graphics = new Graphics();
	public buttonMode: boolean = false;
	public useHandCursor: boolean = true;
	public hitArea: Sprite = null;
	public dropTarget: DisplayObject = null;

	public _selfBounds(): Rectangle | null { return this.graphics._bounds(); }
	public _drawSelf(ctx: CanvasRenderingContext2D): void { this.graphics._draw(ctx); }

	public _hit(x: number, y: number): DisplayObject | null {
		const h = super._hit(x, y);
		if (h) return h;
		if (!this.visible || !this.mouseEnabled) return null;
		return this.graphics._hit(x, y) ? this : null;
	}

	public startDrag(): void {}
	public stopDrag(): void {}
}
bindNativeMethods(Sprite);
