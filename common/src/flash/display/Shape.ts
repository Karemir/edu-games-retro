import { Rectangle } from "../geom/Rectangle.js";
import { AS3_NATIVE, bindNativeMethods } from "../utils/bindMethods.js";
import { DisplayObject } from "./DisplayObject.js";
import { Graphics } from "./Graphics.js";

export class Shape extends DisplayObject {
	static readonly [AS3_NATIVE] = true;

	public graphics: Graphics = new Graphics();

	public _selfBounds(): Rectangle | null { return this.graphics._bounds(); }
	public _drawSelf(ctx: CanvasRenderingContext2D): void { this.graphics._draw(ctx); }
	public _hitSelf(x: number, y: number): boolean { return this.graphics._hit(x, y); }
	public _hit(x: number, y: number): DisplayObject | null { return this.visible && this.graphics._hit(x, y) ? this : null; }
}
bindNativeMethods(Shape);
