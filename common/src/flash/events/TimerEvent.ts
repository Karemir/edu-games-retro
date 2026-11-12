import { Event } from "./Event.js";

export class TimerEvent extends Event {
	public static readonly TIMER: string = "timer";
	public static readonly TIMER_COMPLETE: string = "timerComplete";

	constructor(type: string, bubbles: boolean = false, cancelable: boolean = false) {
		super(type, bubbles, cancelable);
	}

	public updateAfterEvent(): void {}
}
