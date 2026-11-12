import { Rectangle } from "../geom/Rectangle.js";
import { AS3_NATIVE, bindNativeMethods } from "../utils/bindMethods.js";
import { InteractiveObject } from "../display/InteractiveObject.js";
import { getFontMetrics } from "./FontMetrics.js";
import { TextFieldAutoSize } from "./TextFieldAutoSize.js";
import { TextFormat } from "./TextFormat.js";
import { TextFormatAlign } from "./TextFormatAlign.js";

const GUTTER = 2;
let measureCtx: CanvasRenderingContext2D = null;

interface Line {
	text: string;
	width: number;
}

/**
 * Static text only: one TextFormat for the whole field (setTextFormat ranges are applied to all text).
 * Editing, HTML styling and scrolling are not implemented.
 */
export class TextField extends InteractiveObject {
	static readonly [AS3_NATIVE] = true;

	public embedFonts: boolean = false;
	public selectable: boolean = true;
	public multiline: boolean = false;
	public wordWrap: boolean = false;
	public border: boolean = false;
	public background: boolean = false;
	public borderColor: number = 0;
	public backgroundColor: number = 0xFFFFFF;
	public type: string = "dynamic";
	public maxChars: number = 0;
	public restrict: string = null;
	public mouseWheelEnabled: boolean = true;

	private _text: string = "";
	private _autoSize: string = TextFieldAutoSize.NONE;
	private _width: number = 100;
	private _height: number = 100;
	private format: TextFormat = new TextFormat("Times New Roman", 12, 0, false, false, false, "", "", TextFormatAlign.LEFT, 0, 0, 0, 0);

	public get text(): string { return this._text; }
	public set text(value: string) { this._text = value == null ? "" : String(value); }

	public get htmlText(): string { return this._text; }
	public set htmlText(value: string) { this._text = String(value).replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]*>/g, ""); }

	public get length(): number { return this._text.length; }

	public get defaultTextFormat(): TextFormat { return this.format; }
	public set defaultTextFormat(value: TextFormat) { this.setTextFormat(value); }

	public setTextFormat(format: TextFormat, beginIndex: number = -1, endIndex: number = -1): void {
		for (const k of Object.keys(format) as (keyof TextFormat)[]) {
			if (format[k] !== null && format[k] !== undefined) (this.format as any)[k] = format[k];
		}
	}

	public getTextFormat(beginIndex: number = -1, endIndex: number = -1): TextFormat {
		return Object.assign(new TextFormat(), this.format);
	}

	public get textColor(): number { return this.format.color; }
	public set textColor(value: number) { this.format.color = value; }

	public get autoSize(): string { return this._autoSize; }
	public set autoSize(value: string) { this._autoSize = value; }

	private font(): string {
		const f = this.format;
		return (f.italic ? "italic " : "") + (f.bold ? "bold " : "") + f.size + "px \"" + f.font + "\"";
	}

	private metrics(): { ctx: CanvasRenderingContext2D; ascent: number; descent: number; lineHeight: number } {
		if (!measureCtx) measureCtx = document.createElement("canvas").getContext("2d");
		measureCtx.font = this.font();
		let ascent: number, descent: number, gap: number = 0;
		const em = getFontMetrics(this.format.font);
		if (em) {
			// embedded font: Flash uses the font's own win ascent/descent and line gap
			const size = Number(this.format.size);
			ascent = em.ascent * size;
			descent = em.descent * size;
			gap = em.leading * size;
		} else {
			const m = measureCtx.measureText("Hg");
			ascent = m.fontBoundingBoxAscent;
			descent = m.fontBoundingBoxDescent;
		}
		return { ctx: measureCtx, ascent, descent, lineHeight: ascent + descent + gap + (this.format.leading || 0) };
	}

	private layout(): { lines: Line[]; ascent: number; lineHeight: number; textWidth: number; textHeight: number } {
		const { ctx, ascent, descent, lineHeight } = this.metrics();
		const maxW = this._autoSize == TextFieldAutoSize.NONE || this.wordWrap ? this._width - GUTTER * 2 : Infinity;
		const lines: Line[] = [];
		for (const raw of (this.multiline || this.wordWrap || this._text.indexOf("\n") >= 0 ? this._text.split(/\r\n|\r|\n/) : [this._text])) {
			if (!this.wordWrap) {
				lines.push({ text: raw, width: ctx.measureText(raw).width });
				continue;
			}
			let cur = "";
			for (const word of raw.split(" ")) {
				const t = cur ? cur + " " + word : word;
				if (cur && ctx.measureText(t).width > maxW) {
					lines.push({ text: cur, width: ctx.measureText(cur).width });
					cur = word;
				} else {
					cur = t;
				}
			}
			lines.push({ text: cur, width: ctx.measureText(cur).width });
		}
		const textWidth = Math.max(0, ...lines.map(l => l.width));
		return { lines, ascent, lineHeight, textWidth, textHeight: (lines.length - 1) * lineHeight + ascent + descent };
	}

	public get textWidth(): number { return this.layout().textWidth; }
	public get textHeight(): number { return this.layout().textHeight; }

	private fitted(): { w: number; h: number } {
		if (this._autoSize == TextFieldAutoSize.NONE) return { w: this._width, h: this._height };
		const l = this.layout();
		return { w: this.wordWrap ? this._width : l.textWidth + GUTTER * 2, h: l.textHeight + GUTTER * 2 };
	}

	public get width(): number { return this.fitted().w * this.scaleX; }
	public set width(value: number) { this._width = value / this.scaleX; }
	public get height(): number { return this.fitted().h * this.scaleY; }
	public set height(value: number) { this._height = value / this.scaleY; }

	public _selfBounds(): Rectangle | null {
		const f = this.fitted();
		return new Rectangle(0, 0, f.w, f.h);
	}

	public _contentBounds(): Rectangle { return this._selfBounds(); }

	public _drawSelf(ctx: CanvasRenderingContext2D): void {
		const { w, h } = this.fitted();
		if (this.background) {
			ctx.fillStyle = "#" + ("000000" + this.backgroundColor.toString(16)).slice(-6);
			ctx.fillRect(0, 0, w, h);
		}
		if (this.border) {
			ctx.strokeStyle = "#" + ("000000" + this.borderColor.toString(16)).slice(-6);
			ctx.lineWidth = 1;
			ctx.strokeRect(0.5, 0.5, w - 1, h - 1);
		}
		if (!this._text) return;
		const l = this.layout();
		ctx.font = this.font();
		ctx.fillStyle = "#" + ("000000" + Number(this.format.color || 0).toString(16)).slice(-6);
		ctx.textBaseline = "alphabetic";
		ctx.textAlign = "left";
		const align = this._autoSize == TextFieldAutoSize.NONE ? this.format.align : TextFormatAlign.LEFT;
		let y = GUTTER + l.ascent;
		for (const line of l.lines) {
			let x = GUTTER;
			if (align == TextFormatAlign.CENTER) x = (w - line.width) / 2;
			else if (align == TextFormatAlign.RIGHT) x = w - GUTTER - line.width;
			ctx.fillText(line.text, x, y);
			y += l.lineHeight;
		}
	}
}
bindNativeMethods(TextField);
