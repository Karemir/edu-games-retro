import type { Stage } from "@edugames/common/flash/display/Stage.js";
import { GameLevel } from "../Game/GameLevel.js";
import { LevelSelection } from "../Menu/LevelSelection.js";
import type { IMediator } from "@edugames/common/org/puremvc/as3/interfaces/IMediator.js";
import type { INotification } from "@edugames/common/org/puremvc/as3/interfaces/INotification.js";
import { Mediator } from "@edugames/common/org/puremvc/as3/patterns/mediator/Mediator.js";
import { GameLogic } from "./GameLogic.js";

/**
 * ...
 * @author Michal Perzak
 */
export class LevelSelectMediator extends Mediator implements IMediator {
	public static readonly NAME: string = "LevelSelectMediator";
	
	public levelSelection: LevelSelection;
	public difLevel: number = 0; // PORT: int default
	
	constructor(stage: Object, difLevel: number) {
		super(LevelSelectMediator.NAME, stage);
		
		this.difLevel = difLevel;
	}
	
	public onRegister(): void {			
		var levelCount: number = GameLevel.GetLevelsCount();
		var levelFrom: number = 0;
		if (this.difLevel == GameLogic.GAME_DIF_EASY) levelFrom = 0;
		if (this.difLevel == GameLogic.GAME_DIF_MEDIUM) levelFrom = 20;
		if (this.difLevel == GameLogic.GAME_DIF_HARD) levelFrom = 40;
		
		this.levelSelection = new LevelSelection(levelFrom, Math.min(20, levelCount - levelFrom));
		this.stage.addChild(this.levelSelection);
	}
	
	public onRemove(): void {
		this.stage.removeChild(this.levelSelection);
	}
	
	public listNotificationInterests(): Array<any> {
		return [];
	}
	
	public handleNotification(notification: INotification): void {
		super.handleNotification(notification);
	}
	
	public get stage(): Stage {
		return this.viewComponent as Stage;
	}
}
