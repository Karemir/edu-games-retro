package  {
	import Achievements.AchievementProxy;
	import com.greensock.layout.ScaleMode;
	import Commands.*;
	import flash.display.Sprite;
	import flash.display.Stage;
	import flash.display.StageScaleMode;
	import flash.events.KeyboardEvent;
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
			registerCommand(Events.NAVIGATE_MAIN_MENU, NavigationCommand);
			registerCommand(Events.NAVIGATE_URL, NavigationCommand);
			registerCommand(Events.GAME_CYCLE_SCREENS, NavigationCommand);
			registerCommand(Events.GAME_FINAL_ROUND_DONE, NavigationCommand);

			registerProxy(new AchievementProxy()); // TODO this needs to be added when game starts
		}
		
		public function Startup(stage:Stage):void {
			this.stage = stage;
			this.stage.scaleMode = StageScaleMode.SHOW_ALL;
			
			Content.Init(stage); // load all images and then startup is called from content.
			//sendNotification(STARTUP, stage);
			
			stage.addEventListener(KeyboardEvent.KEY_DOWN, OnKeyDown);
		}
		
		public function OnKeyDown(e:KeyboardEvent):void {
			Logger.Log("Key pressed " + e.keyCode);
			sendNotification(Events.KEY_PRESS, e.keyCode);
		}
	}
}