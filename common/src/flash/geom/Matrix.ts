import { Point } from "./Point.js";

export class Matrix {
	public a: number;
	public b: number;
	public c: number;
	public d: number;
	public tx: number;
	public ty: number;

	constructor(a: number = 1, b: number = 0, c: number = 0, d: number = 1, tx: number = 0, ty: number = 0) {
		this.a = a; this.b = b; this.c = c; this.d = d; this.tx = tx; this.ty = ty;
	}

	public clone(): Matrix { return new Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty); }
	public identity(): void { this.a = 1; this.b = 0; this.c = 0; this.d = 1; this.tx = 0; this.ty = 0; }

	/** this = this * m (m is applied first, then this), like Flash. */
	public concat(m: Matrix): void {
		const a = this.a * m.a + this.c * m.b;
		const b = this.b * m.a + this.d * m.b;
		const c = this.a * m.c + this.c * m.d;
		const d = this.b * m.c + this.d * m.d;
		const tx = this.a * m.tx + this.c * m.ty + this.tx;
		const ty = this.b * m.tx + this.d * m.ty + this.ty;
		this.a = a; this.b = b; this.c = c; this.d = d; this.tx = tx; this.ty = ty;
	}

	public invert(): void {
		const det = this.a * this.d - this.b * this.c;
		const a = this.d / det, b = -this.b / det, c = -this.c / det, d = this.a / det;
		const tx = -(a * this.tx + c * this.ty);
		const ty = -(b * this.tx + d * this.ty);
		this.a = a; this.b = b; this.c = c; this.d = d; this.tx = tx; this.ty = ty;
	}

	public transformPoint(p: Point): Point {
		return new Point(this.a * p.x + this.c * p.y + this.tx, this.b * p.x + this.d * p.y + this.ty);
	}
}
