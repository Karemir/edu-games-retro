package Commands {
	import flash.net.navigateToURL;
	import flash.net.URLRequest;
	import Mediators.MenuMediator;
	import Mediators.*;
	import org.puremvc.as3.interfaces.ICommand;
	import org.puremvc.as3.interfaces.IMediator;
	import org.puremvc.as3.interfaces.INotification;
	import org.puremvc.as3.patterns.command.MacroCommand;
	import org.puremvc.as3.patterns.command.SimpleCommand;
	import org.puremvc.as3.patterns.mediator.Mediator;
	
	/**
	 * ...
	 * @author Michal Perzak
	 */
	public class NavigationCommand extends SimpleCommand implements ICommand {
		override public function execute(notification:INotification):void {			
			var notifName:String = notification.getName();
			Logger.Log("navigate: " + notifName);
			
			if (notifName == Events.NAVIGATE_MAIN_MENU) {
				var stage:Object = notification.getBody();
				var logicName:String = notification.getType();
				if (logicName && facade.hasMediator(logicName)) {
					facade.removeMediator(logicName);
				}
				
				facade.registerMediator(new MenuMediator(stage));
			} else if (notifName == Events.NAVIGATE_URL) {
				navigateToURL(new URLRequest(notification.getBody() as String));
				
			} else if (notifName == Events.GAME_CYCLE_SCREENS) {
				var logic:IMediator = notification.getBody() as IMediator;
				var mediatorName:String = logic.getMediatorName();
				var param:String = notification.getType();
				
				switch(mediatorName) {
					case MenuMediator.NAME:
						facade.registerMediator(new RaceSummaryLogic(logic.getViewComponent()));
						break;
					case RaceSummaryLogic.NAME:
						if (param) {
							var med:MenuMediator = new MenuMediator(logic.getViewComponent());
							facade.registerMediator(med);
							med.menuVisual
							med.menuVisual.ShowSelectTournament();
						} else {
							facade.registerMediator(new RaceLogic(logic.getViewComponent()));
						}
						break;
					case RaceLogic.NAME:
						facade.registerMediator(new RaceSummaryLogic(logic.getViewComponent()));
						break;
					default:
						Logger.Log("unknown logic in cycle " + logicName);
				}

				if (facade.hasMediator(mediatorName)) {
					facade.removeMediator(mediatorName);
				}
			}
		}
	}
}