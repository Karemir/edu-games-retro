import type { Stage } from "@edugames/common/flash/display/Stage.js";
import type { IMediator } from "@edugames/common/org/puremvc/as3/interfaces/IMediator.js";
import type { INotification } from "@edugames/common/org/puremvc/as3/interfaces/INotification.js";
import { Mediator } from "@edugames/common/org/puremvc/as3/patterns/mediator/Mediator.js";
import { Events } from "../Events.js";
import { GameData } from "../Proxies/GameData.js";
import { MainMenuScreen } from "../Visuals/MainMenuScreen.js";

/**
 * ...
 * @author Perzka Michalowy
 */
export class MenuMediator extends Mediator implements IMediator 
{
	public static readonly NAME: string = "MenuMediator";
	
	public menuVisual: MainMenuScreen;
	public gameData: GameData;
	
	constructor(stageItem: Object) 
	{
		super(MenuMediator.NAME, stageItem);
		
		this.menuVisual = new MainMenuScreen();
	}
	
	public onRegister(): void 
	{
		this.stage.addChild(this.menuVisual);
		this.gameData = this.facade.retrieveProxy(GameData.NAME) as GameData;
		
		this.stage.focus = this.menuVisual;
	}
	
	public onRemove(): void 
	{
		this.stage.removeChild(this.menuVisual);
	}
	
	public listNotificationInterests(): Array<any> 
	{
		return [
			Events.MAIN_MENU_GAME_READY,
			Events.MAIN_MENU_PANEL_BACK,
			Events.KEY_PRESS,
			Events.MENU_TOURNAMENT_SELECTED
		];
	}
	
	public handleNotification(notification: INotification): void 
	{
		var name: string = notification.getName();
		var body: Object = notification.getBody();
		
		switch(name) {
			case Events.MAIN_MENU_PANEL_BACK:
				this.menuVisual.HideNewGamePanel();
				break;
			case Events.MAIN_MENU_GAME_READY:
				this.gameData.StartNewGame(this.menuVisual.newGamePanel.playerName, this.menuVisual.newGamePanel.currentVehicleId);
				break;
			case Events.KEY_PRESS:
				this.menuVisual.HandleKeypress(body as number); // PORT: uint
				break;
			case Events.MENU_TOURNAMENT_SELECTED:
				this.gameData.currentTournament = (Number(body) | 0);
				this.sendNotification(Events.GAME_CYCLE_SCREENS, this);
				break;
		}
	}

	public get stage(): Stage {
		return this.viewComponent as Stage;
	}
}
