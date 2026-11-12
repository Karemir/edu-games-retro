import type { Stage } from "@edugames/common/flash/display/Stage.js";
import { Keyboard } from "@edugames/common/flash/ui/Keyboard.js";
import type { IMediator } from "@edugames/common/org/puremvc/as3/interfaces/IMediator.js";
import type { INotification } from "@edugames/common/org/puremvc/as3/interfaces/INotification.js";
import { Mediator } from "@edugames/common/org/puremvc/as3/patterns/mediator/Mediator.js";
import { AchievementProxy } from "@edugames/achievements/Achievements/AchievementProxy.js";
import { Events } from "../Events.js";
import { Character } from "../Game/Character.js";
import { GameLevel } from "../Game/GameLevel.js";
import { RoboCommand } from "../Game/RoboCommand.js";
import { Screen } from "../Game/Screen.js";
import { CommandHistory } from "../Proxies/CommandHistory.js";
import { SaveData } from "../Proxies/SaveData.js";

/**
 * ...
 * @author Michal Perzak
 */
export class GameLogic extends Mediator implements IMediator {
	public static readonly NAME: string = "GameLogic";
	public static readonly GAME_DIF_EASY: number = 1;
	public static readonly GAME_DIF_MEDIUM: number = 2;
	public static readonly GAME_DIF_HARD: number = 3;
	
	public saveData: SaveData;
	public commandHist: CommandHistory;
	public gameScreen: Screen;
	public character: Character;
	public isExecuting: boolean;
	public levelId: number = 0; // PORT: AS3 int defaults to 0
	
	constructor(stageItem: Object, levelId: number) {
		super(GameLogic.NAME, stageItem);
		
		this.isExecuting = false;
		this.gameScreen = null;
		this.levelId = levelId;
	}
	
	public onRegister(): void {
		this.commandHist = this.facade.retrieveProxy(CommandHistory.NAME) as CommandHistory;
		this.saveData = this.facade.retrieveProxy(SaveData.NAME) as SaveData;
		this.ShowScreen();
	}
	
	public onRemove(): void {
		if (this.gameScreen) { this.stage.removeChild(this.gameScreen);}
	}
	
	private ShowScreen(): void {
		if (this.gameScreen) { this.stage.removeChild(this.gameScreen); }
		
		this.gameScreen = new Screen(this.levelId);
		this.gameScreen.Show();
		this.stage.addChild(this.gameScreen);
		this.gameScreen.commandList.RestoreCommands(this.commandHist.GetCommands(this.levelId));
		this.gameScreen.UpdateComCount(this.gameScreen.commandList.roboCommands.length);
		this.character = this.gameScreen.character;
		this.stage.focus = this.gameScreen;
	}
	
	public listNotificationInterests(): Array<any> {
		return [ Events.KEY_PRESS,
			Events.GAME_ADD_COMMAND,
			Events.GAME_EXECUTE,
			Events.GAME_COMMAND_DONE,
			Events.GAME_REMOVE_COMMAND,
			Events.GAME_NEXT_COMMAND,
			Events.GAME_RESET_LEVEL,
			Events.GAME_COMPLETE_LEVEL,
			Events.GAME_STOP_EXECUTE
		];
	}

