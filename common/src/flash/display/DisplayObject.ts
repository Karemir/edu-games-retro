import { Event } from "../events/Event.js";
import { EventDispatcher } from "../events/EventDispatcher.js";
import { Matrix } from "../geom/Matrix.js";
import { Point } from "../geom/Point.js";
import { Rectangle } from "../geom/Rectangle.js";
import { Transform } from "../geom/Transform.js";
import { AS3_NATIVE } from "../utils/bindMethods.js";
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
		if (!this.visible || this.alpha <= 0) return;
		ctx.save();
		const m = this._localMatrix();
		ctx.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
		ctx.globalAlpha *= this.alpha;
		this._drawSelf(ctx);
		this._renderChildren(ctx);
		ctx.restore();
	}

	public _renderChildren(ctx: CanvasRenderingContext2D): void {}

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
