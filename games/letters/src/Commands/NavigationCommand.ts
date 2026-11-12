import { navigateToURL } from "@edugames/common/flash/net/navigateToURL.js";
import { URLRequest } from "@edugames/common/flash/net/URLRequest.js";
import { MenuMediator } from "../Mediators/MenuMediator.js";
import { RaceLogic } from "../Mediators/RaceLogic.js";
import { RaceSummaryLogic } from "../Mediators/RaceSummaryLogic.js";
import type { ICommand } from "@edugames/common/org/puremvc/as3/interfaces/ICommand.js";
import type { IMediator } from "@edugames/common/org/puremvc/as3/interfaces/IMediator.js";
import type { INotification } from "@edugames/common/org/puremvc/as3/interfaces/INotification.js";
import { SimpleCommand } from "@edugames/common/org/puremvc/as3/patterns/command/SimpleCommand.js";
import { Events } from "../Events.js";
import { Logger } from "../Logger.js";

/**
 * ...
 * @author Michal Perzak
 */
export class NavigationCommand extends SimpleCommand implements ICommand {
	public execute(notification: INotification): void {			
		var notifName: string = notification.getName();
		Logger.Log("navigate: " + notifName);
		
		if (notifName == Events.NAVIGATE_MAIN_MENU) {
			var stage: Object = notification.getBody();
			var logicName: string = notification.getType();
			if (logicName && this.facade.hasMediator(logicName)) {
				this.facade.removeMediator(logicName);
			}
			
			this.facade.registerMediator(new MenuMediator(stage));
		} else if (notifName == Events.NAVIGATE_URL) {
			navigateToURL(new URLRequest(notification.getBody() as string));
			
		} else if (notifName == Events.GAME_CYCLE_SCREENS) {
			var logic: IMediator = notification.getBody() as IMediator;
			var mediatorName: string = logic.getMediatorName();
			var param: string = notification.getType();
			
			switch(mediatorName) {
				case MenuMediator.NAME:
					this.facade.registerMediator(new RaceSummaryLogic(logic.getViewComponent()));
					break;
				case RaceSummaryLogic.NAME:
					if (param) {
						var med: MenuMediator = new MenuMediator(logic.getViewComponent());
						this.facade.registerMediator(med);
						med.menuVisual
						med.menuVisual.ShowSelectTournament();
					} else {
						this.facade.registerMediator(new RaceLogic(logic.getViewComponent()));
					}
					break;
				case RaceLogic.NAME:
					this.facade.registerMediator(new RaceSummaryLogic(logic.getViewComponent()));
					break;
				default:
					Logger.Log("unknown logic in cycle " + logicName);
			}

			if (this.facade.hasMediator(mediatorName)) {
				this.facade.removeMediator(mediatorName);
			}
		}
	}
}
