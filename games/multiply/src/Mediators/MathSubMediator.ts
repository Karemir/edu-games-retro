import type { Sprite } from "@edugames/common/flash/display/Sprite.js";
import type { IMediator } from "@edugames/common/org/puremvc/as3/interfaces/IMediator.js";
import type { INotification } from "@edugames/common/org/puremvc/as3/interfaces/INotification.js";
import { Mediator } from "@edugames/common/org/puremvc/as3/patterns/mediator/Mediator.js";
import { DifficultyLevel } from "../Data/DifficultyLevel.js";
import { MathQuestion } from "../Data/MathQuestion.js";
import { Events } from "../Events.js";
import { Logger } from "../Logger.js";
import { MultiplyGrid } from "../VisualParts/MultiplyGrid.js";
import { MultiplyInput } from "../VisualParts/MultiplyInput.js";
import { MultiplyStatus } from "../VisualParts/MultiplyStatus.js";

/**
 * ...
 * @author Perzka Michalowy
 */
export class MathSubMediator extends Mediator implements IMediator {
	public static readonly NAME: string = "MathSubMediator";
	public multiGrid: MultiplyGrid;
	public multiInput: MultiplyInput;
	public multiStatus: MultiplyStatus;
	
	constructor(panel: Sprite) {
		super(MathSubMediator.NAME, panel);
	}
	
	public listNotificationInterests(): Array<any> {
		return [Events.NEW_QUESTION, Events.NEW_LEVEL,
			
			Events.GAME_NUM_BACK, Events.GAME_NUM_DONE, Events.GAME_NUM_ENTERED,
			Events.GAME_NEW_ARCADE, Events.GAME_NEW_FREEPLAY,
			Events.GAME_TIMER_UPDATE, Events.GAME_TOWER_HEIGHT_UPDATE];
	}
	
	public onRegister(): void {
		super.onRegister();
		this.multiGrid = new MultiplyGrid();
		this.parent.addChild(this.multiGrid);
		this.multiGrid.x = this.parent.width / 2 - this.multiGrid.width / 2 - 12;
		this.multiGrid.y = 100;
		
		this.multiInput = new MultiplyInput(this.parent.width - 20, 115);
		this.parent.addChild(this.multiInput);
		this.multiInput.x = 10;
		this.multiInput.y = 475 //parent.height - 10 - multiInput.height;
		
		this.multiStatus = new MultiplyStatus(this.parent.width, 100);
		this.parent.addChild(this.multiStatus);
		this.multiStatus.x = 0;
		this.multiStatus.y = 400; //multiInput.y - multiStatus.height - 10;
	}
	
	public onRemove(): void {
		super.onRemove();
		this.parent.removeChild(this.multiGrid);
		this.parent.removeChild(this.multiInput);
		this.parent.removeChild(this.multiStatus);
		
		this.multiInput = null;
		this.multiGrid = null;
	}
	
	public handleNotification(notification: INotification): void {
		let name: string = notification.getName();
		let body: Object = notification.getBody();
		
		switch (name) {
			case Events.NEW_QUESTION: 
				Logger.Log("new question " + (body as MathQuestion).ToLongString());
				this.multiGrid.SetQuestion(body as MathQuestion);
				this.multiInput.SetQuestion(body as MathQuestion);
				break;
			case Events.GAME_NUM_BACK: 
			case Events.GAME_NUM_DONE: 
			case Events.GAME_NUM_ENTERED: 
				this.multiInput.UpdateQuestion();
				break;
			
			case Events.GAME_TOWER_HEIGHT_UPDATE: 
				this.multiStatus.SetTowerHeight(body as number);
				break;
			case Events.GAME_TIMER_UPDATE: 
				this.multiStatus.SetTimeLeft(body as string);
				break;
			case Events.NEW_LEVEL:  {
				let diflvl: DifficultyLevel = body as DifficultyLevel;
				this.multiGrid.SetLevel(diflvl.multiplyFactorMax);
			}
				break;
			case Events.GAME_NEW_ARCADE:
				this.multiGrid.SetLevel(1);
				break;
			case Events.GAME_NEW_FREEPLAY:
				this.multiGrid.SetLevel(10);
				break;
		}
	}
	
	public get parent(): Sprite {
		return this.viewComponent as Sprite;
	}

}
