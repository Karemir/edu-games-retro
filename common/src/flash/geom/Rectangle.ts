import { Point } from "./Point.js";

export class Rectangle {
	public x: number;
	public y: number;
	public width: number;
	public height: number;

	constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	public get left(): number { return this.x; }
	public get right(): number { return this.x + this.width; }
	public get top(): number { return this.y; }
	public get bottom(): number { return this.y + this.height; }

	public clone(): Rectangle { return new Rectangle(this.x, this.y, this.width, this.height); }
	public contains(x: number, y: number): boolean { return x >= this.x && y >= this.y && x < this.right && y < this.bottom; }
	public containsPoint(point: Point): boolean { return this.contains(point.x, point.y); }
	public isEmpty(): boolean { return this.width <= 0 || this.height <= 0; }

	public union(toUnion: Rectangle): Rectangle {
		if (this.isEmpty()) return toUnion.clone();
		if (toUnion.isEmpty()) return this.clone();
		const l = Math.min(this.x, toUnion.x), t = Math.min(this.y, toUnion.y);
		const r = Math.max(this.right, toUnion.right), b = Math.max(this.bottom, toUnion.bottom);
		return new Rectangle(l, t, r - l, b - t);
	}

	public toString(): string { return "(x=" + this.x + ", y=" + this.y + ", w=" + this.width + ", h=" + this.height + ")"; }
}
