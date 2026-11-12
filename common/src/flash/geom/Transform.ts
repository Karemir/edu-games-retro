import type { DisplayObject } from "../display/DisplayObject.js";
import { ColorTransform } from "./ColorTransform.js";
import { Matrix } from "./Matrix.js";

export class Transform {
	public colorTransform: ColorTransform = new ColorTransform();
	private owner: DisplayObject;

	constructor(owner: DisplayObject) {
		this.owner = owner;
	}

	public get matrix(): Matrix {
		return this.owner._localMatrix();
	}

	/** Decomposes the matrix into the owner's x, y, scale and rotation (skew is not kept). */
	public set matrix(m: Matrix) {
		const o = this.owner;
		o.x = m.tx;
		o.y = m.ty;
		o.scaleX = Math.hypot(m.a, m.b);
		o.scaleY = (m.a * m.d - m.b * m.c) / (o.scaleX || 1);
		o.rotation = Math.atan2(m.b, m.a) * 180 / Math.PI;
	}
}
