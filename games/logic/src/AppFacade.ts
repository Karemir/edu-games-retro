//import Achievements.AchievementProxy; // PORT: achievements TODO
import { AppCommand } from "./Commands/AppCommand.js";
import { NavigationCommand } from "./Commands/NavigationCommand.js";
import { Events } from "./Events.js";
import { Logger } from "./Logger.js";
import type { Stage } from "@edugames/common/flash/display/Stage.js";
import { StageScaleMode } from "@edugames/common/flash/display/StageScaleMode.js";
import { KeyboardEvent } from "@edugames/common/flash/events/KeyboardEvent.js";
import { GameLevel } from "./Game/GameLevel.js";
import type { IFacade } from "@edugames/common/org/puremvc/as3/interfaces/IFacade.js";
import { Facade } from "@edugames/common/org/puremvc/as3/patterns/facade/Facade.js";

/**
 * ...
 * @author Michal Perzak
 */
export class AppFacade extends Facade implements IFacade {
	public static readonly STARTUP: string = "Startup";
	
	private stage: Stage;
	
	public static GetInstance(): AppFacade {
		if (!Facade.instance) // PORT: inherited static `instance` needs the class name
			Facade.instance = new AppFacade();
			
		return Facade.instance as AppFacade;
	}
	
	protected initializeController(): void {
		super.initializeController();
		
		this.registerCommand(AppFacade.STARTUP, AppCommand);
		this.registerCommand(Events.NAVIGATION_CHOOSE_DIF, NavigationCommand);
		this.registerCommand(Events.NAVIGATION_CHOOSE_LEVEL, NavigationCommand);
		this.registerCommand(Events.NAVIGATION_PLAY_GAME, NavigationCommand);
		this.registerCommand(Events.NAVIGATION_MENU, NavigationCommand);
		this.registerCommand(Events.MENU_LEVEL_SELECTED, NavigationCommand);
		this.registerCommand(Events.NAVIGATION_URL, NavigationCommand);

		//registerProxy(new AchievementProxy()); // TODO this needs to be added when game starts // PORT: achievements TODO
	}
	
	public Startup(stage: Stage): void {
		this.stage = stage;
		this.stage.scaleMode = StageScaleMode.SHOW_ALL;
		this.sendNotification(AppFacade.STARTUP, stage);

		stage.addEventListener(KeyboardEvent.KEY_DOWN, this.OnKeyDown);
	}

	public OnKeyDown(e: KeyboardEvent): void {
		Logger.Log("Key pressed " + e.keyCode);
		this.sendNotification(Events.KEY_PRESS, e.keyCode);
	}
}
