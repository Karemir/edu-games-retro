package Mediators {
	import flash.display.Stage;
	import Game.GameLevel;
	import Menu.LevelSelection;
	import org.puremvc.as3.interfaces.IMediator;
	import org.puremvc.as3.interfaces.INotification;
	import org.puremvc.as3.patterns.mediator.Mediator;
	
	/**
	 * ...
	 * @author Michal Perzak
	 */
	public class LevelSelectMediator extends Mediator implements IMediator {
		public static const NAME:String = "LevelSelectMediator";
		
		public var levelSelection:LevelSelection;
		public var difLevel:int;
		
		public function LevelSelectMediator(stage:Object, difLevel:int) {
			super(NAME, stage);
			
			this.difLevel = difLevel;
		}
		
		override public function onRegister():void {			
			var levelCount:int = GameLevel.GetLevelsCount();
			var levelFrom:int = 0;
			if (difLevel == GameLogic.GAME_DIF_EASY) levelFrom = 0;
			if (difLevel == GameLogic.GAME_DIF_MEDIUM) levelFrom = 20;
			if (difLevel == GameLogic.GAME_DIF_HARD) levelFrom = 40;
			
			levelSelection = new LevelSelection(levelFrom, Math.min(20, levelCount - levelFrom));
			stage.addChild(levelSelection);
		}
		
		override public function onRemove():void {
			stage.removeChild(levelSelection);
		}
		
		override public function listNotificationInterests():Array {
			return [];
		}
		
		override public function handleNotification(notification:INotification):void {
			super.handleNotification(notification);
		}
		
		public function get stage():Stage {
			return viewComponent as Stage;
		}
	}

}