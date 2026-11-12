//import Achievements.AchievementProxy; // PORT: achievements TODO
import { AppCommand } from "./Commands/AppCommand.js";
import { NavigationCommand } from "./Commands/NavigationCommand.js";
import { Events } from "./Events.js";
import type { Stage } from "@edugames/common/flash/display/Stage.js";
import { StageAlign } from "@edugames/common/flash/display/StageAlign.js";
import { StageScaleMode } from "@edugames/common/flash/display/StageScaleMode.js";
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
		this.registerCommand(Events.NAVIGATION_GAME_ARCADE, NavigationCommand);
		this.registerCommand(Events.NAVIGATION_GAME_FREEPLAY, NavigationCommand);
		this.registerCommand(Events.NAVIGATION_MENU, NavigationCommand);
		this.registerCommand(Events.NAVIGATION_URL, NavigationCommand);
		
		//registerProxy(new AchievementProxy()); // TODO this needs to be added when game starts // PORT: achievements TODO
	}
	
	public Startup(stage: Stage): void {
		this.stage = stage;
		stage.scaleMode = StageScaleMode.SHOW_ALL;
		stage.align = StageAlign.TOP_LEFT;
		this.sendNotification(AppFacade.STARTUP, stage);
	}
}
