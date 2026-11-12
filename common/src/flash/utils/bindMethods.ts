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
