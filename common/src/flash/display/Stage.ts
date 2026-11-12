import { Event } from "../events/Event.js";
import { EventDispatcher } from "../events/EventDispatcher.js";
import { KeyboardEvent } from "../events/KeyboardEvent.js";
import { MouseEvent } from "../events/MouseEvent.js";
import { Point } from "../geom/Point.js";
import { DisplayObject } from "./DisplayObject.js";
import { DisplayObjectContainer } from "./DisplayObjectContainer.js";
import { InteractiveObject } from "./InteractiveObject.js";
import { Sprite } from "./Sprite.js";
import { StageAlign } from "./StageAlign.js";
import { StageDisplayState } from "./StageDisplayState.js";
import { StageScaleMode } from "./StageScaleMode.js";

export class Stage extends DisplayObjectContainer {
	public scaleMode: string = StageScaleMode.SHOW_ALL;
	public align: string = StageAlign.TOP_LEFT;
	public displayState: string = StageDisplayState.NORMAL;
	public frameRate: number = 30;
	public quality: string = "high";
	public stageFocusRect: boolean = true;
	public focus: InteractiveObject = null;
	public color: number = 0xFFFFFF;
	public _mouseX: number = 0;
	public _mouseY: number = 0;

	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;
	private hover: DisplayObject = null;
	private last: number = 0;
	private acc: number = 0;

	constructor(canvas: HTMLCanvasElement) {
		super();
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
		this._stage = this;
		this.listen();
	}

	public get stageWidth(): number { return this.canvas.width; }
	public get stageHeight(): number { return this.canvas.height; }
	public get mouseX(): number { return this._mouseX; }
	public get mouseY(): number { return this._mouseY; }

	// ---- frame loop: ENTER_FRAME (tweens, game logic) then a full redraw, at the SWF frame rate

	public start(): void {
		const loop = (now: number) => {
			if (!this.last) this.last = now;
			this.acc += now - this.last;
			this.last = now;
			const step = 1000 / this.frameRate;
			if (this.acc >= step) {
				this.acc = Math.min(this.acc - step, step); // never try to catch up more than one frame
				EventDispatcher.broadcastEnterFrame();
				this.render();
			}
			requestAnimationFrame(loop);
		};
		requestAnimationFrame(loop);
	}

	public render(): void {
		const ctx = this.ctx;
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.globalAlpha = 1;
		ctx.fillStyle = "#" + ("000000" + this.color.toString(16)).slice(-6);
		ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this._renderChildren(ctx);
	}

	// ---- input

	private listen(): void {
		const c = this.canvas;
		c.tabIndex = 0;
		c.addEventListener("mousemove", e => { this.track(e); this.updateHover(e); this.mouse(MouseEvent.MOUSE_MOVE, e); });
		c.addEventListener("mousedown", e => { c.focus(); this.track(e); this.mouse(MouseEvent.MOUSE_DOWN, e, true); });
		c.addEventListener("mouseup", e => { this.track(e); this.mouse(MouseEvent.MOUSE_UP, e); });
		c.addEventListener("click", e => { this.track(e); this.mouse(MouseEvent.CLICK, e); });
		c.addEventListener("mouseleave", e => { this.setHover(null, e); });
		c.addEventListener("wheel", e => { this.track(e); this.mouse(MouseEvent.MOUSE_WHEEL, e); });
		const key = (type: string) => (e: globalThis.KeyboardEvent) => {
			const k = new KeyboardEvent(type, true, false, e.key.length == 1 ? e.key.charCodeAt(0) : 0, e.keyCode, 0, e.ctrlKey, e.altKey, e.shiftKey);
			if (this.focus && this.focus._stage !== this) this.focus = null; // removed from the display list
			(this.focus || this).dispatchEvent(k);
		};
		window.addEventListener("keydown", key(KeyboardEvent.KEY_DOWN));
		window.addEventListener("keyup", key(KeyboardEvent.KEY_UP));
	}

	private track(e: globalThis.MouseEvent): void {
		const r = this.canvas.getBoundingClientRect();
		this._mouseX = (e.clientX - r.left) * this.canvas.width / r.width;
		this._mouseY = (e.clientY - r.top) * this.canvas.height / r.height;
	}

	private target(): DisplayObject {
		const h = this._hit(this._mouseX, this._mouseY);
		return h || this;
	}

	private mouse(type: string, e: globalThis.MouseEvent, focusTarget: boolean = false): void {
		const t = this.target();
		const m = new MouseEvent(type, true, false, 0, 0, null, e.ctrlKey, e.altKey, e.shiftKey, (e.buttons & 1) != 0, (e as any).deltaY ? -Math.sign((e as any).deltaY) : 0);
		const p = t.globalToLocal(new Point(this._mouseX, this._mouseY));
		m.localX = p.x;
		m.localY = p.y;
		m.stageX = this._mouseX;
		m.stageY = this._mouseY;
		if (focusTarget && t instanceof InteractiveObject) this.focus = t;
		t.dispatchEvent(m);
	}

	private updateHover(e: globalThis.MouseEvent): void {
		this.setHover(this.target(), e);
	}

	private setHover(t: DisplayObject, e: globalThis.MouseEvent): void {
		if (t === this.hover) return;
		const old = this.hover;
		this.hover = t;
		const chain = (o: DisplayObject) => { const a: DisplayObject[] = []; for (; o; o = o._parent) a.push(o); return a; };
		const oldChain = chain(old), newChain = chain(t);
		if (old) old.dispatchEvent(new MouseEvent(MouseEvent.MOUSE_OUT, true));
		for (const o of oldChain) if (newChain.indexOf(o) < 0) o.dispatchEvent(new MouseEvent(MouseEvent.ROLL_OUT, false));
		for (const o of newChain.slice().reverse()) if (oldChain.indexOf(o) < 0) o.dispatchEvent(new MouseEvent(MouseEvent.ROLL_OVER, false));
		if (t) t.dispatchEvent(new MouseEvent(MouseEvent.MOUSE_OVER, true));
		let hand = false;
		for (let o: DisplayObject = t; o; o = o._parent) {
			if (o instanceof Sprite && o.buttonMode && o.useHandCursor) { hand = true; break; }
		}
		this.canvas.style.cursor = hand ? "pointer" : "default";
	}
}