	public handleNotification(notification: INotification): void 
	{
		let name: string = notification.getName();
		let body: Object = notification.getBody();
		
		switch(name){
			case Events.KEY_PRESS:
				this.HandleKey(body as number); // PORT: uint
				break;
			case Events.GAME_ADD_COMMAND:
				this.gameScreen.commandList.AddCommand(Number(body) | 0); // PORT: int()
				this.gameScreen.UpdateComCount(this.gameScreen.commandList.roboCommands.length);
				break;
			case Events.GAME_COMMAND_DONE:
				this.gameScreen.commandList.OnCommandDone();
				break;
			case Events.GAME_REMOVE_COMMAND:
				this.gameScreen.commandList.OnCommandRemove(body as RoboCommand);
				this.gameScreen.UpdateComCount(this.gameScreen.commandList.roboCommands.length);
				break;
			case Events.GAME_NEXT_COMMAND:
				this.HandleCommand(Number(body) | 0); // PORT: int()
				break;
			case Events.GAME_EXECUTE:
				if (!this.isExecuting && this.gameScreen.commandList.HasCommand()) {
					this.isExecuting = true;
					this.gameScreen.StartFan(); // make some visuals :)
					this.commandHist.StoreCommands(this.gameScreen.commandList.roboCommands, this.levelId);
					this.gameScreen.commandList.StartExecuting();
					this.character.PowerUp(this.gameScreen.commandList.GetCommand());
				}
				break;
			case Events.GAME_RESET_LEVEL:
				this.isExecuting = false;
				// PORT: arrow function, the closure calls a member
				this.gameScreen.Hide(() => {
					this.ShowScreen();
				} );
				break;
			case Events.GAME_STOP_EXECUTE:
				this.isExecuting = false;
				this.gameScreen.StopFan();
				this.gameScreen.commandList.StopExecuting();
				break;
			case Events.GAME_COMPLETE_LEVEL:
				// lets check how many stars we got
				let moveCount: number = this.commandHist.GetCommands(this.levelId).length;
				let starCount: number = 1;
				if (this.gameScreen.gameLevel.movesFor3Stars >= moveCount) {
					this.saveData.SetLevelStatus(this.levelId, SaveData.LEVEL_3_STAR);
					starCount = 3;
				} else if (this.gameScreen.gameLevel.movesFor2Stars >= moveCount) {
					this.saveData.SetLevelStatus(this.levelId, SaveData.LEVEL_2_STAR);
					starCount = 2;
				} else {
					this.saveData.SetLevelStatus(this.levelId, SaveData.LEVEL_1_STAR);
					starCount = 1;
				}
				
				if(this.levelId < GameLevel.GetLevelsCount() - 1){
					this.gameScreen.ShowEndPopup(moveCount, starCount, true);
				} else {
					this.gameScreen.ShowEndPopup(moveCount, starCount, false);
				}
				
				this.ProcessAchievements();
				break;
		}
	}
	
	private HandleCommand(cmdType: number): void {
		if (cmdType == RoboCommand.FORWARD) {
			this.character.GoForward();
		} else if (cmdType == RoboCommand.ROTATE_LEFT) {
			this.character.RotateLeft();
		} else if (cmdType == RoboCommand.ROTATE_RIGHT) {
			this.character.RotateRight();
		} else if (cmdType == RoboCommand.USE) {
			this.character.Use();
		} 
	}
	
	private HandleKey(keycode: number): void {
		if (keycode == Keyboard.ESCAPE) {
			this.sendNotification(Events.NAVIGATION_MENU, this.stage);
		}
		return;
		
		if (keycode == Keyboard.LEFT || keycode == Keyboard.A) {
			this.character.RotateLeft();
		} else if (keycode == Keyboard.RIGHT || keycode == Keyboard.D) {
			this.character.RotateRight();
		} else if (keycode == Keyboard.UP || keycode == Keyboard.W) {
			this.character.GoForward();
		}
	}

	public ProcessAchievements(): void { 
		let achProxy: AchievementProxy = this.facade.retrieveProxy(AchievementProxy.NAME) as AchievementProxy;
		let lvlCount: number = GameLevel.GetLevelsCount();
		
		let lvlsComplete: number = 0;
		let lvlsPerfect: number = 0;
		let lastLvlDone: boolean = false;
		for (let i: number = 0; i < lvlCount; ++i) {
			if (this.saveData.GetLevelStatus(i) != SaveData.LEVEL_NOT_COMPLETED) {
				lvlsComplete++;
			}
			if (this.saveData.GetLevelStatus(i) == SaveData.LEVEL_3_STAR) {
				lvlsPerfect++;
				if (i == lvlCount -1) {
					lastLvlDone = true;
				}
			}
		}
		
		// push achievements.
		if (lvlsComplete >= 10) {
			achProxy.AddAchievement(15); //"Pokonanie 10 plansz"
		}
		if (lvlsComplete >= 30) {
			achProxy.AddAchievement(16); //"Pokonanie 30 plansz"
		}
		if (lvlsComplete >= 50) {
			achProxy.AddAchievement(17); //"Pokonanie 50 plansz"
		}
		
		if (lvlsPerfect >= 15) {
			achProxy.AddAchievement(18); // "pokonanie 15 plansz na 3 gwiazdki"
		}
		if (lvlsPerfect >= 30) {
			achProxy.AddAchievement(19); // "pokonanie 30 plansz na 3 gwiazdki"
		}
		if (lvlsPerfect >= 45) {
			achProxy.AddAchievement(20); // "pokonanie 45 plansz na 3 gwiazdki"
		}
		
		if (lastLvlDone) {
			achProxy.AddAchievement(21); // "3 gwiazdki na ostatnim poziomie"
		}
	}

	public get stage(): Stage {
		return this.viewComponent as Stage;
	}
}
