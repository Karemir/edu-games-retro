import { Event } from "./Event.js";

export class IOErrorEvent extends Event {
	public static readonly IO_ERROR: string = "ioError";

	public text: string;

	constructor(type: string, bubbles: boolean = false, cancelable: boolean = false, text: string = "") {
		super(type, bubbles, cancelable);
		this.text = text;
	}

	public clone(): Event {
		return new IOErrorEvent(this.type, this.bubbles, this.cancelable, this.text);
	}
}
