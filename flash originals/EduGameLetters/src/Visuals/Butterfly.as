package Visuals {
	import com.greensock.easing.Linear;
	import com.greensock.TweenLite;
	import flash.display.Bitmap;
	import flash.display.Sprite;
	import flash.events.Event;
	
	/**
	 * ...
	 * @author Michal Perzak
	 */
	public class Butterfly extends Sprite {
		
		public var isFlying:Boolean;
		private var f1:Bitmap;
		private var f2:Bitmap;
		private var frame:int;
		private var initY:Number;
		
		public function Butterfly() {
			addEventListener(Event.ADDED_TO_STAGE, onAdded);
			isFlying = false;
		}
		
		public function onAdded(e:Event):void {
			removeEventListener(Event.ADDED_TO_STAGE, onAdded);
			addEventListener(Event.ENTER_FRAME, onUpdate);
			
			f1 = Content.GetBitmap("butterfly1");
			f2 = Content.GetBitmap("butterfly2");
			
			addChild(f1);
			addChild(f2);
			f2.visible = false;
			frame = 0;
			
			initY = y;
		}
		
		public function onUpdate(e:Event = null):void {
			frame++;
			if (frame >= 3 && Math.random() > 0.4) {
				frame = 0;
				if (f1.visible) {
					f1.visible = false; 
					f2.visible = true;
				} else {
					f1.visible = true;
					f2.visible = false;
				}
			}
			
			y = initY + Math.sin(new Date().time / 1000) * 15;
		}
		
		public function Fly():void {
			isFlying = true;
			ResetFly();
		}
		
		private function ResetFly():void {
			x = -100;
			if(parent && stage){
				TweenLite.to(this, 10, { x: stage.stageWidth, ease: Linear.easeIn, onComplete:ResetFly } );
			}
		}
	}

}