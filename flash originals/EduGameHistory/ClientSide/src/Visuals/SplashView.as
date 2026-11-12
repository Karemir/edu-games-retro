package Visuals {
	import com.greensock.loading.data.VideoLoaderVars;
	import com.greensock.TweenLite;
	import flash.display.Bitmap;
	import flash.display.DisplayObject;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.text.TextField;
	import flash.text.TextFieldAutoSize;
	import flash.text.TextFormat;
	import Proxies.QuizConfigProxy;
	import Proxies.Sounds;
	
	/**
	 * ...
	 * @author Perzak
	 */
	public class SplashView extends Sprite {		
		public var startTxt:TextField;
		public var startBtn:Sprite;
		public var title1:TextField;
		public var title2:TextField;
		
		public function SplashView() {
			addEventListener(Event.ADDED_TO_STAGE, onAdded);
		}
		
		private function onAdded(e:Event):void {
			removeEventListener(Event.ADDED_TO_STAGE, onAdded);
			var splash:DisplayObject = QuizConfigProxy.GetDefaultBg();
			var logo:DisplayObject = QuizConfigProxy.GetEULogo();
			var splashCont:Sprite = new Sprite();
			splashCont.addChild(splash);
			addChild(splashCont);
			//splashCont.scaleY = (600-115) / 600;
			logo.alpha = 0.2;
			logo.y = stage.stageHeight; //115 - logo height, not yet loaded.
			addChild(logo);
			TweenLite.to(logo, 0.7, { delay:0.8, alpha:1, y: stage.stageHeight - 115 } );
			
			var gwk:DisplayObject = QuizConfigProxy.GetGWKLogo();
			gwk.alpha = 0.6;
			gwk.x = stage.stageWidth - 132;
			addChild(gwk);
			
			startTxt = new TextField();
			startTxt.defaultTextFormat = new TextFormat("andale", 19, 0xffffff, true);
			startTxt.text = "ROZPOCZNIJ ROZGRYWKĘ";
			startTxt.embedFonts = true;
			startTxt.autoSize = TextFieldAutoSize.LEFT;
			startTxt.x = 10;
			startTxt.y = 6;
			
			startBtn = new Sprite();
			startBtn.addChild(startTxt);
			startBtn.addEventListener(MouseEvent.CLICK, onStartClick);
			addChild(startBtn);
			startBtn.buttonMode = true;
			startBtn.mouseChildren = false;
			startBtn.x = stage.stageWidth / 2 - startBtn.width/2 - 10;
			startBtn.y = stage.stageHeight - startBtn.height - 205;
			startBtn.addEventListener(MouseEvent.MOUSE_OVER, onBtnOver);
			startBtn.addEventListener(MouseEvent.MOUSE_OUT, onBtnOut);
			onBtnOut(null); // draw default line
			
			title1 = new TextField();
			title1.autoSize = TextFieldAutoSize.LEFT;
			title1.defaultTextFormat = new TextFormat("andale", 55, 0xffffff);
			title1.text = "WEHIKUŁ CZASU";
			title1.x = stage.stageWidth / 2 - title1.width / 2;
			title1.y = 225;
			title1.selectable = false;
			title1.embedFonts = true;
			addChild(title1);
			
			title2 = new TextField();
			title2.autoSize = TextFieldAutoSize.LEFT;
			title2.defaultTextFormat = new TextFormat("andale", 19, 0xffffff);
			title2.text = "GRA EDUKACYJNA";
			title2.x = stage.stageWidth / 2 - title2.width / 2;
			title2.y = title1.y + title1.height;
			title2.embedFonts = true;
			title2.selectable = false;
			addChild(title2);
		}
		
		private function onBtnOver(e:Event):void {
			startBtn.graphics.clear();
			startBtn.graphics.lineStyle(1, 0xffffff);
			startBtn.graphics.beginFill(0xffffff, 1);
			startBtn.graphics.drawRect(0, 0, startBtn.width + 20, startBtn.height + 12);
			startTxt.textColor = 0;
		}
		
		private function onBtnOut(e:Event):void {
			startBtn.graphics.clear();
			startBtn.graphics.lineStyle(1, 0xffffff);
			startBtn.graphics.beginFill(0, 0);
			startBtn.graphics.drawRect(0, 0, startBtn.width + 20, startBtn.height + 12);
			startTxt.textColor = 0xffffff;
		}
		
		public function onStartClick(e:Event):void {
			(AppFacade.GetInstance().retrieveProxy(Sounds.NAME) as Sounds).EffectClick();
			AppFacade.GetInstance().sendNotification(Events.NAVI_SHOW_MENU, stage);
		}
	}
}