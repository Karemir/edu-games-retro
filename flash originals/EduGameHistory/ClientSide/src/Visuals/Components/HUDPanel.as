package Visuals.Components {
	import com.greensock.plugins.FrameBackwardPlugin;
	import com.greensock.TweenLite;
	import flash.display.Bitmap;
	import flash.display.GradientType;
	import flash.display.Sprite;
	import flash.events.MouseEvent;
	import flash.geom.Matrix;
	import flash.text.TextField;
	import flash.text.TextFieldAutoSize;
	import flash.text.TextFormat;
	import Proxies.HighscoreProxy;
	import Proxies.QuestionProxy;
	import Proxies.QuizConfigProxy;
	import Proxies.Sounds;
	
	/**
	 * ...
	 * @author Perzak
	 */
	public class HUDPanel extends Sprite {
		public var epochId:int;
		public var panelBg:Sprite;
		public var epochName:TextField;
		
		private var d1:TxtButton;
		private var d2:TxtButton;
		private var d3:TxtButton;
		private var d4:TxtButton;
		private var d5:TxtButton;
		
		private var d1prog:ProgressIndicator;
		private var d2prog:ProgressIndicator;
		private var d3prog:ProgressIndicator;
		private var d4prog:ProgressIndicator;
		private var d5prog:ProgressIndicator;
		
		private var highscore:HighscoreProxy;
		private var sounds:Sounds;
		
		public function HUDPanel(epochId:int) {
			this.epochId = epochId;
			highscore = AppFacade.GetInstance().retrieveProxy(HighscoreProxy.NAME) as HighscoreProxy;
			sounds = AppFacade.GetInstance().retrieveProxy(Sounds.NAME) as Sounds;
			panelBg = new Sprite();
			var m:Matrix = new Matrix();
			m.createGradientBox(160, 250, Math.PI / 2);
			panelBg.graphics.beginGradientFill(GradientType.LINEAR, [0x142132, 0x142132], [0.8, 0], [80, 180], m);
			panelBg.graphics.drawRect(0, 0, 160, 300);
			panelBg.alpha = 0;
			addChild(panelBg);
			
			epochName = new TextField();
			epochName.selectable = false;
			epochName.defaultTextFormat = new TextFormat("andale", 18, 0xeddf00);
			epochName.autoSize = TextFieldAutoSize.LEFT;
			epochName.embedFonts = true;
			epochName.text = QuizConfigProxy.GetEpochName(epochId);			
			epochName.x = 10;//width / 2 - epochName.width / 2;
			epochName.y = 3;
			addChild(epochName);
			
			var tf:TextFormat = new TextFormat("andale", 12, 0xffffff);
			d1 = new TxtButton("PODSTAWOWY", tf);
			d2 = new TxtButton("ZAAWANSOWANY", tf);
			d3 = new TxtButton("MISTRZOWSKI", tf);
			d4 = new TxtButton("MARATON", tf);
			d5 = new TxtButton("PRÓBA CZASU", tf);
			
			d1.addEventListener(MouseEvent.CLICK, onClick);
			d2.addEventListener(MouseEvent.CLICK, onClick);
			d3.addEventListener(MouseEvent.CLICK, onClick);
			
			d1.addEventListener(MouseEvent.MOUSE_OVER, onDifOver);
			d2.addEventListener(MouseEvent.MOUSE_OVER, onDifOver);
			d3.addEventListener(MouseEvent.MOUSE_OVER, onDifOver);
			
			d1.addEventListener(MouseEvent.MOUSE_OUT, onDifOut);
			d2.addEventListener(MouseEvent.MOUSE_OUT, onDifOut);
			d3.addEventListener(MouseEvent.MOUSE_OUT, onDifOut);
			
			addChild(d1);
			addChild(d2);
			addChild(d3);
			addChild(d4);
			addChild(d5);
			
			d1.x = d2.x = d3.x = d4.x = d5.x = 10;
			d1.y = 40;
			
			d2.y = d1.height + d1.y;
			d3.y = d2.height + d2.y;
			d4.y = d3.height + d3.y;
			d5.y = d4.height + d4.y;
			
			var hscore:Number = highscore.GetHighscore(epochId, QuestionProxy.DIF_EASY);
			//if (hscore > 0) {
				d1prog = new ProgressIndicator(false, hscore, 30, d1.height - 6);
				d1prog.x = 110;
				d1prog.y = d1.y + 0;
				addChild(d1prog);
			//}
			hscore = highscore.GetHighscore(epochId, QuestionProxy.DIF_MEDIUM);
		//	if (hscore > 0) {
				d2prog = new ProgressIndicator(false, hscore, 30, d2.height - 6);
				d2prog.x = 110;
				d2prog.y = d2.y + 0;
				addChild(d2prog);
		//	}
			
			hscore = highscore.GetHighscore(epochId, QuestionProxy.DIF_HARD);
			//if (hscore > 0) {
				d3prog = new ProgressIndicator(false, hscore, 30, d3.height - 6);
				d3prog.x = 110;
				d3prog.y = d3.y + 0;
				addChild(d3prog);
			//}
			
			if (hscore > 0) {
				d4.addEventListener(MouseEvent.CLICK, onClick);
				d5.addEventListener(MouseEvent.CLICK, onClick);
				d4.addEventListener(MouseEvent.MOUSE_OVER, onDifOver);
				d5.addEventListener(MouseEvent.MOUSE_OVER, onDifOver);
				d4.addEventListener(MouseEvent.MOUSE_OUT, onDifOut);
				d5.addEventListener(MouseEvent.MOUSE_OUT, onDifOut);
				
				hscore = highscore.GetHighscore(epochId, QuestionProxy.DIF_HARD + QuestionProxy.GAME_MODE_MARATHON);
				d4prog = new ProgressIndicator(false, hscore, 30, d4.height - 6);
				d4prog.x = 110;
				d4prog.y = d4.y + 0;
				addChild(d4prog);
				hscore = highscore.GetHighscore(epochId, QuestionProxy.DIF_HARD + QuestionProxy.GAME_MODE_TIME_ATTACH);
				d5prog = new ProgressIndicator(false, hscore, 30, d5.height - 6);
				d5prog.x = 110;
				d5prog.y = d5.y + 0;
				addChild(d5prog);
			} else {
				d4.buttonMode = false;
				d5.buttonMode = false;
				d4.alpha = 0.7;
				d5.alpha = 0.7;
			}
			
			addEventListener(MouseEvent.MOUSE_OVER, function():void {
					TweenLite.to(panelBg, 0.5, {alpha: 1});
				});
			addEventListener(MouseEvent.MOUSE_OUT, function():void {
					TweenLite.to(panelBg, 0.5, {alpha: 0});
				});
		}
		
		private function onDifOver(e:MouseEvent):void {
			var trg:Sprite = e.currentTarget as Sprite;
			TweenLite.to(trg, 0.2, {tint: 0x44ff55});
		}
		
		private function onDifOut(e:MouseEvent):void {
			var trg:Sprite = e.currentTarget as Sprite;
			TweenLite.to(trg, 0.2, {tint: 0xffffff});
		}
		
		public function onClick(e:MouseEvent):void {
			sounds.EffectClick();
			
			AppFacade.GetInstance().sendNotification(Events.MENU_EPOCH, epochId);
			if (e.currentTarget == d1) {
				AppFacade.GetInstance().sendNotification(Events.MENU_MODE, QuestionProxy.GAME_MODE_NORMAL);
				AppFacade.GetInstance().sendNotification(Events.MENU_DIF, QuestionProxy.DIF_EASY);
			} else if (e.currentTarget == d2) {
				AppFacade.GetInstance().sendNotification(Events.MENU_MODE, QuestionProxy.GAME_MODE_NORMAL);
				AppFacade.GetInstance().sendNotification(Events.MENU_DIF, QuestionProxy.DIF_MEDIUM);
			} else if (e.currentTarget == d3) {
				AppFacade.GetInstance().sendNotification(Events.MENU_MODE, QuestionProxy.GAME_MODE_NORMAL);
				AppFacade.GetInstance().sendNotification(Events.MENU_DIF, QuestionProxy.DIF_HARD);
			} else if (e.currentTarget == d4) {
				AppFacade.GetInstance().sendNotification(Events.MENU_MODE, QuestionProxy.GAME_MODE_MARATHON);
				AppFacade.GetInstance().sendNotification(Events.MENU_DIF, QuestionProxy.DIF_HARD);
			} else if (e.currentTarget == d5) {
				AppFacade.GetInstance().sendNotification(Events.MENU_MODE, QuestionProxy.GAME_MODE_TIME_ATTACH);
				AppFacade.GetInstance().sendNotification(Events.MENU_DIF, QuestionProxy.DIF_HARD);
			}
			
			AppFacade.GetInstance().sendNotification(Events.NAVI_START_GAME, stage);
		}
	}

}