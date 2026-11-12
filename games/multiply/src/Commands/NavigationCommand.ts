import { navigateToURL } from "@edugames/common/flash/net/navigateToURL.js";
import { URLRequest } from "@edugames/common/flash/net/URLRequest.js";
import type { ICommand } from "@edugames/common/org/puremvc/as3/interfaces/ICommand.js";
import type { INotification } from "@edugames/common/org/puremvc/as3/interfaces/INotification.js";
import { MacroCommand } from "@edugames/common/org/puremvc/as3/patterns/command/MacroCommand.js";
import { SimpleCommand } from "@edugames/common/org/puremvc/as3/patterns/command/SimpleCommand.js";
import { Events } from "../Events.js";
import { Logger } from "../Logger.js";
import { GameMediator } from "../Mediators/GameMediator.js";
import { MenuMediator } from "../Mediators/MenuMediator.js";

/**
 * ...
 * @author Michal Perzak
 */
export class NavigationCommand extends SimpleCommand implements ICommand {
	public execute(notification: INotification): void {
		var stage: Object = notification.getBody();
		
		var notifName: string = notification.getName();
		Logger.Log("navigate: " + notifName);
		
		if (notifName == Events.NAVIGATION_GAME_ARCADE) {
			if (this.facade.hasMediator(MenuMediator.NAME)) {
				this.facade.removeMediator(MenuMediator.NAME);
			}
			
			if (this.facade.hasMediator(GameMediator.NAME)) {
				this.facade.removeMediator(GameMediator.NAME);
			}
			
			this.facade.registerMediator(new GameMediator(stage, GameMediator.GAME_MODE_ARCADE));
		} else if (notifName == Events.NAVIGATION_GAME_FREEPLAY) {
			if (this.facade.hasMediator(MenuMediator.NAME)) {
				this.facade.removeMediator(MenuMediator.NAME);
			}
			if (this.facade.hasMediator(GameMediator.NAME)) {
				this.facade.removeMediator(GameMediator.NAME);
			}
			this.facade.registerMediator(new GameMediator(stage, GameMediator.GAME_MODE_FREEPLAY));
		} else if (notifName == Events.NAVIGATION_MENU) {
			if (this.facade.hasMediator(GameMediator.NAME)) {
				this.facade.removeMediator(GameMediator.NAME);
			}
			this.facade.registerMediator(new MenuMediator(stage));
		} else if (notifName == Events.NAVIGATION_URL) {
			navigateToURL(new URLRequest(notification.getBody() as string));
		}
	
		//facade.registerMediator(new PageMediator(stage));
		//facade.registerMediator(new ClipboardMediator(stage));
		//
		//facade.registerCommand(FullscreenMediator.FULL_START, FullscreenStartCommand);
		//facade.registerCommand(FullscreenMediator.FULL_HIDE, FullscreenStopCommand);
		//facade.removeMediator(SplashMediator.NAME);
	}
}
