package Visuals.Components {
	import com.greensock.TweenLite;
	import flash.display.Graphics;
	import flash.display.Sprite;
	import flash.display.Stage;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import Proxies.QuestionProxy;
	
	/**
	 * ...
	 * @author Perzak
	 */
	public class HUD extends Sprite {
		private var layers:Vector.<Sprite>;
		private var tmpStage:Stage;
		
		public function HUD() {
			addEventListener(Event.ADDED_TO_STAGE, onAdded);
			addEventListener(Event.REMOVED_FROM_STAGE, onRemoved);
			//addEventListener(Event.ENTER_FRAME, function(e:Event):void { rotationX += 0.5; } );
		}
		
		private function onRemoved(e:Event):void {
			tmpStage.removeEventListener(MouseEvent.MOUSE_MOVE, onMove);
		}
		
		private function onAdded(e:Event):void {
			tmpStage = stage;
			removeEventListener(Event.ADDED_TO_STAGE, onAdded);
			stage.addEventListener(MouseEvent.MOUSE_MOVE, onMove);
			Init();
		}
	
		private function Init():void {
			var l1:Sprite = new Sprite();
			var l2:Sprite = new Sprite();
			var l3:Sprite = new Sprite();
			
			layers = new Vector.<Sprite>();
			layers.push(l1, l2, l3);
			addChild(l3);
			addChild(l2);
			addChild(l1);
			
			l3.z = -300;
			l2.z = -200;
			l1.z = -100;
			
			this.x = stage.stageWidth / 2;
			this.y = stage.stageHeight / 2;
			//l1.x = l2.x = l3.x = stage.stageWidth / 2;
			//l1.y = l2.y = l3.y = stage.stageHeight / 2;
			
			DrawStars(l1.graphics);
			DrawStars(l2.graphics);
			DrawStars(l3.graphics);
		}
		
		private function DrawStars(g:Graphics):void {
			g.beginFill(0xffffff, 0.9);
			for (var i:int = 0; i < 400; ++i) {
				g.drawCircle((Math.random()-0.5) * stage.stageWidth, (Math.random()-0.5) * stage.stageHeight, 1);
			}
		}
		
		private function onMove(e:MouseEvent):void {
			var xval:Number = (e.stageX / stage.stageWidth) - 0.5;
			var yval:Number = (e.stageY / stage.stageHeight) - 0.5;
			this.x = stage.stageWidth / 2 - xval * 20;
			this.y = stage.stageHeight / 2 - yval * 20;
		}
		
	}

}