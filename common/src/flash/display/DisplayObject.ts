import { Event } from "../events/Event.js";
import { EventDispatcher } from "../events/EventDispatcher.js";
import { Matrix } from "../geom/Matrix.js";
import { Point } from "../geom/Point.js";
import { Rectangle } from "../geom/Rectangle.js";
import { Transform } from "../geom/Transform.js";
import { AS3_NATIVE, bindNativeMethods } from "../utils/bindMethods.js";
import type { DisplayObjectContainer } from "./DisplayObjectContainer.js";
import type { LoaderInfo } from "./LoaderInfo.js";
import type { Stage } from "./Stage.js";

export class DisplayObject extends EventDispatcher {
	static readonly [AS3_NATIVE] = true;

	/** PORT: the root object is constructed before it is on the stage, but AS3 already gives it `stage`/`loaderInfo`. */
	public static _rootInit: { stage: Stage; loaderInfo: LoaderInfo } = null;

	public x: number = 0;
	public y: number = 0;
	public scaleX: number = 1;
	public scaleY: number = 1;
	public rotation: number = 0;
	public alpha: number = 1;
	public visible: boolean = true;
	public name: string;
	public blendMode: string = "normal";
	public cacheAsBitmap: boolean = false;
	/** Set by MotionBlurPlugin: per-frame movement in parent space. */
	public _motionBlur: { dx: number; dy: number; strength: number } = null;
	private _mask: DisplayObject = null;
	private _maskOf: DisplayObject = null;
	public filters: any[] = [];
	public transform: Transform;
	public _parent: DisplayObjectContainer = null;
	public _stage: Stage = null;
	public _loaderInfo: LoaderInfo = null;

	private static instanceCount: number = 0;

	constructor() {
		super();
		this.name = "instance" + (++DisplayObject.instanceCount);
		this.transform = new Transform(this);
		if (DisplayObject._rootInit) {
			this._stage = DisplayObject._rootInit.stage;
			this._loaderInfo = DisplayObject._rootInit.loaderInfo;
			DisplayObject._rootInit = null;
		}
	}

	/** Clips this object to the filled shape of `mask` (a Sprite or Shape). The mask itself is not drawn. */
	public get mask(): DisplayObject { return this._mask; }
	public set mask(value: DisplayObject) {
		if (this._mask) this._mask._maskOf = null;
		this._mask = value;
		if (value) value._maskOf = this;
	}

	public get parent(): DisplayObjectContainer { return this._parent; }
	public get stage(): Stage { return this._stage; }
	public get loaderInfo(): LoaderInfo { return this._loaderInfo || (this._parent ? this._parent.loaderInfo : null); }
	public get root(): DisplayObject {
		let o: DisplayObject = this;
		while (o._parent && o._parent !== (o._stage as any)) o = o._parent;
		return o;
	}

	protected getEventParent(): EventDispatcher { return this._parent; }

	public get mouseX(): number { return this._stage ? this.globalToLocal(new Point(this._stage.mouseX, this._stage.mouseY)).x : 0; }
	public get mouseY(): number { return this._stage ? this.globalToLocal(new Point(this._stage.mouseX, this._stage.mouseY)).y : 0; }

	// ---- geometry

	public _localMatrix(): Matrix {
		const r = this.rotation * Math.PI / 180;
		const cos = Math.cos(r), sin = Math.sin(r);
		return new Matrix(cos * this.scaleX, sin * this.scaleX, -sin * this.scaleY, cos * this.scaleY, this.x, this.y);
	}

	public _globalMatrix(): Matrix {
		const m = this._localMatrix();
		for (let p = this._parent; p; p = p._parent) {
			const pm = p._localMatrix();
			pm.concat(m);
			m.a = pm.a; m.b = pm.b; m.c = pm.c; m.d = pm.d; m.tx = pm.tx; m.ty = pm.ty;
		}
		return m;
	}

	/** Own content bounds in local space, without children. */
	public _selfBounds(): Rectangle | null { return null; }

	/** Content bounds (including children) in local space. */
	public _contentBounds(): Rectangle { return this._selfBounds() || new Rectangle(); }

	public getBounds(targetCoordinateSpace: DisplayObject): Rectangle {
		const b = this._contentBounds();
		if (b.isEmpty() && b.width == 0 && b.height == 0 && b.x == 0 && b.y == 0) return b;
		const m = this._globalMatrix();
		if (targetCoordinateSpace) {
			const inv = targetCoordinateSpace._globalMatrix();
			inv.invert();
			inv.concat(m);
			return DisplayObject.transformRect(b, inv);
		}
		return DisplayObject.transformRect(b, m);
	}

	public getRect(targetCoordinateSpace: DisplayObject): Rectangle {
		return this.getBounds(targetCoordinateSpace);
	}

	private static transformRect(r: Rectangle, m: Matrix): Rectangle {
		const pts = [new Point(r.x, r.y), new Point(r.right, r.y), new Point(r.x, r.bottom), new Point(r.right, r.bottom)].map(p => m.transformPoint(p));
		const xs = pts.map(p => p.x), ys = pts.map(p => p.y);
		const l = Math.min(...xs), t = Math.min(...ys);
		return new Rectangle(l, t, Math.max(...xs) - l, Math.max(...ys) - t);
	}

	public get width(): number {
		return this.getBounds(this._parent || this).width;
	}

