import { bootstrap } from "@edugames/common/Bootstrap.js";
import { registerClassAlias } from "@edugames/common/flash/utils/getDefinitionByName.js";
import { MainGarden } from "./Main.js";
import { Preloader } from "./Preloader.js";

/** Starts the garden inside `container`. Importing this module registers all embeds (and starts loading them). */
export function boot(container: HTMLElement): void {
	// PORT: the SWF document class is MainGarden; the Preloader looks it up by the name "Main".
	registerClassAlias("Main", MainGarden);
	bootstrap(container, Preloader, 30, 960, 600);
}
