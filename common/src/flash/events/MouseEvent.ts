import { Event } from "./Event.js";

export class MouseEvent extends Event {
	public static readonly CLICK: string = "click";
	public static readonly DOUBLE_CLICK: string = "doubleClick";
	public static readonly MOUSE_DOWN: string = "mouseDown";
	public static readonly MOUSE_UP: string = "mouseUp";
	public static readonly MOUSE_MOVE: string = "mouseMove";
	public static readonly MOUSE_OVER: string = "mouseOver";
	public static readonly MOUSE_OUT: string = "mouseOut";
	public static readonly ROLL_OVER: string = "rollOver";
	public static readonly ROLL_OUT: string = "rollOut";
	public static readonly MOUSE_WHEEL: string = "mouseWheel";

	public localX: number;
	public localY: number;
	public stageX: number = 0;
	public stageY: number = 0;
	public ctrlKey: boolean;
	public altKey: boolean;
	public shiftKey: boolean;
	public buttonDown: boolean;
	public delta: number;

	constructor(type: string, bubbles: boolean = true, cancelable: boolean = false, localX: number = NaN, localY: number = NaN,
		relatedObject: any = null, ctrlKey: boolean = false, altKey: boolean = false, shiftKey: boolean = false, buttonDown: boolean = false, delta: number = 0) {
		super(type, bubbles, cancelable);
		this.localX = localX;
		this.localY = localY;
		this.ctrlKey = ctrlKey;
		this.altKey = altKey;
		this.shiftKey = shiftKey;
		this.buttonDown = buttonDown;
		this.delta = delta;
	}

	public clone(): Event {
		const e = new MouseEvent(this.type, this.bubbles, this.cancelable, this.localX, this.localY, null, this.ctrlKey, this.altKey, this.shiftKey, this.buttonDown, this.delta);
		e.stageX = this.stageX;
		e.stageY = this.stageY;
		return e;
	}
}
