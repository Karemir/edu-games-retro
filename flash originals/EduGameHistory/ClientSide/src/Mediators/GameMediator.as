package Mediators {
	import com.greensock.TweenLite;
	import flash.display.Stage;
	import flash.utils.setTimeout;
	import org.puremvc.as3.interfaces.IMediator;
	import org.puremvc.as3.interfaces.INotification;
	import org.puremvc.as3.patterns.mediator.Mediator;
	import Proxies.HighscoreProxy;
	import Proxies.QuestionProxy;
	import Proxies.QuizConfigProxy;
	import Proxies.Sounds;
	import Visuals.GameView;
	import Visuals.LoadView;
	import Visuals.QuizResultView;
	import Visuals.SplashView;
	
	/**
	 * ...
	 * @author Perz
	 */
	public class GameMediator extends Mediator implements IMediator {
		public static const NAME:String = "GameMediator";
		
		public var loadview:LoadView;
		public var gameview:GameView;
		public var resultview:QuizResultView;
		
		public var highscoreProxy:HighscoreProxy;
		public var questionProxy:QuestionProxy;
		public var quizConf:QuizConfigProxy;
		public var sounds:Sounds;
		public var isLoading:Boolean;
		
		public var currentQuestion:int;
		private var scoreAccumulator:Number;
		
		public function GameMediator(stageItem:Object) {
			super(NAME, stageItem);
			loadview = new LoadView();
			stage.addChild(loadview);
		}
		
		override public function onRegister():void {
			super.onRegister();
			questionProxy = facade.retrieveProxy(QuestionProxy.NAME) as QuestionProxy;
			quizConf = facade.retrieveProxy(QuizConfigProxy.NAME) as QuizConfigProxy;
			highscoreProxy = facade.retrieveProxy(HighscoreProxy.NAME) as HighscoreProxy;
			sounds = facade.retrieveProxy(Sounds.NAME) as Sounds;
			isLoading = true;

			questionProxy.LoadQuestions(quizConf.difficulty, quizConf.epoch, quizConf.gameMode);
		}
		
		override public function onRemove():void {
			super.onRemove();
			
			stage.removeChild(loadview);
			if (gameview) {
				stage.removeChild(gameview);
			}
			if (resultview) {
				stage.removeChild(resultview);
			}
		}
		
		override public function listNotificationInterests():Array {
			return [
				Events.QUESTIONS_ERROR,
				Events.QUESTIONS_PREPARE_BEGIN,
				Events.QUESTIONS_PREPARED,
				Events.QUESTIONS_IMAGES_LOADED,
				Events.QUESTION_NEXT,
				Events.QUESTION_RESULT,
				Events.QUESTIONS_DONE
			];
		}
		
		override public function handleNotification(notif:INotification):void {
			trace(notif.getName());
			switch (notif.getName()) {
				case Events.QUESTIONS_ERROR:
					loadview.SetMessage("Wystąpił błąd. " + notif.getBody());
					loadview.AllowMenu();
					break;
				case Events.QUESTIONS_PREPARE_BEGIN:
					loadview.SetMessage("WCZYTUJĘ PYTANIA");
					break;
				case Events.QUESTIONS_PREPARED:
					loadview.SetMessage("WCZYTUJĘ OBRAZY");
					gameview = new GameView(questionProxy);
					stage.addChildAt(gameview, 0);
					break;
				case Events.QUESTIONS_IMAGES_LOADED:
					TweenLite.to(loadview, 0.5, { autoAlpha:0 } );
					currentQuestion = 0;
					scoreAccumulator = 0;
					ShowNextQuestion();
					break;
				case Events.QUESTION_NEXT:
					currentQuestion++;
					if(currentQuestion < questionProxy.displayQuestions.length){
						ShowNextQuestion();
					} else {
						ShowQuizResult();
					}
					break;
				case Events.QUESTIONS_DONE:
					ShowQuizResult();
					break;
				case Events.QUESTION_RESULT:
					var roundScore:Number = gameview.currentQuiz.CheckAnswersAndScore();
					if(quizConf.gameMode == QuestionProxy.GAME_MODE_NORMAL || roundScore == 1){
						scoreAccumulator += roundScore;
					}
					
					// play sounds
					if (roundScore == 1) {
						sounds.EffectCorrect();
					} else {
						sounds.EffectError();
					}
					
					var timeToShowAnswers:int = 3000;
					if (quizConf.gameMode == QuestionProxy.GAME_MODE_TIME_ATTACH) {
						timeToShowAnswers = 50;
					}
					
					setTimeout(function():void {
						if (quizConf.gameMode == QuestionProxy.GAME_MODE_NORMAL ||
								quizConf.gameMode == QuestionProxy.GAME_MODE_TIME_ATTACH || 
								roundScore == 1) {
							AppFacade.GetInstance().sendNotification(Events.QUESTION_NEXT);
						} else {
							ShowQuizResult();
						}
					}, 3000);
					break;
				default: 
					Logger.Log("Unknown notification");
					return;
			}
		}
		
		public function ShowNextQuestion():void {
			gameview.ShowQuestion(currentQuestion);
		}
		
		public function ShowQuizResult():void {
			var finalScore:Number = scoreAccumulator / questionProxy.displayQuestions.length;
			resultview = new QuizResultView(finalScore);
			if (gameview) {
				stage.removeChild(gameview);
				gameview = null;
			}
			stage.addChild(resultview);
			
			// store score if highscore. dif + mode is always 0-5 value.
			var highscore:Number = highscoreProxy.GetHighscore(questionProxy.currentEpochId, questionProxy.currentDif + questionProxy.gameMode);
			if (highscore < finalScore) {
				highscoreProxy.PushHighscore(questionProxy.currentEpochId, questionProxy.currentDif + questionProxy.gameMode, finalScore);
			}
		}
		
		public function get stage():Stage {
			return viewComponent as Stage;
		}
	}
}