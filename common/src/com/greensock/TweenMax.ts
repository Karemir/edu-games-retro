import { TweenLite } from "./TweenLite.js";

/**
 * Small stand-in for GreenSock's TweenMax on top of TweenLite: to/from/fromTo and the allTo/allFrom/allFromTo helpers (with stagger and
 * a completion callback for the whole group). Not implemented: repeat, yoyo, timelines, pause/reverse and the other TweenMax extras.
 */
export class TweenMax extends TweenLite {
	constructor(target: any, duration: number, vars: any) {
		super(target, duration, vars);
	}

	public static to(target: Object, duration: number, vars: Object): TweenMax {
		return new TweenMax(target, duration, vars);
	}

	public static from(target: Object, duration: number, vars: Object): TweenMax {
		const v: any = Object.assign({}, vars);
		v.runBackwards = true;
		if (v.immediateRender == undefined) v.immediateRender = true;
		return new TweenMax(target, duration, v);
	}

	public static fromTo(target: Object, duration: number, fromVars: Object, toVars: Object): TweenMax {
		const v: any = Object.assign({}, toVars);
		for (const k of Object.keys(fromVars)) (target as any)[k] = (fromVars as any)[k];
		return new TweenMax(target, duration, v);
	}

	private static all(targets: Array<any>, duration: number, vars: any, stagger: number, onCompleteAll: Function, onCompleteAllParams: Array<any>,
		make: (target: any, v: any) => TweenMax): TweenMax[] {
		const tweens: TweenMax[] = [];
		const baseDelay = vars.delay || 0;
		let remaining = targets.length;
		targets.forEach((t, i) => {
			const v: any = Object.assign({}, vars);
			v.delay = baseDelay + i * stagger;
			if (onCompleteAll) {
				const own = vars.onComplete, ownParams = vars.onCompleteParams;
				v.onComplete = () => {
					if (own) own.apply(null, ownParams || []);
					if (--remaining == 0) onCompleteAll.apply(null, onCompleteAllParams || []);
				};
				v.onCompleteParams = [];
			}
			tweens.push(make(t, v));
		});
		return tweens;
	}

	public static allTo(targets: Array<any>, duration: number, vars: Object, stagger: number = 0, onCompleteAll: Function = null, onCompleteAllParams: Array<any> = null): TweenMax[] {
		return TweenMax.all(targets, duration, vars, stagger, onCompleteAll, onCompleteAllParams, (t, v) => TweenMax.to(t, duration, v));
	}

	public static allFrom(targets: Array<any>, duration: number, vars: Object, stagger: number = 0, onCompleteAll: Function = null, onCompleteAllParams: Array<any> = null): TweenMax[] {
		return TweenMax.all(targets, duration, vars, stagger, onCompleteAll, onCompleteAllParams, (t, v) => TweenMax.from(t, duration, v));
	}

	public static allFromTo(targets: Array<any>, duration: number, fromVars: Object, toVars: Object, stagger: number = 0, onCompleteAll: Function = null, onCompleteAllParams: Array<any> = null): TweenMax[] {
		return TweenMax.all(targets, duration, toVars, stagger, onCompleteAll, onCompleteAllParams, (t, v) => TweenMax.fromTo(t, duration, fromVars, v));
	}
}
