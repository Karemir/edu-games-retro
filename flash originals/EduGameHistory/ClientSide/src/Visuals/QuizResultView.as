package Visuals {
	import com.greensock.loading.core.DisplayObjectLoader;
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
	import Visuals.Components.TxtButton;
	
	/**
	 * ...
	 * @author Perzak
	 */
	public class QuizResultView extends Sprite {
		[Embed(source="../../Assets/resultsAgainBtn.png")]
		private static const resultsAgainCl:Class;
		[Embed(source="../../Assets/resultsBackBtn.png")]
		private static const resultsBackCl:Class;
		
		public var txt:TextField;
		public var score:Number;
		public var header:Sprite;
		public var headerTxt:TextField;
		
		public var backToMenuBtn:Sprite;
		public var retryBtn:Sprite;
		
		public function QuizResultView(score:Number) {
			this.score = score;
			addEventListener(Event.ADDED_TO_STAGE, onAdded);
		
			//buttonMode = true;
			//addEventListener(MouseEvent.CLICK, onClick);
		}
		
		public function onAdded(e:Event):void {
			var quizConfig:QuizConfigProxy = AppFacade.GetInstance().retrieveProxy(QuizConfigProxy.NAME) as QuizConfigProxy;
			var bg:DisplayObject = quizConfig.GetCurrentEpochBg(true);
			addChild(bg);
			
			var tf:TextFormat = new TextFormat("andale", 30, 0xFFFFFF);
			txt = new TextField();
			txt.defaultTextFormat = tf;
			txt.autoSize = TextFieldAutoSize.LEFT;
			txt.embedFonts = true;
			txt.selectable = false;
			txt.text = "Wynik: " + int(score * 100) + "%";
			txt.x = stage.stageWidth / 2 - txt.width / 2;
			txt.y = stage.stageHeight / 2 - txt.height / 2;
			addChild(txt);
			
			backToMenuBtn = new Sprite();
			var backBmp:Bitmap = new resultsBackCl();
			backBmp.smoothing = true;
			backToMenuBtn.addChild(backBmp);
			backToMenuBtn.buttonMode = true;
			backToMenuBtn.addEventListener(MouseEvent.CLICK, onClick);
			backToMenuBtn.addEventListener(MouseEvent.MOUSE_OVER, onOver);
			backToMenuBtn.addEventListener(MouseEvent.MOUSE_OUT, onOut);
			addChild(backToMenuBtn);
			backToMenuBtn.x = stage.stageWidth / 3 - backToMenuBtn.width / 2;
			backToMenuBtn.y = 450;
			
			retryBtn = new Sprite();
			var retryBmp:Bitmap = new resultsAgainCl();
			retryBmp.smoothing = true;
			retryBtn.addChild(retryBmp);
			retryBtn.buttonMode = true;
			retryBtn.addEventListener(MouseEvent.CLICK, onRetry);
			retryBtn.addEventListener(MouseEvent.MOUSE_OVER, onOver);
			retryBtn.addEventListener(MouseEvent.MOUSE_OUT, onOut);
			addChild(retryBtn);
			retryBtn.x = 2 * (stage.stageWidth / 3) - retryBtn.width / 2;
			retryBtn.y = 450;
			
			headerTxt = new TextField();
			headerTxt.defaultTextFormat = new TextFormat("andale", 18, 0xffffff);
			headerTxt.text = QuizConfigProxy.GetEpochName(quizConfig.epoch);
			headerTxt.selectable = false;
			headerTxt.autoSize = TextFieldAutoSize.LEFT;
			headerTxt.embedFonts = true;
			header = new Sprite();
			header.addChild(headerTxt);
			headerTxt.x = stage.stageWidth / 2 - headerTxt.width / 2;
			headerTxt.y = 108;
			addChild(header);
			
			var lineH:int = headerTxt.y + headerTxt.height / 2;
			header.graphics.lineStyle(1, 0xffffff);
			header.graphics.moveTo(125, lineH);
			header.graphics.lineTo(headerTxt.x - 16, lineH);
			header.graphics.moveTo(headerTxt.x + headerTxt.width + 16, lineH);
			header.graphics.lineTo(stage.stageWidth - 125, lineH);
		}
		
		public function onClick(e:Event):void {
			(AppFacade.GetInstance().retrieveProxy(Sounds.NAME) as Sounds).EffectClick();
			AppFacade.GetInstance().sendNotification(Events.NAVI_SHOW_MENU, stage);
		}
		
		public function onRetry(e:Event):void {
			(AppFacade.GetInstance().retrieveProxy(Sounds.NAME) as Sounds).EffectClick();
			AppFacade.GetInstance().sendNotification(Events.NAVI_START_GAME, stage);
		}
		
		private function onOver(e:MouseEvent):void {
			TweenLite.to(e.currentTarget as Sprite, 0.3, {tint: 0x44ff55});
		}
		
		private function onOut(e:MouseEvent):void {
			TweenLite.to(e.currentTarget as Sprite, 0.3, {tint: 0xffffff});
		}
	}

}