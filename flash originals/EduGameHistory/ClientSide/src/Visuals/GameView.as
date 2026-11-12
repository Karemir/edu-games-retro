package Visuals {
	import com.greensock.easing.Linear;
	import com.greensock.TweenLite;
	import flash.display.Bitmap;
	import flash.display.DisplayObject;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.text.TextField;
	import flash.text.TextFieldAutoSize;
	import flash.text.TextFormat;
	import flash.text.TextFormatAlign;
	import Proxies.QuestionProxy;
	import Proxies.QuizConfigProxy;
	import Proxies.Sounds;
	import Visuals.Components.CommitButton;
	import Visuals.Components.QuestionTimer;
	
	/**
	 * ...
	 * @author Perzak
	 */
	public class GameView extends Sprite {
		public static const IMAGES_PREPARED:String = "ImagesPrepared";
		
		[Embed(source = "../../Assets/backToMenuBtn2.png")] private static const backCl:Class;
		
		public var quizPanels:Vector.<QuizPanel>;
		public var proxy:QuestionProxy;
		public var quizConfig:QuizConfigProxy;
		private var loadIdx:int;
		
		public var bg:DisplayObject;
		public var content:Sprite;
		public var currentQuiz:QuizPanel;
		public var commitBtn:CommitButton;
		public var menuBtn:Bitmap;
		public var qtimer:QuestionTimer;
		
		public var header:Sprite;
		public var headerTxt:TextField;
		public var infoText:TextField;
		
		public function GameView(proxy:QuestionProxy) {
			loadIdx = 0;
			quizPanels = new Vector.<QuizPanel>();
			this.proxy = proxy;
			this.quizConfig = AppFacade.GetInstance().retrieveProxy(QuizConfigProxy.NAME) as QuizConfigProxy;
			
			addEventListener(Event.ADDED_TO_STAGE, onAdded);
			addEventListener(Event.REMOVED_FROM_STAGE, onRemove);
			
			LoadPanel();
		}
	
		private function onAdded(e:Event):void {
			bg = quizConfig.GetCurrentEpochBg(false);
			var wDif:Number = stage.stageWidth * 0.05;
			var hDif:Number = stage.stageHeight * 0.05;
			bg.width = stage.stageWidth;
			bg.height = stage.stageHeight;
			// this is the zooming effect when game is started. (needed more space)
			TweenLite.to(bg, 0.4, { width: stage.stageWidth + wDif, height: stage.stageHeight + hDif, x: -wDif/2, y: -hDif/2, ease: Linear.easeIn } );
			addChild(bg);
			
			var tmpBack:Sprite = new Sprite();
			menuBtn = new backCl();
			menuBtn.smoothing = true;
			menuBtn.x = 35;
			menuBtn.y = 40;
			menuBtn.alpha = 0;
			TweenLite.to(menuBtn, 0.4, { alpha: 1, delay: 0.5 } );
			tmpBack.buttonMode = true;
			tmpBack.addEventListener(MouseEvent.CLICK, onMenuClick);
			tmpBack.addChild(menuBtn);
			addChild(tmpBack);
			
			tmpBack.addEventListener(MouseEvent.MOUSE_OVER, function(e:Event):void { TweenLite.to(tmpBack, 0.3, {tint:0x44ff55}); } );
			tmpBack.addEventListener(MouseEvent.MOUSE_OUT, function(e:Event):void { TweenLite.to(tmpBack, 0.3, { tint:0xffffff } ); } );
			
			if(quizConfig.gameMode != QuestionProxy.GAME_MODE_MARATHON){
				qtimer = new QuestionTimer();
				qtimer.x = stage.stageWidth - 40;
				qtimer.y = 50;
				qtimer.alpha = 0;
				TweenLite.to(qtimer, 0.4, { alpha: 1, delay: 0.5 } );
				qtimer.addEventListener(QuestionTimer.TIMER_DONE, onCommitClick);
				addChild(qtimer);
			}
			
			infoText = new TextField();
			infoText.defaultTextFormat = new TextFormat("andale", 16, 0xdddddd);
			infoText.autoSize = TextFieldAutoSize.LEFT;
			infoText.selectable = false;
			infoText.embedFonts = true;
			addChild(infoText);

			headerTxt = new TextField();
			headerTxt.defaultTextFormat = new TextFormat("andale", 18, 0xffffff, null,null,null,null,null, TextFormatAlign.CENTER);
			headerTxt.text = QuizConfigProxy.GetEpochName(quizConfig.epoch);
			headerTxt.selectable = false;
			headerTxt.autoSize = TextFieldAutoSize.LEFT;
			
			headerTxt.embedFonts = true;
			header = new Sprite();
			header.addChild(headerTxt);
			headerTxt.x = stage.stageWidth / 2 - headerTxt.width / 2;
			headerTxt.y = 108;
			addChild(header);
			header.y = -40;
			
			var lineH:int = headerTxt.y + headerTxt.height / 2;
			header.graphics.lineStyle(1, 0xffffff);
			header.graphics.moveTo(125, lineH);
			header.graphics.lineTo(headerTxt.x - 16, lineH);
			header.graphics.moveTo(headerTxt.x + headerTxt.width + 16, lineH);
			header.graphics.lineTo(stage.stageWidth - 125, lineH);

			content = new Sprite();
			addChild(content);
		}
		
		private function onRemove(e:Event):void {
			if(qtimer){qtimer.StopTimer();}
		}
		
		private function LoadPanel():void {
			var panel:QuizPanel = new QuizPanel(proxy.displayQuestions[loadIdx]);
			panel.addEventListener(QuizPanel.ALL_IMAGES_LOADED, onPanelLoaded);
			panel.LoadImages();
			quizPanels.push(panel);
		}
		
		private function onPanelLoaded(e:Event):void {
			if (loadIdx == proxy.displayQuestions.length - 1) {
				AppFacade.GetInstance().sendNotification(Events.QUESTIONS_IMAGES_LOADED);
			} else {
				loadIdx += 1;
				LoadPanel();
			}
		}
		
		public function ShowQuestion(qIdx:int):void {
			if (currentQuiz) {
				content.removeChild(currentQuiz);
				currentQuiz = null;
			}
			currentQuiz = quizPanels[qIdx];
			content.addChild(currentQuiz);
			content.x = stage.stageWidth / 2 - content.width / 2;
			content.y = 90;
			
			if (qtimer) {
				if( proxy.gameMode != QuestionProxy.GAME_MODE_TIME_ATTACH) { 
					qtimer.Reset(); 
				} else {
					qtimer.StartTimer();
				}
			}
			
			if (!commitBtn) {
				commitBtn = new CommitButton();
				commitBtn.addEventListener(CommitButton.COMMIT_PUSHED, onCommitClick);
				commitBtn.x = stage.stageWidth - commitBtn.width;
				commitBtn.y = stage.stageHeight / 2 - commitBtn.height / 2 + 50;
				addChild(commitBtn);
				
				var trgX:int = commitBtn.x;
				commitBtn.x += commitBtn.width;
				TweenLite.to(commitBtn, 0.7, { delay: 1, x: trgX } );
			}
			commitBtn.SetEnabled(true);
			
			var dif:int = quizConfig.difficulty;
			if(dif == QuestionProxy.DIF_EASY){
				infoText.text = "TYLKO JEDNA ODPOWIEDŹ JEST PRAWIDŁOWA.";
			} else if (dif == QuestionProxy.DIF_MEDIUM) {
				infoText.text = "TYLKO DWIE ODPOWIEDZI SĄ PRAWIDŁOWE.";
			} else {
				infoText.text = "TYLKO TRZY ODPOWIEDZI SĄ PRAWIDŁOWE.";
			}
			infoText.y = 45;
			infoText.x = stage.stageWidth / 2 - infoText.width / 2;
			infoText.alpha = 0.7;
		}
		
		public function onTimerOut(e:Event):void {
			if (proxy.gameMode == QuestionProxy.GAME_MODE_TIME_ATTACH) {
				AppFacade.GetInstance().sendNotification(Events.QUESTIONS_DONE);
			} else {
				onCommitClick(e); // in case timeout occured in any other mode - act normally.
			}
		}
		
		public function onCommitClick(e:Event):void {
			commitBtn.SetEnabled(false);
			if(qtimer) {qtimer.StopTimer(); }
			AppFacade.GetInstance().sendNotification(Events.QUESTION_RESULT);
		}
		
		public function onMenuClick(e:Event):void {
			(AppFacade.GetInstance().retrieveProxy(Sounds.NAME) as Sounds).EffectClick();
			AppFacade.GetInstance().sendNotification(Events.NAVI_SHOW_MENU, stage);
		}
	}

}