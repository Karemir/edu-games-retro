export class Point {
	public x: number;
	public y: number;

	constructor(x: number = 0, y: number = 0) {
		this.x = x;
		this.y = y;
	}

	public get length(): number { return Math.sqrt(this.x * this.x + this.y * this.y); }
	public add(v: Point): Point { return new Point(this.x + v.x, this.y + v.y); }
	public subtract(v: Point): Point { return new Point(this.x - v.x, this.y - v.y); }
	public clone(): Point { return new Point(this.x, this.y); }
	public equals(toCompare: Point): boolean { return this.x == toCompare.x && this.y == toCompare.y; }
	public offset(dx: number, dy: number): void { this.x += dx; this.y += dy; }
	public toString(): string { return "(x=" + this.x + ", y=" + this.y + ")"; }
	public static distance(pt1: Point, pt2: Point): number { return pt1.subtract(pt2).length; }
}
