package Proxies {
	import Achievements.AchievementProxy;
	import Data.DifficultyLevel;
	import Data.MathQuestion;
	import flash.net.SharedObject;
	import Mediators.GameMediator;
	import org.puremvc.as3.interfaces.IProxy;
	import org.puremvc.as3.patterns.proxy.Proxy;
	
	/**
	 * ...
	 * @author Perzka
	 */
	public class GameProxy extends Proxy implements IProxy {
		public static var NAME:String = "QuestionsProxy";
		
		public static const LEVEL_HEIGHTS:Array = [0, 500, 1100, 1800];
		
		/**
		 * Score is displayed in freeplay mode.
		 */
		public var score:Number; 
		public var difLevel:DifficultyLevel;
		public var questionList:Vector.<MathQuestion>;
		public var currentQuestion:MathQuestion;
		public var gameMode:String;
		
		public var towerHeight:Number;
		
		public var correctAnsCount:int;
		public var totalAnsCount:int;
		
		public var sharedObj:SharedObject;
		public var achProxy:AchievementProxy;
		
		public function GameProxy() {
			Reset();
			sharedObj = SharedObject.getLocal("eduMultiply");
			
			if (sharedObj.data.totalAnsCount) {
				totalAnsCount = int(sharedObj.data.totalAnsCount);
			}			
		}
		
		override public function onRegister():void {
			super.onRegister();
			achProxy = facade.retrieveProxy(AchievementProxy.NAME) as AchievementProxy;
		}
		
		public function SetMode(isFreeplay:Boolean):void {
			if (isFreeplay) {
				gameMode = GameMediator.GAME_MODE_FREEPLAY;
			} else {
				gameMode = GameMediator.GAME_MODE_ARCADE;
			}
		}
		
		public function NextQuestion():void {	
			if (currentQuestion && currentQuestion.answerType == MathQuestion.ANSWER_CORRECT) {
				correctAnsCount++;
				totalAnsCount++;
				score += currentQuestion.result;
				sendNotification(Events.GAME_TOWER_HEIGHT_UPDATE, 0);
				
				if (correctAnsCount == 10) {
					achProxy.AddAchievement(1); // "Poprawnie wykonane 10 działań pod rząd"
				}
				if (correctAnsCount == 30) {
					achProxy.AddAchievement(2); // "Poprawnie wykonane 30 działań pod rząd"
				}
				sharedObj.data.totalAnsCount = totalAnsCount;
				if (totalAnsCount >= 50) {
					achProxy.AddAchievement(3); // "Poprawnie wykonane 50 działań (w sumie)"
				}
				if (totalAnsCount >= 100) {
					achProxy.AddAchievement(4); // "Poprawnie wykonane 100 działań (w sumie)"
				}
				
			} else {
				correctAnsCount = 0;
			}
			
			var q:MathQuestion = new MathQuestion(difLevel.multiplyFactorMin, difLevel.multiplyFactorMax, currentQuestion, difLevel.currentLevel);
			questionList.push(q);
			currentQuestion = q;
			
			AppFacade.GetInstance().sendNotification(Events.NEW_QUESTION, q);
		}
		
		public function GrowTower(amount:Number):void {
			towerHeight += amount;
			
			AppFacade.GetInstance().sendNotification(Events.GAME_TOWER_HEIGHT_UPDATE, int(towerHeight/10));
			
			Logger.Log("Tower grew to " + towerHeight);
			for (var i:int = 0; i < LEVEL_HEIGHTS.length; ++i) {
				if (LEVEL_HEIGHTS[i] <= towerHeight && i > difLevel.currentLevel - 1) {
					Logger.Log("Next Level! current " + difLevel.currentLevel);
					difLevel.NextLevel();
					
					AppFacade.GetInstance().sendNotification(Events.NEW_LEVEL, difLevel);
					
					if (difLevel.IsMaxLevel()) {
						achProxy.AddAchievement(7); // "Wybuduj kosmiczny budynek"
					}
					break;
				}
			}
			
			if (750 < towerHeight) {
				achProxy.AddAchievement(5); //"Zbudowana wieża na 75 metrów"
			}
			if (1500 < towerHeight) {
				achProxy.AddAchievement(6); // "Zbudowana wieża na 150 metrów"
			}
		}
		
		public function Reset():void {
			questionList = new Vector.<MathQuestion>();
			currentQuestion = null;
			towerHeight = 0;
			score = 0;
			correctAnsCount = 0;
			
			difLevel = new DifficultyLevel(gameMode);
			if (gameMode == "freeplay") {
				sendNotification(Events.GAME_NEW_FREEPLAY);
			} else {
				sendNotification(Events.GAME_NEW_ARCADE);
			}
		}
		
		override public function getProxyName():String {
			return NAME;
		}
	}
}