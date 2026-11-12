import { Popup } from "@edugames/achievements/Achievements/Components/Popup.js";
import { NetCom } from "@edugames/achievements/Achievements/NetCom.js";
import { AutoAlphaPlugin } from "@edugames/common/com/greensock/plugins/AutoAlphaPlugin.js";
import { TweenPlugin } from "@edugames/common/com/greensock/plugins/TweenPlugin.js";
import { Sprite } from "@edugames/common/flash/display/Sprite.js";
import { Event } from "@edugames/common/flash/events/Event.js";
import { AppFacade } from "./AppFacade.js";

/**
 * ...
 * @author Perz
 */
// PORT: [Frame(factoryClass="Preloader")] is handled in Boot.ts
export class Main extends Sprite {

	constructor() {
		super();
		this.addEventListener(Event.ADDED_TO_STAGE, this.OnStage);
	}
	
	private OnStage(e: Event): void {
		this.addChild(new NetCom());
		TweenPlugin.activate([AutoAlphaPlugin]);
		Popup.Initialize(this.stage);
		AppFacade.GetInstance().Startup(this.stage);
	}
}
