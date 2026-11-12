import { Event } from "../../flash/events/Event.js";
import { EventDispatcher } from "../../flash/events/EventDispatcher.js";
import { getTimer } from "../../flash/utils/timers.js";
import { Quad } from "./easing/Quad.js";
import { TweenPlugin } from "./plugins/TweenPlugin.js";

const SPECIAL = ["ease", "easeParams", "delay", "onComplete", "onCompleteParams", "onStart", "onStartParams", "onUpdate", "onUpdateParams",
	"overwrite", "immediateRender", "paused", "runBackwards", "useFrames", "onCompleteScope"];

interface PropTween {
	key: string;
	start: number;
	change: number;
}

function now(): number {
	return getTimer() / 1000;
}

/**
 * Small stand-in for GreenSock's TweenLite (v11): time based tweens driven by ENTER_FRAME.
 * Supported: to/from/fromTo/set/delayedCall/killTweensOf, ease, delay, onStart/onUpdate/onComplete (+Params),
 * overwrite modes 0 (none), 1 (auto), 2 (all on start, the v11 default), 4 (all immediately), plugins.
 */
export class TweenLite {
	public static readonly version: number = 11;
	public static defaultEase: Function = Quad.easeOut;
	/** v11 TweenLite without OverwriteManager.init(): ALL_ONSTART. */
	public static defaultOverwrite: number = 2;

	private static active: TweenLite[] = [];
	private static ticker: EventDispatcher = null;

	public target: any;
	public duration: number;
	public vars: any;
	public startTime: number;
	public active_: boolean = true;

	private props: PropTween[] = [];
	private plugins: TweenPlugin[] = [];
	private initted: boolean = false;
	private paused: boolean;
	private ease: Function;
	private overwrite: number;

	constructor(target: any, duration: number, vars: any) {
		this.target = target;
		this.duration = duration || 0;
		this.vars = vars || {};
		this.ease = typeof this.vars.ease == "function" ? this.vars.ease : TweenLite.defaultEase;
		this.paused = this.vars.paused == true;
		this.overwrite = this.vars.overwrite == undefined ? TweenLite.defaultOverwrite : Number(this.vars.overwrite);
		this.startTime = now() + (this.vars.delay || 0);
		if (!TweenLite.ticker) {
			TweenLite.ticker = new EventDispatcher();
			TweenLite.ticker.addEventListener(Event.ENTER_FRAME, TweenLite.update);
		}
		if (this.overwrite == 4) TweenLite.killTweensOf(target);
		TweenLite.active.push(this);
		if (this.vars.immediateRender || (this.duration == 0 && !(this.vars.delay > 0))) {
			this.init();
			this.render(this.duration == 0 ? 1 : 0);
			if (this.duration == 0) this.finish();
		}
	}

	public static to(target: Object, duration: number, vars: Object): TweenLite {
		return new TweenLite(target, duration, vars);
	}

	public static from(target: Object, duration: number, vars: Object): TweenLite {
		const v: any = Object.assign({}, vars);
		v.runBackwards = true;
		if (v.immediateRender == undefined) v.immediateRender = true;
		return new TweenLite(target, duration, v);
	}

	public static fromTo(target: Object, duration: number, fromVars: Object, toVars: Object): TweenLite {
		const v: any = Object.assign({}, toVars);
		for (const k of Object.keys(fromVars)) (target as any)[k] = (fromVars as any)[k];
		return new TweenLite(target, duration, v);
	}

	public static set(target: Object, vars: Object): TweenLite {
		return new TweenLite(target, 0, vars);
	}

	public static delayedCall(delay: number, onComplete: Function, onCompleteParams: Array<any> = null): TweenLite {
		return new TweenLite(onComplete, 0, { delay, onComplete, onCompleteParams, overwrite: 0 });
	}

	public static killTweensOf(target: Object, complete: boolean = false): void {
		for (const t of TweenLite.active.slice()) {
			if (t.target === target) t.kill(complete);
		}
	}

	public static killDelayedCallsTo(func: Function): void {
		TweenLite.killTweensOf(func);
	}

	private static update(): void {
		const t = now();
		for (const tw of TweenLite.active.slice()) tw.update(t);
	}

	public kill(complete: boolean = false): void {
		if (!this.active_) return;
		if (complete) {
			if (!this.initted) this.init();
			this.render(1);
		}
		this.remove();
	}

	public pause(): void { this.paused = true; }
	public resume(): void { this.paused = false; }

	private remove(): void {
		this.active_ = false;
		const i = TweenLite.active.indexOf(this);
		if (i >= 0) TweenLite.active.splice(i, 1);
	}

	private update(t: number): void {
		if (!this.active_ || this.paused || t < this.startTime) return;
		if (!this.initted) {
			this.init();
			this.callback("onStart");
			if (!this.active_) return;
		}
		const elapsed = t - this.startTime;
		if (this.duration <= 0 || elapsed >= this.duration) {
			this.render(1);
			this.finish();
		} else {
			const r = this.ease(elapsed, 0, 1, this.duration);
			this.render(r);
		}
	}

	private init(): void {
		if (this.initted) return;
		this.initted = true;
		const v = this.vars;
		const mine: string[] = [];
		for (const key of Object.keys(v)) {
			if (SPECIAL.indexOf(key) >= 0) continue;
			const plugin = TweenPlugin.create(key);
			if (plugin) {
				if (plugin.onInitTween(this.target, v[key], this)) {
					this.plugins.push(plugin);
					mine.push(key, ...plugin.overwriteProps);
					continue;
				}
			}
			const cur = this.target[key];
			if (typeof cur != "number") continue;
			const raw = v[key];
			let end: number = typeof raw == "string" && /^[+-]=/.test(raw) ? cur + Number(raw.charAt(0) + "1") * parseFloat(raw.slice(2)) : Number(raw);
			mine.push(key);
			if (v.runBackwards) {
				this.props.push({ key, start: end, change: cur - end });
			} else {
				this.props.push({ key, start: cur, change: end - cur });
			}
		}
		this.overwriteOthers(mine);
	}

	private overwriteOthers(keys: string[]): void {
		if (this.overwrite == 0 || this.overwrite == 3 || this.overwrite == 4) return;
		for (const o of TweenLite.active.slice()) {
			if (o === this || o.target !== this.target || o.startTime > this.startTime) continue;
			if (this.overwrite == 2) {
				o.remove();
			} else if (this.overwrite == 1) {
				o.props = o.props.filter(p => keys.indexOf(p.key) < 0);
				if (o.props.length == 0 && o.plugins.length == 0 && o.initted) o.remove();
			}
		}
	}

	private render(ratio: number): void {
		for (const p of this.props) this.target[p.key] = p.start + p.change * ratio;
		for (const pl of this.plugins) pl.setRatio(ratio);
		this.callback("onUpdate");
	}

	private finish(): void {
		this.remove();
		this.callback("onComplete");
	}

	private callback(name: string): void {
		const fn = this.vars[name];
		if (typeof fn == "function") fn.apply(this.vars.onCompleteScope || null, this.vars[name + "Params"] || []);
	}
}
