import { Rectangle } from "../geom/Rectangle.js";

interface Segment {
	path: Path2D;
	fill: { color: number; alpha: number } | null;
	stroke: { width: number; color: number; alpha: number } | null;
}

let hitCtx: CanvasRenderingContext2D = null;

function rgba(color: number, alpha: number): string {
	return "rgba(" + ((color >> 16) & 0xFF) + "," + ((color >> 8) & 0xFF) + "," + (color & 0xFF) + "," + alpha + ")";
}

/** Recorded vector commands, replayed on every frame. Only the calls the originals use so far. */
export class Graphics {
	private segments: Segment[] = [];
	private fill: { color: number; alpha: number } | null = null;
	private stroke: { width: number; color: number; alpha: number } | null = null;
	private current: Segment = null;
	private penX: number = 0;
	private penY: number = 0;
	private minX: number = Infinity;
	private minY: number = Infinity;
	private maxX: number = -Infinity;
	private maxY: number = -Infinity;

	public clear(): void {
		this.segments = [];
		this.current = null;
		this.fill = null;
		this.stroke = null;
		this.penX = this.penY = 0;
		this.minX = this.minY = Infinity;
		this.maxX = this.maxY = -Infinity;
	}

	public beginFill(color: number, alpha: number = 1): void {
		this.fill = { color, alpha };
		this.current = null;
	}

	public endFill(): void {
		this.fill = null;
		this.current = null;
	}

	public lineStyle(thickness: number = NaN, color: number = 0, alpha: number = 1): void {
		this.stroke = isNaN(thickness) ? null : { width: thickness, color, alpha };
		this.current = null;
	}

	public moveTo(x: number, y: number): void {
		this.seg().path.moveTo(x, y);
		this.penX = x;
		this.penY = y;
	}

	public lineTo(x: number, y: number): void {
		this.seg().path.lineTo(x, y);
		this.grow(this.penX, this.penY);
		this.grow(x, y);
		this.penX = x;
		this.penY = y;
	}

	public drawRect(x: number, y: number, width: number, height: number): void {
		this.seg().path.rect(x, y, width, height);
		this.grow(x, y);
		this.grow(x + width, y + height);
	}

	public drawCircle(x: number, y: number, radius: number): void {
		const p = this.seg().path;
		p.moveTo(x + radius, y);
		p.arc(x, y, radius, 0, Math.PI * 2);
		this.grow(x - radius, y - radius);
		this.grow(x + radius, y + radius);
	}

	private seg(): Segment {
		if (!this.current) {
			this.current = { path: new Path2D(), fill: this.fill, stroke: this.stroke };
			this.current.path.moveTo(this.penX, this.penY);
			this.segments.push(this.current);
		}
		return this.current;
	}

	private grow(x: number, y: number): void {
		if (x < this.minX) this.minX = x;
		if (y < this.minY) this.minY = y;
		if (x > this.maxX) this.maxX = x;
		if (y > this.maxY) this.maxY = y;
	}

	public _bounds(): Rectangle | null {
		if (this.minX > this.maxX) return null;
		return new Rectangle(this.minX, this.minY, this.maxX - this.minX, this.maxY - this.minY);
	}

	public _draw(ctx: CanvasRenderingContext2D): void {
		for (const s of this.segments) {
			if (s.fill && s.fill.alpha > 0) {
				ctx.fillStyle = rgba(s.fill.color, s.fill.alpha);
				ctx.fill(s.path);
			}
			if (s.stroke) {
				ctx.lineWidth = s.stroke.width;
				ctx.strokeStyle = rgba(s.stroke.color, s.stroke.alpha);
				ctx.stroke(s.path);
			}
		}
	}

	/** Filled areas hit even when fully transparent (beginFill(0, 0) is used as a click area). */
	public _hit(x: number, y: number): boolean {
		if (!hitCtx) hitCtx = document.createElement("canvas").getContext("2d");
		for (const s of this.segments) {
			if (s.fill && hitCtx.isPointInPath(s.path, x, y)) return true;
		}
		return false;
	}
}
