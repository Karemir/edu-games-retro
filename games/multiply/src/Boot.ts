import { bootstrap } from "@edugames/common/Bootstrap.js";
import { registerClassAlias } from "@edugames/common/flash/utils/getDefinitionByName.js";
import { Main } from "./Main.js";
import { Preloader } from "./Preloader.js";

// PORT: [Frame(factoryClass="Preloader")] on Main; AS3 resolves "Main" by name, here it is registered.
registerClassAlias("Main", Main);
bootstrap(document.getElementById("stage") as HTMLCanvasElement, Preloader, 30);
