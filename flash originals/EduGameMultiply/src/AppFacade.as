package  {
	import Achievements.AchievementProxy;
	import Commands.*;
	import flash.display.Stage;
	import flash.display.StageAlign;
	import flash.display.StageScaleMode;
	import org.puremvc.as3.interfaces.IFacade;
	import org.puremvc.as3.patterns.facade.Facade;
	
	/**
	 * ...
	 * @author Michal Perzak
	 */
	public class AppFacade extends Facade implements IFacade {
		public static const STARTUP:String = "Startup";
		
		private var stage:Stage;
		
		public static function GetInstance():AppFacade {
			if (!instance)
				instance = new AppFacade();
				
			return instance as AppFacade;
		}
		
		override protected function initializeController():void {
			super.initializeController();
			
			registerCommand(STARTUP, AppCommand);
			registerCommand(Events.NAVIGATION_GAME_ARCADE, NavigationCommand);
			registerCommand(Events.NAVIGATION_GAME_FREEPLAY, NavigationCommand);
			registerCommand(Events.NAVIGATION_MENU, NavigationCommand);
			registerCommand(Events.NAVIGATION_URL, NavigationCommand);
			
			registerProxy(new AchievementProxy()); // TODO this needs to be added when game starts
		}
		
		public function Startup(stage:Stage):void {
			this.stage = stage;
			stage.scaleMode = StageScaleMode.SHOW_ALL;
			stage.align = StageAlign.TOP_LEFT;
			sendNotification(STARTUP, stage);
		}
	}
}