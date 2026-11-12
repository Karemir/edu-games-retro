// AS3 methods are bound to their instance; TS methods are not. Polyfill base classes call this from
// their constructor so subclass methods keep `this` when passed around as listeners/callbacks.
export const AS3_NATIVE: unique symbol = Symbol("as3native");

export function bindMethods(self: any, ctor: Function): void {
	const seen = new Set<string>();
	for (let c: any = ctor; c && c !== Function.prototype; c = Object.getPrototypeOf(c)) {
		if (Object.prototype.hasOwnProperty.call(c, AS3_NATIVE)) break;
		for (const name of Object.getOwnPropertyNames(c.prototype)) {
			if (name === "constructor" || seen.has(name)) continue;
			seen.add(name);
			const d = Object.getOwnPropertyDescriptor(c.prototype, name);
			if (d && typeof d.value === "function") self[name] = self[name].bind(self);
		}
	}
}

/**
 * Makes the methods of a polyfill class behave like AS3 bound methods: the first access on an instance
 * (`this.removeChild`) caches a bound copy on that instance, so it can be passed as a callback.
 * Names starting with `_` are polyfill internals and are left alone.
 */
export function bindNativeMethods(cls: Function): void {
	const proto = cls.prototype;
	for (const name of Object.getOwnPropertyNames(proto)) {
		if (name === "constructor" || name.charAt(0) === "_") continue;
		const d = Object.getOwnPropertyDescriptor(proto, name);
		if (!d || typeof d.value !== "function") continue;
		const fn: Function = d.value;
		Object.defineProperty(proto, name, {
			configurable: true,
			get(this: any) {
				if (this === proto) return fn;
				const bound = fn.bind(this);
				Object.defineProperty(this, name, { value: bound, writable: true, configurable: true });
				return bound;
			},
			set(this: any, v: any) {
				Object.defineProperty(this, name, { value: v, writable: true, configurable: true });
			},
		});
	}
}
