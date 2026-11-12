package  {
	import Commands.*;
	import flash.display.Stage;
	import flash.display.StageScaleMode;
	import flash.events.KeyboardEvent;
	import org.puremvc.as3.interfaces.IFacade;
	import org.puremvc.as3.patterns.facade.Facade;
	import Proxies.QuestionProxy;
	
	/**
	 * ...
	 * @author Michal Perzak
	 */
	public class AppFacade extends Facade implements IFacade {
		public static const STARTUP:String = "Startup";
		
		public var stage:Stage;
		
		public static function GetInstance():AppFacade {
			if (!instance)
				instance = new AppFacade();
				
			return instance as AppFacade;
		}
		
		override protected function initializeController():void {
			super.initializeController();
			
			registerCommand(STARTUP, AppCommand);
			registerCommand(Events.NAVI_SHOW_MENU, NavigationCommand);
			registerCommand(Events.NAVI_START_GAME, NavigationCommand);
			//registerCommand(Events.NAVIGATION_CHOOSE_DIF, NavigationCommand);
		}
		
		public function Startup(stage:Stage):void {
			this.stage = stage;
			sendNotification(STARTUP, stage);

			stage.addEventListener(KeyboardEvent.KEY_DOWN, OnKeyDown);
		}

		public function OnKeyDown(e:KeyboardEvent):void {
			Logger.Log("Key pressed " + e.keyCode);
			sendNotification(Events.KEY_PRESS, e.keyCode);
		}
	}
}