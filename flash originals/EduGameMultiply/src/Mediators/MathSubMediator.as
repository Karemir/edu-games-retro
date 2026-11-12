package Mediators {
	import Data.DifficultyLevel;
	import Data.MathQuestion;
	import flash.display.Sprite;
	import org.puremvc.as3.interfaces.IMediator;
	import org.puremvc.as3.interfaces.INotification;
	import org.puremvc.as3.patterns.mediator.Mediator;
	import VisualParts.MultiplyGrid;
	import VisualParts.MultiplyInput;
	import VisualParts.MultiplyStatus;
	
	/**
	 * ...
	 * @author Perzka Michalowy
	 */
	public class MathSubMediator extends Mediator implements IMediator {
		public static const NAME:String = "MathSubMediator";
		public var multiGrid:MultiplyGrid;
		public var multiInput:MultiplyInput;
		public var multiStatus:MultiplyStatus;
		
		public function MathSubMediator(panel:Sprite) {
			super(NAME, panel);
		}
		
		override public function listNotificationInterests():Array {
			return [Events.NEW_QUESTION, Events.NEW_LEVEL,
				
				Events.GAME_NUM_BACK, Events.GAME_NUM_DONE, Events.GAME_NUM_ENTERED,
				Events.GAME_NEW_ARCADE, Events.GAME_NEW_FREEPLAY,
				Events.GAME_TIMER_UPDATE, Events.GAME_TOWER_HEIGHT_UPDATE];
		}
		
		override public function onRegister():void {
			super.onRegister();
			multiGrid = new MultiplyGrid();
			parent.addChild(multiGrid);
			multiGrid.x = parent.width / 2 - multiGrid.width / 2 - 12;
			multiGrid.y = 100;
			
			multiInput = new MultiplyInput(parent.width - 20, 115);
			parent.addChild(multiInput);
			multiInput.x = 10;
			multiInput.y = 475 //parent.height - 10 - multiInput.height;
			
			multiStatus = new MultiplyStatus(parent.width, 100);
			parent.addChild(multiStatus);
			multiStatus.x = 0;
			multiStatus.y = 400; //multiInput.y - multiStatus.height - 10;
		}
		
		override public function onRemove():void {
			super.onRemove();
			parent.removeChild(multiGrid);
			parent.removeChild(multiInput);
			parent.removeChild(multiStatus);
			
			multiInput = null;
			multiGrid = null;
		}
		
		override public function handleNotification(notification:INotification):void {
			var name:String = notification.getName();
			var body:Object = notification.getBody();
			
			switch (name) {
				case Events.NEW_QUESTION: 
					Logger.Log("new question " + (body as MathQuestion).ToLongString());
					multiGrid.SetQuestion(body as MathQuestion);
					multiInput.SetQuestion(body as MathQuestion);
					break;
				case Events.GAME_NUM_BACK: 
				case Events.GAME_NUM_DONE: 
				case Events.GAME_NUM_ENTERED: 
					multiInput.UpdateQuestion();
					break;
				
				case Events.GAME_TOWER_HEIGHT_UPDATE: 
					multiStatus.SetTowerHeight(body as int);
					break;
				case Events.GAME_TIMER_UPDATE: 
					multiStatus.SetTimeLeft(body as String);
					break;
				case Events.NEW_LEVEL:  {
					var diflvl:DifficultyLevel = body as DifficultyLevel;
					multiGrid.SetLevel(diflvl.multiplyFactorMax);
				}
					break;
				case Events.GAME_NEW_ARCADE:
					multiGrid.SetLevel(1);
					break;
				case Events.GAME_NEW_FREEPLAY:
					multiGrid.SetLevel(10);
					break;
			}
		}
		
		public function get parent():Sprite {
			return viewComponent as Sprite;
		}
	
	}

}