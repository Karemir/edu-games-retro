import { embed } from "@edugames/common/AssetLoader.js";
import { Bitmap } from "@edugames/common/flash/display/Bitmap.js";
import { Sprite } from "@edugames/common/flash/display/Sprite.js";
import { MouseEvent } from "@edugames/common/flash/events/MouseEvent.js";
import type { Class } from "@edugames/common/flash/utils/Class.js";
import type { IMediator } from "@edugames/common/org/puremvc/as3/interfaces/IMediator.js";
import type { INotification } from "@edugames/common/org/puremvc/as3/interfaces/INotification.js";
import { Mediator } from "@edugames/common/org/puremvc/as3/patterns/mediator/Mediator.js";
import { AppFacade } from "../AppFacade.js";
import { MathQuestion } from "../Data/MathQuestion.js";
import { Events } from "../Events.js";
import { Logger } from "../Logger.js";
import { GameProxy } from "../Proxies/GameProxy.js";
import { Sounds } from "../Proxies/Sounds.js";
import { CraneOperator } from "../VisualParts/CraneOperator.js";
import { TowerBox } from "../VisualParts/TowerBox.js";

/**
 * ...
 * @author Perzka Michalowy
 */
export class TowerSubMediator extends Mediator implements IMediator {
	public static readonly NAME: string = "TowerSubMediator";
	
	// PORT: [Embed] field registered with the AssetLoader, path relative to index.html (was an instance field)
	private static backBtnCl: Class = embed("Assets/menuBackBtn.png");
	
	public menuBackBtn: Sprite;
	public towerBox: TowerBox;
	public gameProxy: GameProxy;
	
	constructor(panel: Sprite) {
		super(TowerSubMediator.NAME, panel);
	}
	
	public listNotificationInterests(): Array<any> {
		return [Events.ANSWER_BAD, 
			Events.ANSWER_OK, 
			Events.ANSWER_SURRENDER, 
			Events.NEW_QUESTION, 
			Events.GAME_SEGMENT_FALLING,
			Events.GAME_SEGMENT_PLACED,
			Events.GAME_TOWER_GROWS,
			Events.GAME_TIMER_TIME_ENDED,
			Events.GAME_TOWER_HEIGHT_UPDATE];
	}
	
	public onRegister(): void {
		super.onRegister();
		
		this.gameProxy = this.facade.retrieveProxy(GameProxy.NAME) as GameProxy;
		this.towerBox = new TowerBox(this.parent.width, this.parent.height);
		this.parent.addChild(this.towerBox);
		
		this.menuBackBtn = new Sprite();
		let tmpbmp: Bitmap = new TowerSubMediator.backBtnCl();
		tmpbmp.smoothing = true;
		this.menuBackBtn.addChild(tmpbmp);
		this.menuBackBtn.x = this.parent.width - this.menuBackBtn.width - 10;
		this.menuBackBtn.y = 0;
		this.parent.addChild(this.menuBackBtn);
		
		this.menuBackBtn.buttonMode = true;
		this.menuBackBtn.addEventListener(MouseEvent.CLICK, () => { // PORT: arrow function keeps `this` (AS3 closures see the instance)
			(AppFacade.GetInstance().retrieveProxy(Sounds.NAME) as Sounds).EffectClick();
			AppFacade.GetInstance().sendNotification(Events.NAVIGATION_MENU, this.parent.stage);
		} );
	}
	
	public onRemove(): void {
		super.onRemove();
		
		this.parent.removeChild(this.towerBox);
		this.parent.removeChild(this.menuBackBtn);
	}
	
	public handleNotification(notification: INotification): void {
		let name: string = notification.getName();
		let body: Object = notification.getBody();
		
		switch(name) {
			case Events.NEW_QUESTION:
				Logger.Log("Tower: new question");
				this.towerBox.NextQuestion(body as MathQuestion);
				break;
			case Events.ANSWER_BAD:
			case Events.ANSWER_SURRENDER:
				this.towerBox.HandleQuestionAnswer();
				AppFacade.GetInstance().sendNotification(Events.CREATE_NEW_QUESTION);
				break;
			case Events.ANSWER_OK:
				Logger.Log("Tower: handler answer");
				this.towerBox.HandleQuestionAnswer();
				break;
			case Events.GAME_TOWER_GROWS:
				this.gameProxy.GrowTower(body as number);
				break;
			case Events.GAME_TIMER_TIME_ENDED:
				this.towerBox.EndGame();
				break;
			case Events.GAME_SEGMENT_FALLING:
				this.towerBox.background.craneOperator.SetState(CraneOperator.STATE_ACTION);
				break;
			case Events.GAME_SEGMENT_PLACED:
				this.towerBox.background.craneOperator.SetState(CraneOperator.STATE_NORMAL);
				break;
			case Events.GAME_TOWER_HEIGHT_UPDATE:
				this.towerBox.indicator.UpdateHeightTxt(body as number);
				break;
		}
	}
	
	public get parent(): Sprite {
		return this.viewComponent as Sprite;
	}
}
