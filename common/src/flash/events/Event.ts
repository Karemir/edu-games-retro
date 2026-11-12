import { AS3_NATIVE } from "../utils/bindMethods.js";

export class Event {
	static readonly [AS3_NATIVE] = true;
	public static readonly ADDED: string = "added";
	public static readonly ADDED_TO_STAGE: string = "addedToStage";
	public static readonly REMOVED: string = "removed";
	public static readonly REMOVED_FROM_STAGE: string = "removedFromStage";
	public static readonly ENTER_FRAME: string = "enterFrame";
	public static readonly COMPLETE: string = "complete";
	public static readonly OPEN: string = "open";
	public static readonly INIT: string = "init";
	public static readonly CHANGE: string = "change";
	public static readonly RESIZE: string = "resize";
	public static readonly CLOSE: string = "close";
	public static readonly ACTIVATE: string = "activate";
	public static readonly DEACTIVATE: string = "deactivate";
	public static readonly SOUND_COMPLETE: string = "soundComplete";

	public static readonly CAPTURING_PHASE: number = 1;
	public static readonly AT_TARGET: number = 2;
	public static readonly BUBBLING_PHASE: number = 3;

	public type: string;
	public bubbles: boolean;
	public cancelable: boolean;
	public target: any = null;
	public currentTarget: any = null;
	public eventPhase: number = 0;
	public _stopped: boolean = false;
	public _stoppedImmediate: boolean = false;
	private _defaultPrevented: boolean = false;

	constructor(type: string, bubbles: boolean = false, cancelable: boolean = false) {
		this.type = type;
		this.bubbles = bubbles;
		this.cancelable = cancelable;
	}

	public stopPropagation(): void { this._stopped = true; }
	public stopImmediatePropagation(): void { this._stopped = true; this._stoppedImmediate = true; }
	public preventDefault(): void { if (this.cancelable) this._defaultPrevented = true; }
	public isDefaultPrevented(): boolean { return this._defaultPrevented; }
	public clone(): Event { return new Event(this.type, this.bubbles, this.cancelable); }
	public toString(): string { return "[Event type=" + this.type + "]"; }
}
