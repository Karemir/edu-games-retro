import { Event } from "./Event.js";

export class KeyboardEvent extends Event {
	public static readonly KEY_DOWN: string = "keyDown";
	public static readonly KEY_UP: string = "keyUp";

	public charCode: number;
	public keyCode: number;
	public keyLocation: number;
	public ctrlKey: boolean;
	public altKey: boolean;
	public shiftKey: boolean;

	constructor(type: string, bubbles: boolean = true, cancelable: boolean = false, charCode: number = 0, keyCode: number = 0,
		keyLocation: number = 0, ctrlKey: boolean = false, altKey: boolean = false, shiftKey: boolean = false) {
		super(type, bubbles, cancelable);
		this.charCode = charCode;
		this.keyCode = keyCode;
		this.keyLocation = keyLocation;
		this.ctrlKey = ctrlKey;
		this.altKey = altKey;
		this.shiftKey = shiftKey;
	}

	public clone(): Event {
		return new KeyboardEvent(this.type, this.bubbles, this.cancelable, this.charCode, this.keyCode, this.keyLocation, this.ctrlKey, this.altKey, this.shiftKey);
	}
}