	public set width(value: number) {
		const w = this._contentBounds().width;
		if (w != 0) this.scaleX = value / w;
	}

	public get height(): number {
		return this.getBounds(this._parent || this).height;
	}

	public set height(value: number) {
		const h = this._contentBounds().height;
		if (h != 0) this.scaleY = value / h;
	}

	public localToGlobal(point: Point): Point {
		return this._globalMatrix().transformPoint(point);
	}

	public globalToLocal(point: Point): Point {
		const m = this._globalMatrix();
		m.invert();
		return m.transformPoint(point);
	}

	public hitTestPoint(x: number, y: number, shapeFlag: boolean = false): boolean {
		const p = this.globalToLocal(new Point(x, y));
		if (shapeFlag) return this._hit(p.x, p.y) !== null;
		return this._contentBounds().contains(p.x, p.y);
	}

	// ---- rendering & hit testing (local coordinates)

	public _drawSelf(ctx: CanvasRenderingContext2D): void {}

	public _render(ctx: CanvasRenderingContext2D): void {
		if (!this.visible || this.alpha <= 0 || this._maskOf) return;
		ctx.save();
		const g = this._mask && (this._mask as any).graphics;
		if (g) {
			// the mask lives in its own coordinate space: express it relative to the current (parent) space
			const base = ctx.getTransform();
			const rel = this._parent ? this._parent._globalMatrix() : new Matrix();
			rel.invert();
			rel.concat(this._mask._globalMatrix());
			ctx.transform(rel.a, rel.b, rel.c, rel.d, rel.tx, rel.ty);
			ctx.clip(g._clipPath());
			ctx.setTransform(base);
		}
		const m = this._localMatrix();
		ctx.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
		ctx.globalAlpha *= this.alpha;
		if (this._motionBlur && Math.abs(this._motionBlur.dx) + Math.abs(this._motionBlur.dy) >= 1) {
			this._renderBlurred(ctx);
		} else if (this.transform.colorTransform._isIdentity()) {
			this._drawSelf(ctx);
			this._renderChildren(ctx);
		} else {
			this._renderTinted(ctx);
		}
		ctx.restore();
	}

	public _renderChildren(ctx: CanvasRenderingContext2D): void {}

	/** Motion blur: draw once offscreen, then average copies spread along the movement (alpha 1/1, 1/2, ... 1/n). */
	private _renderBlurred(ctx: CanvasRenderingContext2D): void {
		const mb = this._motionBlur;
		const lx = mb.dx * mb.strength / (this.scaleX || 1), ly = mb.dy * mb.strength / (this.scaleY || 1);
		const b = this._contentBounds();
		if (b.width <= 0 || b.height <= 0) return;
		const w = Math.ceil(b.width) + 2, h = Math.ceil(b.height) + 2;
		const cv = document.createElement("canvas");
		cv.width = w;
		cv.height = h;
		const c2 = cv.getContext("2d");
		c2.translate(1 - b.x, 1 - b.y);
		this._drawSelf(c2);
		this._renderChildren(c2);
		const n = Math.min(40, Math.max(2, Math.ceil(Math.hypot(lx, ly))));
		const base = ctx.globalAlpha;
		for (let k = 0; k < n; k++) {
			const t = k / (n - 1) - 0.5;
			ctx.globalAlpha = base / (k + 1);
			ctx.drawImage(cv, b.x - 1 + t * lx, b.y - 1 + t * ly);
		}
		ctx.globalAlpha = base;
	}

	/** ColorTransform: draw this object and its children offscreen, transform the pixels, then composite. */
	private _renderTinted(ctx: CanvasRenderingContext2D): void {
		const b = this._contentBounds();
		if (b.width <= 0 || b.height <= 0) return;
		const w = Math.ceil(b.width) + 2, h = Math.ceil(b.height) + 2;
		const cv = document.createElement("canvas");
		cv.width = w;
		cv.height = h;
		const c2 = cv.getContext("2d");
		c2.translate(1 - b.x, 1 - b.y);
		this._drawSelf(c2);
		this._renderChildren(c2);
		const ct = this.transform.colorTransform;
		const img = c2.getImageData(0, 0, w, h);
		const d = img.data;
		for (let i = 0; i < d.length; i += 4) {
			d[i] = d[i] * ct.redMultiplier + ct.redOffset;
			d[i + 1] = d[i + 1] * ct.greenMultiplier + ct.greenOffset;
			d[i + 2] = d[i + 2] * ct.blueMultiplier + ct.blueOffset;
			d[i + 3] = d[i + 3] * ct.alphaMultiplier + ct.alphaOffset;
		}
		c2.setTransform(1, 0, 0, 1, 0, 0);
		c2.putImageData(img, 0, 0);
		ctx.drawImage(cv, b.x - 1, b.y - 1);
	}

	/** Topmost object under the point (given in local space) or null. */
	public _hit(x: number, y: number): DisplayObject | null {
		if (!this.visible) return null;
		const b = this._selfBounds();
		return b && b.contains(x, y) ? this : null;
	}

	public _addedToStage(stage: Stage): void {
		this._stage = stage;
		this.dispatchEvent(new Event(Event.ADDED_TO_STAGE));
	}

	public _removedFromStage(): void {
		this.dispatchEvent(new Event(Event.REMOVED_FROM_STAGE));
		this._stage = null;
	}
}
bindNativeMethods(DisplayObject);
