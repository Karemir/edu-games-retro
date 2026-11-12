package Commands {
	import flash.display.Stage;
	import flash.net.navigateToURL;
	import flash.net.URLRequest;
	import Game.GameLevel;
	import Mediators.GameLogic;
	import Mediators.LevelSelectMediator;
	import Mediators.MenuDifficultyMediator;
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
			var notifType:String = notification.getType();
			Logger.Log("navigate: " + notifName);
			
			if (notifName == Events.NAVIGATION_URL) {
				navigateToURL(new URLRequest(notification.getBody() as String));
				return;
			}
			
			if (facade.hasMediator(LevelSelectMediator.NAME)) {
				facade.removeMediator(LevelSelectMediator.NAME);
			}
			if (facade.hasMediator(GameLogic.NAME)) {
				facade.removeMediator(GameLogic.NAME);
			}
			if (facade.hasMediator(MenuMediator.NAME)) {
				facade.removeMediator(MenuMediator.NAME);
			}
			if (facade.hasMediator(MenuDifficultyMediator.NAME)) {
				facade.removeMediator(MenuDifficultyMediator.NAME);
			}
			
			if (notifName == Events.MENU_LEVEL_SELECTED) {
				facade.registerMediator(new GameLogic(stage, int(notifType)));
			} else if (notifName == Events.NAVIGATION_MENU) {
				facade.registerMediator(new MenuMediator(stage));
			} else if(notifName == Events.NAVIGATION_CHOOSE_LEVEL) {
				facade.registerMediator(new LevelSelectMediator(stage, int(notifType)));
			} else if (notifName == Events.NAVIGATION_CHOOSE_DIF) {
				facade.registerMediator(new MenuDifficultyMediator(stage));
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