import { EventDispatcher } from "../events/EventDispatcher.js";
import { TimerEvent } from "../events/TimerEvent.js";
import { AS3_NATIVE, bindNativeMethods } from "./bindMethods.js";

export class Timer extends EventDispatcher {
	static readonly [AS3_NATIVE] = true;

	public delay: number;
	public repeatCount: number;
	private _currentCount: number = 0;
	private handle: number = 0;
	private _running: boolean = false;

	constructor(delay: number, repeatCount: number = 0) {
		super();
		this.delay = delay;
		this.repeatCount = repeatCount;
	}

	public get running(): boolean { return this._running; }
	public get currentCount(): number { return this._currentCount; }

	public start(): void {
		if (this._running) return;
		this._running = true;
		this.handle = window.setInterval(() => this.tick(), this.delay);
	}

	public stop(): void {
		this._running = false;
		window.clearInterval(this.handle);
	}

	public reset(): void {
		this.stop();
		this._currentCount = 0;
	}

	private tick(): void {
		this._currentCount++;
		this.dispatchEvent(new TimerEvent(TimerEvent.TIMER));
		if (this.repeatCount > 0 && this._currentCount >= this.repeatCount) {
			this.stop();
			this.dispatchEvent(new TimerEvent(TimerEvent.TIMER_COMPLETE));
		}
	}
}
bindNativeMethods(Timer);
