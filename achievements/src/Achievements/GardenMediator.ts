import type { MovieClip } from "@edugames/common/flash/display/MovieClip.js";
import type { Stage } from "@edugames/common/flash/display/Stage.js";
import type { Point } from "@edugames/common/flash/geom/Point.js";
import type { IMediator } from "@edugames/common/org/puremvc/as3/interfaces/IMediator.js";
import type { INotification } from "@edugames/common/org/puremvc/as3/interfaces/INotification.js";
import { Mediator } from "@edugames/common/org/puremvc/as3/patterns/mediator/Mediator.js";
import { AchievementProxy } from "./AchievementProxy.js";
import { GardenScreen } from "./Components/GardenScreen.js";
import { Events } from "./Events.js";
import type { GardenItem } from "./GardenItem.js";
import { NetCom } from "./NetCom.js";

/**
 * ...
 * @author Michal Perzak
 */
export class GardenMediator extends Mediator implements IMediator {
	public static readonly NAME: string = "GardenMediator";
	
	public garden: GardenScreen;
	public achProxy: AchievementProxy;
	
	constructor(stageItem: Object) {
		super(GardenMediator.NAME, stageItem);
	}
	
	public onRegister(): void {
		console.log("Garden mediator registered"); // PORT: trace
		
		this.achProxy = this.facade.retrieveProxy(AchievementProxy.NAME) as AchievementProxy;
		this.garden = new GardenScreen();
		this.stage.addChild(this.garden);
		
		if (this.achProxy.isLoaded) {
			this.InitGarden();
		}
	}
	
	public onNetSetup(setupList: Point[]): void { // PORT: Vector.<Point>
		for (const pt of setupList) {
			try{
				let item: GardenItem = this.garden.items[pt.y-1];
				this.garden.spots[pt.x].PlaceItem(item.contentImage);
			} catch(e) {}
		}
	}
	
	public onRemove(): void {
		console.log("Garden mediator removed"); // PORT: trace
		this.stage.removeChild(this.garden);
	}
	
	public listNotificationInterests(): Array<any> {
		return [Events.GARDEN_EXIT, 
		Events.GARDEN_ITEM_BUY, 
		Events.GARDEN_START_DRAG,
		Events.ACHIEVEMENTS_LOADED,
		Events.ACHIEVEMENT_DESC_HIDE,
		Events.ACHIEVEMENT_DESC_SHOW];
	}
	
	public InitGarden(): void {
		this.garden.EnableDrawer();
		NetCom.instance.GardenGetSetup(this.onNetSetup);
	}
	
	public handleNotification(notification: INotification): void {
		let noteName: string = notification.getName();
		let body: Object = notification.getBody();
		
		switch (noteName) {
			case Events.GARDEN_EXIT:
				this.facade.removeMediator(GardenMediator.NAME);
				break;
			case Events.ACHIEVEMENTS_LOADED:
				this.InitGarden();
				break;
			case Events.GARDEN_START_DRAG:
				this.garden.StartDraggingItem(body as MovieClip);
				break;
			case Events.ACHIEVEMENT_DESC_HIDE:
				this.garden.HideInfoPanel();
				break;
			case Events.ACHIEVEMENT_DESC_SHOW:
				this.garden.DisplayInfoPanel(body as GardenItem);
				break;
		}
	}

	public get stage(): Stage {
		return this.viewComponent as Stage;
	}
}
