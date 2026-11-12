//import Achievements.Components.Popup; // PORT: achievements TODO
//import Achievements.NetCom; // PORT: achievements TODO
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
		TweenPlugin.activate([AutoAlphaPlugin]);
		//addChild(new NetCom()); // PORT: achievements TODO
		//Popup.Initialize(stage); // PORT: achievements TODO
		AppFacade.GetInstance().Startup(this.stage);
	}
}
