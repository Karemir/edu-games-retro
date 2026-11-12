import { DropShadowFilter } from "../filters/DropShadowFilter.js";
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

// Scratch canvases for offscreen passes (tint, motion blur). Used as a stack: acquire/release in LIFO order.
const scratchPool: HTMLCanvasElement[] = [];
let scratchUsed = 0;

function acquireScratch(w: number, h: number): HTMLCanvasElement {
	let c = scratchPool[scratchUsed];
	if (!c) {
		c = document.createElement("canvas");
		scratchPool[scratchUsed] = c;
	}
	scratchUsed++;
	if (c.width < w) c.width = w;
	if (c.height < h) c.height = h;
	const g = c.getContext("2d");
	g.setTransform(1, 0, 0, 1, 0, 0);
	g.globalAlpha = 1;
	g.globalCompositeOperation = "source-over";
	g.clearRect(0, 0, c.width, c.height);
	return c;
}

function releaseScratch(): void {
	scratchUsed--;
}

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
		} else if (!this.transform.colorTransform._isIdentity()) {
			this._renderTinted(ctx);
		} else if (this.filters.length > 0 && this.filters.some(f => f instanceof DropShadowFilter)) {
			this._renderShadowed(ctx, this.filters.find(f => f instanceof DropShadowFilter) as DropShadowFilter);
		} else {
			this._drawSelf(ctx);
			this._renderChildren(ctx);
		}
		ctx.restore();
	}

	public _renderChildren(ctx: CanvasRenderingContext2D): void {}

	/**
	 * DropShadowFilter approximated with the canvas shadow. Strength stacks the shadow (drawn N times with the object itself
	 * kept off to the side, so only the shadow lands), then the object is drawn once on top. Only the first drop shadow counts;
	 * not combined with tint or motion blur.
	 */
	private _renderShadowed(ctx: CanvasRenderingContext2D, f: DropShadowFilter): void {
		const b = this._contentBounds();
		const pad = Math.ceil(Math.max(f.blurX, f.blurY) * 2 + f.distance) + 2;
		if (b.width <= 0 || b.height <= 0) return;
		const w = Math.ceil(b.width) + 2 * pad, h = Math.ceil(b.height) + 2 * pad;
		const cv = acquireScratch(w, h);
		const c2 = cv.getContext("2d");
		c2.translate(pad - b.x, pad - b.y);
		this._drawSelf(c2);
		this._renderChildren(c2);
		const m = ctx.getTransform();
		const k = Math.hypot(m.a, m.b); // canvas shadows are in device pixels, filters in stage pixels
		const rad = f.angle * Math.PI / 180;
		const OFF = 100000;
		ctx.save();
		ctx.shadowColor = "rgba(" + ((f.color >> 16) & 0xFF) + "," + ((f.color >> 8) & 0xFF) + "," + (f.color & 0xFF) + "," + f.alpha + ")";
		ctx.shadowBlur = Math.max(f.blurX, f.blurY) * k;
		ctx.shadowOffsetX = (Math.cos(rad) * f.distance + OFF) * k;
		ctx.shadowOffsetY = Math.sin(rad) * f.distance * k;
		const n = Math.max(1, Math.ceil(f.strength));
		for (let i = 0; i < n; i++) ctx.drawImage(cv, 0, 0, w, h, b.x - pad - OFF, b.y - pad, w, h);
		ctx.restore();
		ctx.drawImage(cv, 0, 0, w, h, b.x - pad, b.y - pad, w, h);
		releaseScratch();
	}

	/** Motion blur: draw once offscreen, then average copies spread along the movement (alpha 1/1, 1/2, ... 1/n). */
	private _renderBlurred(ctx: CanvasRenderingContext2D): void {
		const mb = this._motionBlur;
		const lx = mb.dx * mb.strength / (this.scaleX || 1), ly = mb.dy * mb.strength / (this.scaleY || 1);
		const b = this._contentBounds();
		if (b.width <= 0 || b.height <= 0) return;
		const w = Math.ceil(b.width) + 2, h = Math.ceil(b.height) + 2;
		const cv = acquireScratch(w, h);
		const c2 = cv.getContext("2d");
		c2.translate(1 - b.x, 1 - b.y);
		this._drawSelf(c2);
		this._renderChildren(c2);
		const n = Math.min(40, Math.max(2, Math.ceil(Math.hypot(lx, ly))));
		const base = ctx.globalAlpha;
		for (let k = 0; k < n; k++) {
			const t = k / (n - 1) - 0.5;
			ctx.globalAlpha = base / (k + 1);
			ctx.drawImage(cv, 0, 0, w, h, b.x - 1 + t * lx, b.y - 1 + t * ly, w, h);
		}
		ctx.globalAlpha = base;
		releaseScratch();
	}

	/**
	 * ColorTransform: draw this object and its children offscreen, tint with compositing operations
	 * (no pixel readback, which stalls the GPU), then composite. Supports multipliers 0..1, positive offsets and the
	 * alpha multiplier; negative offsets and alpha offsets are ignored.
	 */
	private _renderTinted(ctx: CanvasRenderingContext2D): void {
		const ct = this.transform.colorTransform;
		if (ct.alphaMultiplier <= 0 && ct.alphaOffset <= 0) return;
		const b = this._contentBounds();
		if (b.width <= 0 || b.height <= 0) return;
		const w = Math.ceil(b.width) + 2, h = Math.ceil(b.height) + 2;
		const src = acquireScratch(w, h);
		const s2 = src.getContext("2d");
		s2.translate(1 - b.x, 1 - b.y);
		this._drawSelf(s2);
		this._renderChildren(s2);
		const dst = acquireScratch(w, h);
		const d2 = dst.getContext("2d");
		const byte = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
		d2.drawImage(src, 0, 0, w, h, 0, 0, w, h);
		if (ct.redMultiplier != 1 || ct.greenMultiplier != 1 || ct.blueMultiplier != 1) {
			d2.globalCompositeOperation = "multiply";
			d2.fillStyle = "rgb(" + byte(ct.redMultiplier * 255) + "," + byte(ct.greenMultiplier * 255) + "," + byte(ct.blueMultiplier * 255) + ")";
			d2.fillRect(0, 0, w, h);
			d2.globalCompositeOperation = "destination-in"; // multiply also painted the transparent areas: restore the shape
			d2.drawImage(src, 0, 0, w, h, 0, 0, w, h);
		}
		if (ct.redOffset > 0 || ct.greenOffset > 0 || ct.blueOffset > 0) {
			d2.globalCompositeOperation = "lighter";
			d2.fillStyle = "rgb(" + byte(ct.redOffset) + "," + byte(ct.greenOffset) + "," + byte(ct.blueOffset) + ")";
			d2.fillRect(0, 0, w, h);
			d2.globalCompositeOperation = "destination-in";
			d2.drawImage(src, 0, 0, w, h, 0, 0, w, h);
		}
		const base = ctx.globalAlpha;
		ctx.globalAlpha = base * ct.alphaMultiplier;
		ctx.drawImage(dst, 0, 0, w, h, b.x - 1, b.y - 1, w, h);
		ctx.globalAlpha = base;
		releaseScratch();
		releaseScratch();
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
