package Visuals.Components {
	import flash.display.Bitmap;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.filters.ColorMatrixFilter;
	import flash.geom.ColorTransform;
	import Proxies.Sounds;
	
	/**
	 * ...
	 * @author Perzak
	 */
	public class CommitButton extends Sprite {
		[Embed(source = "../../../Assets/nextBtn_bg.png")] private static const bgCl:Class;
		[Embed(source = "../../../Assets/nextBtn_normal.png")] private static const normalCl:Class;
		[Embed(source = "../../../Assets/nextBtn_pushed.png")] private static const pushedCl:Class;
		
		public static const COMMIT_PUSHED:String = "CommitPushed";
		
		public var normal:Sprite;
		public var pushed:Sprite;
		
		public function CommitButton() {
			var bg:Bitmap = new bgCl();
			addChild(bg);
			
			var normalBmp:Bitmap = new normalCl();
			var pushedBmp:Bitmap = new pushedCl();
			
			bg.smoothing = true;
			normalBmp.smoothing = true;
			pushedBmp.smoothing = true;
			pushed = new Sprite();
			normal = new Sprite();
			normal.addChild(normalBmp);
			pushed.addChild(pushedBmp);
			
			addChild(normal);
			addChild(pushed);
			
			pushed.x = normal.x = 14;
			pushed.y = normal.y = 25;
			
			pushed.alpha = 0;
			pushed.buttonMode = true;
			pushed.addEventListener(MouseEvent.MOUSE_DOWN, onDown);
			pushed.addEventListener(MouseEvent.MOUSE_UP, onUp);
			pushed.addEventListener(MouseEvent.MOUSE_OUT, onUp);
			pushed.addEventListener(MouseEvent.CLICK, onClick);
		}
		
		private function onDown(e:MouseEvent):void {
			pushed.alpha = 1;
		}
		
		private function onUp(e:MouseEvent):void {
			pushed.alpha = 0;
		}
	
		private function onClick(e:MouseEvent):void {
			(AppFacade.GetInstance().retrieveProxy(Sounds.NAME) as Sounds).EffectClick();
			dispatchEvent(new Event(COMMIT_PUSHED));
		}
		
		public function SetEnabled(enable:Boolean):void {
			if(!enable) {
				pushed.visible = false;
				normal.alpha = 0.6;
			} else {
				pushed.visible = true;
				normal.alpha = 1;
			}
		}
	}

}