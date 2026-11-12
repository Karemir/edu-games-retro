import { bootstrap } from "@edugames/common/Bootstrap.js";
import { registerClassAlias } from "@edugames/common/flash/utils/getDefinitionByName.js";
import { Main } from "./Main.js";
import { Preloader } from "./Preloader.js";

/** Starts the game inside `container`. Importing this module registers all embeds (and starts loading them). */
export function boot(container: HTMLElement): void {
	// PORT: [Frame(factoryClass="Preloader")] on Main; AS3 resolves "Main" by name, here it is registered.
	registerClassAlias("Main", Main);
	bootstrap(container, Preloader, 30, 960, 600);
}
