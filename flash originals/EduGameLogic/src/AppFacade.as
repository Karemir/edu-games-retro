package  {
	import Achievements.AchievementProxy;
	import Commands.*;
	import flash.display.Stage;
	import flash.display.StageScaleMode;
	import flash.events.KeyboardEvent;
	import Game.GameLevel;
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
			registerCommand(Events.NAVIGATION_CHOOSE_DIF, NavigationCommand);
			registerCommand(Events.NAVIGATION_CHOOSE_LEVEL, NavigationCommand);
			registerCommand(Events.NAVIGATION_PLAY_GAME, NavigationCommand);
			registerCommand(Events.NAVIGATION_MENU, NavigationCommand);
			registerCommand(Events.MENU_LEVEL_SELECTED, NavigationCommand);
			registerCommand(Events.NAVIGATION_URL, NavigationCommand);

			registerProxy(new AchievementProxy()); // TODO this needs to be added when game starts
		}
		
		public function Startup(stage:Stage):void {
			this.stage = stage;
			this.stage.scaleMode = StageScaleMode.SHOW_ALL;
			sendNotification(STARTUP, stage);

			stage.addEventListener(KeyboardEvent.KEY_DOWN, OnKeyDown);
		}

		public function OnKeyDown(e:KeyboardEvent):void {
			Logger.Log("Key pressed " + e.keyCode);
			sendNotification(Events.KEY_PRESS, e.keyCode);
		}
	}
}