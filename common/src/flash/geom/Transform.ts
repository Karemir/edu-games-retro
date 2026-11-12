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
}
