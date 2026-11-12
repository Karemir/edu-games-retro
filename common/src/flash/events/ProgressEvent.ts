import { Event } from "./Event.js";

export class ProgressEvent extends Event {
	public static readonly PROGRESS: string = "progress";

	public bytesLoaded: number;
	public bytesTotal: number;

	constructor(type: string, bubbles: boolean = false, cancelable: boolean = false, bytesLoaded: number = 0, bytesTotal: number = 0) {
		super(type, bubbles, cancelable);
		this.bytesLoaded = bytesLoaded;
		this.bytesTotal = bytesTotal;
	}

	public clone(): Event {
		return new ProgressEvent(this.type, this.bubbles, this.cancelable, this.bytesLoaded, this.bytesTotal);
	}
}
