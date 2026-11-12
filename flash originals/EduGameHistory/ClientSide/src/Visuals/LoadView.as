package Visuals {
	import com.greensock.TweenLite;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.text.TextField;
	import flash.text.TextFieldAutoSize;
	import flash.text.TextFormat;
	import Proxies.QuizConfigProxy;
	
	/**
	 * ...
	 * @author Perzak
	 */
	public class LoadView extends Sprite {
		private var entry:Sprite;
		private var configProxy:QuizConfigProxy;
		
		public function LoadView() {
			addEventListener(Event.ADDED_TO_STAGE, onAdded);
			configProxy = AppFacade.GetInstance().retrieveProxy(QuizConfigProxy.NAME) as QuizConfigProxy;
		}
		
		private function onAdded(e:Event):void {
			removeEventListener(Event.ADDED_TO_STAGE, onAdded);
			
			addChild(configProxy.GetCurrentEpochBg(true));
		}
	
		public function SetMessage(msg:String):void {
			if (entry) {
				TweenLite.to(entry, 0.5, { y: entry.y - 30, autoAlpha: 0 } );
			}
			entry = new Sprite();
			var txt:TextField = new TextField();
			txt.defaultTextFormat = new TextFormat("andale", 18, 0xffffff);
			txt.autoSize = TextFieldAutoSize.LEFT;
			txt.selectable = false;
			txt.embedFonts = true;
			entry.addChild(txt);			

			txt.text = msg;
			txt.x = stage.stageWidth / 2 - txt.width / 2;
			txt.y = stage.stageHeight - 140;
			
			var l1x:int, l1y:int, l2x:int, l2y:int;
			l1x = 125;
			l2y = l1y = txt.y + txt.height / 2;
			l2x = 590;
			
			entry.graphics.lineStyle(1, 0xffffff);
			entry.graphics.moveTo(l1x, l1y);
			entry.graphics.lineTo(txt.x - 30, l1y);
			entry.graphics.moveTo(txt.x + txt.width + 30, l2y);
			entry.graphics.lineTo(l2x + 246, l2y);
			addChild(entry);
			entry.alpha = 0;
			entry.y = 30;
			TweenLite.to(entry, 0.5, { alpha:1, y: 0 } );
		}
		
		public function AllowMenu():void {
			buttonMode = true;
			addEventListener(MouseEvent.CLICK, function():void { 
				AppFacade.GetInstance().sendNotification(Events.NAVI_SHOW_MENU, stage);
			});
		}
	}

}