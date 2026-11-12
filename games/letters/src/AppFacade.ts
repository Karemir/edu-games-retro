import { AchievementProxy } from "@edugames/achievements/Achievements/AchievementProxy.js";
import { AppCommand } from "./Commands/AppCommand.js";
import { NavigationCommand } from "./Commands/NavigationCommand.js";
import { Content } from "./Content.js";
import { Events } from "./Events.js";
import { Logger } from "./Logger.js";
import type { Stage } from "@edugames/common/flash/display/Stage.js";
import { StageScaleMode } from "@edugames/common/flash/display/StageScaleMode.js";
import { KeyboardEvent } from "@edugames/common/flash/events/KeyboardEvent.js";
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
		this.registerCommand(Events.NAVIGATE_MAIN_MENU, NavigationCommand);
		this.registerCommand(Events.NAVIGATE_URL, NavigationCommand);
		this.registerCommand(Events.GAME_CYCLE_SCREENS, NavigationCommand);
		this.registerCommand(Events.GAME_FINAL_ROUND_DONE, NavigationCommand);

		this.registerProxy(new AchievementProxy()); // TODO this needs to be added when game starts
	}
	
	public Startup(stage: Stage): void {
		this.stage = stage;
		this.stage.scaleMode = StageScaleMode.SHOW_ALL;
		
		Content.Init(stage); // load all images and then startup is called from content.
		//sendNotification(STARTUP, stage);
		
		stage.addEventListener(KeyboardEvent.KEY_DOWN, this.OnKeyDown);
	}
	
	public OnKeyDown(e: KeyboardEvent): void {
		Logger.Log("Key pressed " + e.keyCode);
		this.sendNotification(Events.KEY_PRESS, e.keyCode);
	}
}
