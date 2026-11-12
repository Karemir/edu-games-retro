import type { Sprite } from "@edugames/common/flash/display/Sprite.js";
import type { Stage } from "@edugames/common/flash/display/Stage.js";
import { DifficultySelection } from "../Menu/DifficultySelection.js";
import { MenuView } from "../Menu/MenuView.js";
import type { IMediator } from "@edugames/common/org/puremvc/as3/interfaces/IMediator.js";
import type { INotification } from "@edugames/common/org/puremvc/as3/interfaces/INotification.js";
import { Mediator } from "@edugames/common/org/puremvc/as3/patterns/mediator/Mediator.js";
import { Logger } from "../Logger.js";

/**
 * ...
 * @author Michal Perzak
 */
export class MenuDifficultyMediator extends Mediator implements IMediator {
	public static readonly NAME: string = "MenuDifficultyMediator";
	
	public menuView: Sprite;
	
	constructor(stageItem: Object) {
		super(MenuDifficultyMediator.NAME, stageItem);
	}
	
	public onRegister(): void {
		super.onRegister();
		
		this.menuView = new DifficultySelection();
		this.stage.addChild(this.menuView);
	}
	
	public onRemove(): void {
		super.onRemove();
		
		this.stage.removeChild(this.menuView);
	}
	
	public listNotificationInterests(): Array<any> {
		return [];
	}
	
	public handleNotification(notif: INotification): void {
		switch (notif.getName()) {
			default: 
				Logger.Log("Unknown notification");
				return;
		}
	}
	
	public get stage(): Stage {
		return this.viewComponent as Stage;
	}

}
