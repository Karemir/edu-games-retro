import { AS3_NATIVE, bindMethods } from "../utils/bindMethods.js";
import { Event } from "./Event.js";
import type { IEventDispatcher } from "./IEventDispatcher.js";

interface Listener {
	fn: Function;
	useCapture: boolean;
	priority: number;
}

export class EventDispatcher implements IEventDispatcher {
	static readonly [AS3_NATIVE] = true;

	/** Every dispatcher listening for ENTER_FRAME, on or off the display list (like Flash). */
	private static frameTargets: Set<EventDispatcher> = new Set();

	private listeners: Map<string, Listener[]> = new Map();
	private eventTarget: any;

	constructor(target: IEventDispatcher = null) {
		this.eventTarget = target || this;
		bindMethods(this, new.target);
	}

	public static broadcastEnterFrame(): void {
		for (const t of Array.from(EventDispatcher.frameTargets)) {
			t.dispatchEvent(new Event(Event.ENTER_FRAME));
		}
	}

	public addEventListener(type: string, listener: Function, useCapture: boolean = false, priority: number = 0, useWeakReference: boolean = false): void {
		let list = this.listeners.get(type);
		if (!list) {
			list = [];
			this.listeners.set(type, list);
		}
		if (list.some(l => l.fn === listener && l.useCapture === useCapture)) return;
		list.push({ fn: listener, useCapture, priority });
		list.sort((a, b) => b.priority - a.priority);
		if (type === Event.ENTER_FRAME) EventDispatcher.frameTargets.add(this);
	}

	public removeEventListener(type: string, listener: Function, useCapture: boolean = false): void {
		const list = this.listeners.get(type);
		if (!list) return;
		const i = list.findIndex(l => l.fn === listener && l.useCapture === useCapture);
		if (i >= 0) list.splice(i, 1);
		if (list.length == 0) {
			this.listeners.delete(type);
			if (type === Event.ENTER_FRAME) EventDispatcher.frameTargets.delete(this);
		}
	}

	public hasEventListener(type: string): boolean {
		return this.listeners.has(type);
	}

	public willTrigger(type: string): boolean {
		for (let t: EventDispatcher = this; t; t = t.getEventParent()) {
			if (t.hasEventListener(type)) return true;
		}
		return false;
	}

	/** Next node of the event flow (the display list parent for display objects). */
	protected getEventParent(): EventDispatcher {
		return null;
	}

	public dispatchEvent(event: Event): boolean {
		event.target = this.eventTarget;
		const path: EventDispatcher[] = [];
		if (event.bubbles) {
			for (let p = this.getEventParent(); p; p = p.getEventParent()) path.push(p);
		}
		// capture: root -> parent
		event.eventPhase = Event.CAPTURING_PHASE;
		for (let i = path.length - 1; i >= 0 && !event._stopped; i--) path[i].invoke(event, true);
		// target
		if (!event._stopped) {
			event.eventPhase = Event.AT_TARGET;
			this.invoke(event, false);
		}
		// bubble: parent -> root
		event.eventPhase = Event.BUBBLING_PHASE;
		for (let i = 0; i < path.length && !event._stopped; i++) path[i].invoke(event, false);
		return !event.isDefaultPrevented();
	}

	private invoke(event: Event, capture: boolean): void {
		const list = this.listeners.get(event.type);
		if (!list) return;
		event.currentTarget = this.eventTarget;
		const atTarget = event.eventPhase == Event.AT_TARGET;
		for (const l of list.slice()) {
			if (!atTarget && l.useCapture !== capture) continue;
			l.fn.call(null, event);
			if (event._stoppedImmediate) break;
		}
	}
}
