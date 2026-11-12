package {
	import flash.display.Bitmap;
	import flash.display.Sprite;
	import flash.events.Event;
	
	/**
	 * ...
	 * @author Perz
	 */
	public class GameView extends Sprite {
		private static const LEFT_PANEL_SIZE:Number = 400; 
		
		public var questionPanel:Sprite;
		public var towerPanel:Sprite;
				
		public function GameView() {
			questionPanel = new Sprite();
			towerPanel = new Sprite();
			
			var leftBg:Bitmap = Content.GetBmp("leftPanelBmp");
			leftBg.smoothing = true;
			
			addChild(questionPanel);
			questionPanel.addChild(leftBg);
			addChild(towerPanel);
			
			addEventListener(Event.ADDED_TO_STAGE, OnAdded);
		}
		
		private function OnAdded(e:Event):void {
			questionPanel.graphics.clear();
			questionPanel.graphics.beginFill(0xAAAAAA, 0);
			questionPanel.graphics.drawRect(0, 0, LEFT_PANEL_SIZE, stage.stageHeight);

			towerPanel.graphics.clear();
			towerPanel.graphics.beginFill(0xDDDDDD, 0);
			towerPanel.graphics.drawRect(0, 0, stage.stageWidth - questionPanel.width, stage.stageHeight);
			towerPanel.x = questionPanel.width;
		}	
	}

}