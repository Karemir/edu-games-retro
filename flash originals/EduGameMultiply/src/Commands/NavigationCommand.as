package Commands {
	import flash.net.navigateToURL;
	import flash.net.URLRequest;
	import Mediators.GameMediator;
	import Mediators.MenuMediator;
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
			Logger.Log("navigate: " + notifName);
			
			if (notifName == Events.NAVIGATION_GAME_ARCADE) {
				if (facade.hasMediator(MenuMediator.NAME)) {
					facade.removeMediator(MenuMediator.NAME);
				}
				
				if (facade.hasMediator(GameMediator.NAME)) {
					facade.removeMediator(GameMediator.NAME);
				}
				
				facade.registerMediator(new GameMediator(stage, GameMediator.GAME_MODE_ARCADE));
			} else if (notifName == Events.NAVIGATION_GAME_FREEPLAY) {
				if (facade.hasMediator(MenuMediator.NAME)) {
					facade.removeMediator(MenuMediator.NAME);
				}
				if (facade.hasMediator(GameMediator.NAME)) {
					facade.removeMediator(GameMediator.NAME);
				}
				facade.registerMediator(new GameMediator(stage, GameMediator.GAME_MODE_FREEPLAY));
			} else if (notifName == Events.NAVIGATION_MENU) {
				if (facade.hasMediator(GameMediator.NAME)) {
					facade.removeMediator(GameMediator.NAME);
				}
				facade.registerMediator(new MenuMediator(stage));
			} else if (notifName == Events.NAVIGATION_URL) {
				navigateToURL(new URLRequest(notification.getBody() as String));
			}
		
			//facade.registerMediator(new PageMediator(stage));
			//facade.registerMediator(new ClipboardMediator(stage));
			//
			//facade.registerCommand(FullscreenMediator.FULL_START, FullscreenStartCommand);
			//facade.registerCommand(FullscreenMediator.FULL_HIDE, FullscreenStopCommand);
			//facade.removeMediator(SplashMediator.NAME);
		}
	}
}