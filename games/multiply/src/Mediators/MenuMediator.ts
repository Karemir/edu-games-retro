import type { Stage } from "@edugames/common/flash/display/Stage.js";
import type { IMediator } from "@edugames/common/org/puremvc/as3/interfaces/IMediator.js";
import type { INotification } from "@edugames/common/org/puremvc/as3/interfaces/INotification.js";
import { Mediator } from "@edugames/common/org/puremvc/as3/patterns/mediator/Mediator.js";
import { MathQuestion } from "../Data/MathQuestion.js";
import { Logger } from "../Logger.js";
import { MenuView } from "../MenuView.js";
import { TowerBlock } from "../VisualParts/TowerBlock.js";

/**
 * ...
 * @author Perz
 */
export class MenuMediator extends Mediator implements IMediator {
	public static readonly NAME: string = "MenuMediator";
	
	public menuView: MenuView;
	
	constructor(stageItem: Object) {
		super(MenuMediator.NAME, stageItem);
	}
	
	public onRegister(): void {
		super.onRegister();
		
		this.menuView = new MenuView();
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
