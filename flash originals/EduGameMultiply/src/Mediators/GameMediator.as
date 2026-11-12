package Mediators {
	import Data.DifficultyLevel;
	import Data.MathQuestion;
	import flash.display.Stage;
	import flash.events.Event;
	import flash.events.KeyboardEvent;
	import flash.ui.Keyboard;
	import org.puremvc.as3.interfaces.IMediator;
	import org.puremvc.as3.interfaces.INotification;
	import org.puremvc.as3.patterns.mediator.Mediator;
	import Proxies.GameProxy;
	import Proxies.GameTimer;
	import Proxies.Sounds;
	
	/**
	 * ...
	 * @author Perz
	 */
	public class GameMediator extends Mediator implements IMediator {
		public static const NAME:String = "GameMediator";
		public static const GAME_MODE_ARCADE:String = "arcade";
		public static const GAME_MODE_FREEPLAY:String = "freeplay";
		
		public var gameView:GameView;
		public var gameProxy:GameProxy;
		public var gameTimer:GameTimer;
		public var soundProxy:Sounds;
		public var gameMode:String;
		public var gameEnded:Boolean;
		
		public function GameMediator(stageItem:Object, mode:String) {
			super(NAME, stageItem);
			
			gameView = new GameView();
			
			Logger.Log("Game: " + mode);
			gameMode = mode;
		}
		
		override public function onRegister():void {
			super.onRegister();
			
			gameProxy = facade.retrieveProxy(GameProxy.NAME) as GameProxy;
			gameProxy.Reset();
			
			gameTimer = facade.retrieveProxy(GameTimer.NAME) as GameTimer;
			gameTimer.Reset(GameTimer.GAME_ARCADE_TIME);
			
			soundProxy = facade.retrieveProxy(Sounds.NAME) as Sounds;
			
			stage.addChild(gameView);
			
			// register sub mediators
			facade.registerMediator(new TowerSubMediator(gameView.towerPanel));
			facade.registerMediator(new MathSubMediator(gameView.questionPanel));
			
			gameProxy.gameMode = gameMode;
			StartGame();
			
			stage.addEventListener(KeyboardEvent.KEY_DOWN, OnKey);
			stage.focus = gameView;
		}
		
		public function StartGame():void {
			gameEnded = false;
			gameProxy.Reset();
			gameProxy.NextQuestion();
			if (gameMode == GAME_MODE_ARCADE) {
				gameTimer.Reset(GameTimer.GAME_ARCADE_TIME);
			} else {
				gameTimer.Reset(GameTimer.GAME_FREEPLAY_TIME);
			}
			//gameTimer.Start();
		}
		
		override public function onRemove():void {
			super.onRemove();
			
			stage.removeChild(gameView);
			
			facade.removeMediator(MathSubMediator.NAME);
			facade.removeMediator(TowerSubMediator.NAME);
			
			stage.removeEventListener(KeyboardEvent.KEY_DOWN, OnKey);
		}
		
		override public function listNotificationInterests():Array {
			return [Events.ANSWER_BAD, Events.ANSWER_OK, Events.ANSWER_SURRENDER, Events.CREATE_NEW_QUESTION, Events.NEW_QUESTION, Events.NEW_LEVEL, Events.GAME_NUM_BACK, Events.GAME_NUM_DONE, Events.GAME_NUM_ENTERED, Events.GAME_TIMER_TIME_ENDED,];
		}
		
		override public function handleNotification(notification:INotification):void {
			var name:String = notification.getName();
			var body:Object = notification.getBody();
			
			// end game condition - if time is up, no events are handled by the game
			if (gameEnded) {
				return;
			}
			
			switch (name) {
				case Events.CREATE_NEW_QUESTION: 
					gameProxy.NextQuestion();
					break;
				case Events.ANSWER_SURRENDER: 
					(body as MathQuestion).answerType = MathQuestion.ANSWER_BAD;
					soundProxy.EffectError();
					gameProxy.NextQuestion();
					break;
				case Events.GAME_NUM_ENTERED: 
					gameProxy.currentQuestion.AnswerAddDigit(body as String);
					break;
				case Events.GAME_NUM_DONE: 
					if (gameProxy.currentQuestion.CheckUserAnswer()) {
						facade.sendNotification(Events.ANSWER_OK, gameProxy.currentQuestion);
					} else {
						soundProxy.EffectError();
						facade.sendNotification(Events.ANSWER_BAD, gameProxy.currentQuestion);
					}
					break;
				case Events.GAME_NUM_BACK: 
					gameProxy.currentQuestion.RemoveLastDigit();
					break;
				case Events.NEW_LEVEL:  
					{
						var diflvl:DifficultyLevel = body as DifficultyLevel;
						gameTimer.AddTime(DifficultyLevel.LEVEL_TIME_BONUS[diflvl.currentLevel - 1]);
					}
					break;
				case Events.GAME_TIMER_TIME_ENDED: 
					gameEnded = true;
					break;
			}
		}
		
		public function OnKey(e:KeyboardEvent):void {
			if (e.keyCode == Keyboard.ENTER) {
				soundProxy.EffectKeypress();
				sendNotification(Events.GAME_NUM_DONE);
				
			} else if (e.keyCode == Keyboard.BACKSPACE) {
				soundProxy.EffectKeypress();
				sendNotification(Events.GAME_NUM_BACK);
				
			} else if (e.keyCode >= Keyboard.NUMBER_0 && e.keyCode <= Keyboard.NUMBER_9) {
				if (!gameTimer.isRunning && !gameEnded) {
					gameTimer.Start();
				}
				var pressedChar:String = String.fromCharCode(e.charCode);
				soundProxy.EffectKeypress();
				sendNotification(Events.GAME_NUM_ENTERED, pressedChar);
			} else if (e.keyCode == Keyboard.ESCAPE) {
				soundProxy.EffectClick();
				sendNotification(Events.NAVIGATION_MENU, stage);
			}
		}
		
		public function get stage():Stage {
			return viewComponent as Stage;
		}
	}
}