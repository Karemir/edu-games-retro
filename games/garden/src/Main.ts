import { AchievementProxy } from "@edugames/achievements/Achievements/AchievementProxy.js";
import { GardenMediator } from "@edugames/achievements/Achievements/GardenMediator.js";
import { NetCom } from "@edugames/achievements/Achievements/NetCom.js";
import { GardenScreen } from "@edugames/achievements/Achievements/Components/GardenScreen.js";
import { Popup } from "@edugames/achievements/Achievements/Components/Popup.js";
import { AutoAlphaPlugin } from "@edugames/common/com/greensock/plugins/AutoAlphaPlugin.js";
import { TweenPlugin } from "@edugames/common/com/greensock/plugins/TweenPlugin.js";
import { MovieClip } from "@edugames/common/flash/display/MovieClip.js";
import { Sprite } from "@edugames/common/flash/display/Sprite.js";
import { StageScaleMode } from "@edugames/common/flash/display/StageScaleMode.js";
import { Event } from "@edugames/common/flash/events/Event.js";
import { MouseEvent } from "@edugames/common/flash/events/MouseEvent.js";
import { Facade } from "@edugames/common/org/puremvc/as3/patterns/facade/Facade.js";

/**
 * ...
 * @author Michal Perzak
 */
export class MainGarden extends MovieClip {

	public achProxy: AchievementProxy;
	
	constructor() {
		super();
		if (this.stage) this.init();
		else this.addEventListener(Event.ADDED_TO_STAGE, this.init);
	}
	
	private init(e: Event = null): void {
		TweenPlugin.activate([AutoAlphaPlugin]);
		this.addChild(new NetCom());
		
		this.removeEventListener(Event.ADDED_TO_STAGE, this.init);
		// entry point
		this.achProxy = new AchievementProxy();			
		Facade.getInstance().registerProxy(this.achProxy); // TODO this needs to be added when game starts.
		Facade.getInstance().registerMediator(new GardenMediator(this.stage));
		Popup.Initialize(this.stage);
		
		// PORT: the garden is a page of its own now: when its back arrow removes the garden screen, leave the page.
		this.stage.addEventListener(Event.REMOVED, this.OnScreenRemoved);
		
		var gardbtn: Sprite = new Sprite();
		gardbtn.graphics.beginFill(0x55ff34);
		gardbtn.graphics.drawRect(0,0, 40, 50);
		gardbtn.x = 50;
		gardbtn.y = 150;
		this.addChild(gardbtn);
		gardbtn.addEventListener(MouseEvent.CLICK, () => { Facade.getInstance().registerMediator(new GardenMediator(this.stage)); } );
		
		var btn: Sprite = new Sprite();
		btn.graphics.beginFill(0);
		btn.graphics.drawRect(0,0, 40, 50);
		btn.x = 50;
		btn.y = 100;
		this.addChild(btn);
		
		btn.addEventListener(MouseEvent.CLICK, () => { this.achProxy.AddAchievement(1); } );
		this.stage.scaleMode = StageScaleMode.EXACT_FIT; // PORT: ignored, the page container scales the stage
	}
	
	// PORT: not in the original, see init()
	private OnScreenRemoved(e: Event): void {
		if (!(e.target instanceof GardenScreen)) return;
		if (history.length > 1) history.back();
		else location.assign("../../index.html"); // PORT: explicit index.html, static hosts such as R2 do not serve folders
	}
}
