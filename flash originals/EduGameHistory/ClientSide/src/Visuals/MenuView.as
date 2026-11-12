package Visuals {
	import com.greensock.TweenLite;
	import flash.display.Bitmap;
	import flash.display.DisplayObject;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.text.TextField;
	import flash.text.TextFieldAutoSize;
	import flash.text.TextFormat;
	import Proxies.QuestionProxy;
	import Proxies.QuizConfigProxy;
	import Visuals.Components.HUD;
	import Visuals.Components.HUDPanel;
	
	/**
	 * ...
	 * @author Perzak
	 */
	public class MenuView extends Sprite {		
		public var header:Sprite;
		public var headerTxt:TextField;
		public var frontPanel:Sprite;
		public var backPanel:DisplayObject;
		private var panels:Vector.<HUDPanel>;
		private var panelsY:int;
		
		private var configProxy:QuizConfigProxy;
		
		public function MenuView() {
			addEventListener(Event.ADDED_TO_STAGE, onAdded);
		}
		
		private function onAdded(e:Event):void {
			configProxy = AppFacade.GetInstance().retrieveProxy(QuizConfigProxy.NAME) as QuizConfigProxy;
			graphics.beginFill(0xffffff);
			graphics.drawRect(0, 0, stage.stageWidth, stage.stageHeight);
			
			backPanel = QuizConfigProxy.GetDefaultBg();
			frontPanel = new Sprite();
			addChild(backPanel);
			addChild(frontPanel);
			
			headerTxt = new TextField();
			headerTxt.defaultTextFormat = new TextFormat("andale", 20, 0xffffff);
			headerTxt.text = "WYBIERZ EPOKĘ";
			headerTxt.selectable = false;
			headerTxt.autoSize = TextFieldAutoSize.LEFT;
			headerTxt.embedFonts = true;
			header = new Sprite();
			header.addChild(headerTxt);
			headerTxt.x = stage.stageWidth / 2 - headerTxt.width / 2;
			headerTxt.y = 110;
			addChild(header);
			
			var l1x:int, l1y:int, l2x:int, l2y:int;
			l1x = headerTxt.x - 16;
			l2x = headerTxt.x + headerTxt.width + 16;
			l2y = l1y = headerTxt.y + headerTxt.height / 2;
			header.graphics.lineStyle(1, 0xffffff);
			header.graphics.moveTo(l1x, l1y);
			header.graphics.lineTo(l1x - 250, l1y);
			header.graphics.moveTo(l2x, l2y);
			header.graphics.lineTo(l2x + 250, l2y);
			
			// panels
			panels = new Vector.<HUDPanel>();
			panelsY = 360;
			for (var epid:int = QuestionProxy.EPOCH_STAROZYTNOSC; epid <= QuestionProxy.EPOCH_XX; ++epid) {
				var tmp:HUDPanel = new HUDPanel(epid);
				addChild(tmp);
				tmp.y = panelsY;
				tmp.x = tmp.width * (epid - 1) + 75;
				panels.push(tmp);
				
				tmp.addEventListener(MouseEvent.MOUSE_OVER, onOver);
				tmp.addEventListener(MouseEvent.MOUSE_OUT, onOut);
			}
			
			removeEventListener(Event.ADDED_TO_STAGE, onAdded);
		}
		
		private function setBg(img:DisplayObject):void {
			if (frontPanel.numChildren > 0) {
				frontPanel.removeChildren();
			}
			if(img){
				frontPanel.addChild(img);
			}
		}
		
		private function onOver(e:MouseEvent):void {
			var hud:HUDPanel = e.currentTarget as HUDPanel;
			TweenLite.to(hud, 0.4, { y: panelsY - 50 } );
			
			for (var i:int = 0; i < panels.length; ++i) {
				if (e.currentTarget == panels[i]) {
					setBg(configProxy.GetEpochBg(i+1, false));
				}
			}
		}
		
		private function onOut(e:MouseEvent):void {
			var hud:HUDPanel = e.currentTarget as HUDPanel;
			TweenLite.to(hud, 0.4, { y: panelsY } );
			setBg(null);
		}
	}

}