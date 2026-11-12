package Commands {
	import flash.display.Stage;
	import flash.net.navigateToURL;
	import flash.net.URLRequest;
	import Mediators.GameMediator;
	import Mediators.MenuMediator;
	import Mediators.SplashMediator;
	import org.puremvc.as3.interfaces.ICommand;
	import org.puremvc.as3.interfaces.INotification;
	import org.puremvc.as3.patterns.command.MacroCommand;
	import org.puremvc.as3.patterns.command.SimpleCommand;
	
	/**
	 * ...
	 * @author Michal Perzak
	 */
	public class NavigationCommand extends SimpleCommand implements ICommand {
		override public function execute(notification:INotification):void {
			var stage:Object = notification.getBody();
			
			var notifName:String = notification.getName();
			var notifType:String = notification.getType();
			Logger.Log("navigate: " + notifName);
			
			if (notifName == Events.NAVIGATION_URL) {
				navigateToURL(new URLRequest(notification.getBody() as String));
				return;
			}
			
			if (facade.hasMediator(MenuMediator.NAME)) {
				facade.removeMediator(MenuMediator.NAME);
			}
			if (facade.hasMediator(SplashMediator.NAME)) {
				facade.removeMediator(SplashMediator.NAME);
			}
			if (facade.hasMediator(GameMediator.NAME)) {
				facade.removeMediator(GameMediator.NAME);
			}
			
			if (notifName == Events.NAVI_SHOW_MENU) {
				facade.registerMediator(new MenuMediator(stage));
			} else if (notifName == Events.NAVI_START_GAME) {
				facade.registerMediator(new GameMediator(stage));
			}
		}
	}
}