import { bindNativeMethods } from "../utils/bindMethods.js";
import { Event } from "../events/Event.js";
import { Point } from "../geom/Point.js";
import { Rectangle } from "../geom/Rectangle.js";
import { DisplayObject } from "./DisplayObject.js";
import { InteractiveObject } from "./InteractiveObject.js";

export class DisplayObjectContainer extends InteractiveObject {
	public mouseChildren: boolean = true;
	public tabChildren: boolean = true;
	public _children: DisplayObject[] = [];

	public get numChildren(): number { return this._children.length; }

	public addChild(child: DisplayObject): DisplayObject {
		return this.addChildAt(child, this._children.length);
	}

	public addChildAt(child: DisplayObject, index: number): DisplayObject {
		if (child._parent) child._parent.removeChild(child);
		this._children.splice(index, 0, child);
		child._parent = this;
		child.dispatchEvent(new Event(Event.ADDED, true));
		if (this._stage) DisplayObjectContainer.propagateStage(child, true, this._stage);
		return child;
	}

	public removeChild(child: DisplayObject): DisplayObject {
		const i = this._children.indexOf(child);
		if (i < 0) throw new ArgumentError("Error #2025: The supplied DisplayObject must be a child of the caller.");
		return this.removeChildAt(i);
	}

	public removeChildAt(index: number): DisplayObject {
		const child = this._children[index];
		child.dispatchEvent(new Event(Event.REMOVED, true));
		if (this._stage) DisplayObjectContainer.propagateStage(child, false, null);
		this._children.splice(index, 1);
		child._parent = null;
		return child;
	}

	public removeChildren(beginIndex: number = 0, endIndex: number = 0x7FFFFFFF): void {
		const end = Math.min(endIndex, this._children.length - 1);
		for (let i = end; i >= beginIndex; i--) this.removeChildAt(i);
	}

	public getChildAt(index: number): DisplayObject { return this._children[index]; }
	public getChildIndex(child: DisplayObject): number { return this._children.indexOf(child); }
	public contains(child: DisplayObject): boolean {
		for (let o = child; o; o = o._parent) if (o === this) return true;
		return false;
	}

	public getChildByName(name: string): DisplayObject {
		return this._children.find(c => c.name == name) || null;
	}

	public setChildIndex(child: DisplayObject, index: number): void {
		this._children.splice(this._children.indexOf(child), 1);
		this._children.splice(index, 0, child);
	}

	public swapChildren(a: DisplayObject, b: DisplayObject): void {
		const i = this._children.indexOf(a), j = this._children.indexOf(b);
		this._children[i] = b;
		this._children[j] = a;
	}

	public swapChildrenAt(index1: number, index2: number): void {
		const t = this._children[index1];
		this._children[index1] = this._children[index2];
		this._children[index2] = t;
	}

	private static propagateStage(o: DisplayObject, added: boolean, stage: any): void {
		if (added) o._addedToStage(stage); else o._removedFromStage();
		if (o instanceof DisplayObjectContainer) {
			for (const c of o._children.slice()) DisplayObjectContainer.propagateStage(c, added, stage);
		}
	}

	public _contentBounds(): Rectangle {
		let r: Rectangle = this._selfBounds() || new Rectangle();
		for (const c of this._children) {
			if (!c.visible) continue;
			const b = c.getBounds(this);
			if (b.width == 0 && b.height == 0) continue;
			r = r.union(b);
		}
		return r;
	}

	public _renderChildren(ctx: CanvasRenderingContext2D): void {
		for (const c of this._children) c._render(ctx);
	}

	/** Children only; a Sprite adds its own graphics on top (see Sprite._hit). */
	public _hit(x: number, y: number): DisplayObject | null {
		if (!this.visible) return null;
		for (let i = this._children.length - 1; i >= 0; i--) {
			const c = this._children[i];
			const m = c._localMatrix();
			m.invert();
			const p = m.transformPoint(new Point(x, y));
			const h = c._hit(p.x, p.y);
			if (!h) continue;
			if (!this.mouseChildren) return this.mouseEnabled ? this : null;
			if (h instanceof InteractiveObject) return h;
			if (this.mouseEnabled) return this; // Bitmap/Shape are not targets: the nearest interactive parent is
		}
		return null;
	}
}

class ArgumentError extends Error {}
bindNativeMethods(DisplayObjectContainer);
