import type { Class } from "./Class.js";

const registry: { [name: string]: Class } = {};

/** PORT: AS3 resolves class names reflectively; here classes have to be registered by name first. */
export function registerClassAlias(name: string, definition: Class): void {
	registry[name] = definition;
}

export function getDefinitionByName(name: string): Object {
	const def = registry[name];
	if (!def) throw new ReferenceError("Error #1065: Variable " + name + " is not defined.");
	return def;
}
