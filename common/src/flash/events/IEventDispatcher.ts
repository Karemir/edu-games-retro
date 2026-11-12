import type { Event } from "./Event.js";

export interface IEventDispatcher {
	addEventListener(type: string, listener: Function, useCapture?: boolean, priority?: number, useWeakReference?: boolean): void;
	removeEventListener(type: string, listener: Function, useCapture?: boolean): void;
	dispatchEvent(event: Event): boolean;
	hasEventListener(type: string): boolean;
	willTrigger(type: string): boolean;
}
