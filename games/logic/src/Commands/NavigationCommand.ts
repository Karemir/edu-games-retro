import type { Stage } from "@edugames/common/flash/display/Stage.js";
import { navigateToURL } from "@edugames/common/flash/net/navigateToURL.js";
import { URLRequest } from "@edugames/common/flash/net/URLRequest.js";
import { GameLevel } from "../Game/GameLevel.js";
import { GameLogic } from "../Mediators/GameLogic.js";
import { LevelSelectMediator } from "../Mediators/LevelSelectMediator.js";
import { MenuDifficultyMediator } from "../Mediators/MenuDifficultyMediator.js";
import { MenuMediator } from "../Mediators/MenuMediator.js";
import type { ICommand } from "@edugames/common/org/puremvc/as3/interfaces/ICommand.js";
import type { INotification } from "@edugames/common/org/puremvc/as3/interfaces/INotification.js";
import { MacroCommand } from "@edugames/common/org/puremvc/as3/patterns/command/MacroCommand.js";
import { SimpleCommand } from "@edugames/common/org/puremvc/as3/patterns/command/SimpleCommand.js";
import { Events } from "../Events.js";
import { Logger } from "../Logger.js";

/**
 * ...
 * @author Michal Perzak
 */
export class NavigationCommand extends SimpleCommand implements ICommand {
	public execute(notification: INotification): void {
		var stage: Object = notification.getBody();
		
		var notifName: string = notification.getName();
		var notifType: string = notification.getType();
		Logger.Log("navigate: " + notifName);
		
		if (notifName == Events.NAVIGATION_URL) {
			navigateToURL(new URLRequest(notification.getBody() as string));
			return;
		}
		
		if (this.facade.hasMediator(LevelSelectMediator.NAME)) {
			this.facade.removeMediator(LevelSelectMediator.NAME);
		}
		if (this.facade.hasMediator(GameLogic.NAME)) {
			this.facade.removeMediator(GameLogic.NAME);
		}
		if (this.facade.hasMediator(MenuMediator.NAME)) {
			this.facade.removeMediator(MenuMediator.NAME);
		}
		if (this.facade.hasMediator(MenuDifficultyMediator.NAME)) {
			this.facade.removeMediator(MenuDifficultyMediator.NAME);
		}
		
		if (notifName == Events.MENU_LEVEL_SELECTED) {
			this.facade.registerMediator(new GameLogic(stage, (Number(notifType) | 0))); // PORT: int() -> | 0
		} else if (notifName == Events.NAVIGATION_MENU) {
			this.facade.registerMediator(new MenuMediator(stage));
		} else if(notifName == Events.NAVIGATION_CHOOSE_LEVEL) {
			this.facade.registerMediator(new LevelSelectMediator(stage, (Number(notifType) | 0))); // PORT: int() -> | 0
		} else if (notifName == Events.NAVIGATION_CHOOSE_DIF) {
			this.facade.registerMediator(new MenuDifficultyMediator(stage));
		}
	
		//facade.registerMediator(new PageMediator(stage));
		//facade.registerMediator(new ClipboardMediator(stage));
		//
		//facade.registerCommand(FullscreenMediator.FULL_START, FullscreenStartCommand);
		//facade.registerCommand(FullscreenMediator.FULL_HIDE, FullscreenStopCommand);
		//facade.removeMediator(SplashMediator.NAME);
	}
}
