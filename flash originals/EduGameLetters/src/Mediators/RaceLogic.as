package Mediators {
	import Achievements.AchievementProxy;
	import com.greensock.TweenLite;
	import flash.display.Stage;
	import flash.events.Event;
	import flash.events.TimerEvent;
	import flash.net.SharedObject;
	import flash.utils.setTimeout;
	import flash.utils.Timer;
	import org.puremvc.as3.interfaces.IMediator;
	import org.puremvc.as3.interfaces.INotification;
	import org.puremvc.as3.patterns.mediator.Mediator;
	import org.puremvc.as3.patterns.observer.Notification;
	import Proxies.Data.VehicleData;
	import Proxies.GameData;
	import Proxies.RaceData;
	import Proxies.Sounds;
	import Proxies.Words;
	import Visuals.RaceScreen;
	
	/**
	 * ...
	 * @author Perzka Michalowy
	 */
	public class RaceLogic extends Mediator implements IMediator {
		public static const VEH_SPEED:Number = 30;
		public static const BOOST_TIME:Number = 1.2;
		public static const BOOST_VALUE:Number = 3.5;
		public static const BOOST_VALUE_SPREAD:Number = 0.8;
		public static const BOOST_TIME_SPREAD:Number = 0.5;
		public static const AI_FIRST_BOOST:Number = 5000;
		public static const AI_BOOST_MIN_INTERVAL:Number = 5500;
		public static const AI_BOOST_SPREAD:Number = 7000;
		
		public static const NAME:String = "RaceLogic";
		
		public var sounds:Sounds;
		public var words:Words;
		public var raceData:RaceData;
		public var gameData:GameData;
		public var raceWords:Array;
		
		public var raceScreen:RaceScreen;
		
		private var gameTotalTime:Number;
		private var lastFrameStarted:Number;
		private var updateNotification:Notification;
		private var currentResultForWin:int;
		private var playerIdx:int;
		private var playerFinished:Boolean;
		private var playerStarted:Boolean;
		
		private var textErrorCounter:int = 0;
		private var currentText:String;
		private var currentLetter:int;
		
		private var achProxy:AchievementProxy;
		private var totalCorrectWords:int = 0;
		private var goodWordsStreak:int = 0;
		private var raceWinStreak:int = 0;
		private var sharedObj:SharedObject;
		
		public function RaceLogic(stageItem:Object) {
			super(NAME, stageItem);
			sharedObj = SharedObject.getLocal("eduMultiply");
			if (sharedObj.data.totalCorrectWords) {
				totalCorrectWords = int(sharedObj.data.totalCorrectWords);
				raceWinStreak = int(sharedObj.data.raceWinStreak);
			}
			
			updateNotification = new Notification(Events.GAME_UPDATE_EVENT);
		}
		
		override public function onRegister():void {
			Logger.Log("Game logic registered");
			
			raceData = facade.retrieveProxy(RaceData.NAME) as RaceData;
			gameData = facade.retrieveProxy(GameData.NAME) as GameData;
			words = facade.retrieveProxy(Words.NAME) as Words;
			sounds = facade.retrieveProxy(Sounds.NAME) as Sounds;
			achProxy = facade.retrieveProxy(AchievementProxy.NAME) as AchievementProxy;
			
			playerStarted = false;
			InitiateRace();
			sounds.StopMusic();
		}
		
		override public function onRemove():void {
			Logger.Log("Game logic removed");
			sounds.PlayMusic();
			if (raceScreen) {
				stage.removeChild(raceScreen);
				raceScreen = null;
				
				stage.removeEventListener(Event.ENTER_FRAME, onFrame);
			}
		}
		
		override public function listNotificationInterests():Array {
			return [Events.KEY_PRESS, Events.GAME_UPDATE_EVENT, Events.GAME_END_VISUAL_RACE];
		}
		
		override public function handleNotification(notification:INotification):void {
			var noteName:String = notification.getName();
			var body:Object = notification.getBody();
			
			switch (noteName) {
				case Events.GAME_UPDATE_EVENT: 
					UpdateGame(body as Number);
					break;
				case Events.KEY_PRESS: 
					playerStarted = true;
					if (currentText && currentLetter < currentText.length) {
						var pressedLetter:String = String.fromCharCode(body).toLowerCase();
						var curLetter:String = currentText.substr(currentLetter, 1);
						if (pressedLetter == curLetter) {
							raceScreen.LetterDone();
							currentLetter++;
							
							if (currentLetter == currentText.length) {
								raceData.racers[playerIdx].Boost();
								HideVisualText();
								sounds.EffectBoost();
								
								goodWordsStreak++;
								totalCorrectWords++;
								sharedObj.data.totalCorrectWords = totalCorrectWords;
								
								if (goodWordsStreak >= 5) {
									achProxy.AddAchievement(8); // "5 poprawnie zapisanych słów pod rząd"
								}
								if (goodWordsStreak >= 10) {
									achProxy.AddAchievement(9); // "10 poprawnie zapisanych słów pod rząd"
								}
								
								if (totalCorrectWords >= 50) {
									achProxy.AddAchievement(10); // "50 poprawnie zapisanych słów (w sumie)"
								}
								if (totalCorrectWords >= 100) {
									achProxy.AddAchievement(11); // "100 poprawnie zapisanych słów (w sumie)"
								}
							} else {
								sounds.EffectKeypress(); // correct letter but not the last
							}
						} else {
							textErrorCounter++;
							goodWordsStreak = 0;
							
							sounds.EffectError(); // bad letter
							if (textErrorCounter >= 2) {
								textErrorCounter = 0;
								setTimeout(words.PlaySound, 120, currentText);
							}
						}
					}
					break;
				case Events.GAME_END_VISUAL_RACE: 
					var timer:Timer = new Timer(1, 1);
					var tmp:RaceLogic = this;
					timer.addEventListener(TimerEvent.TIMER, function():void {
							SetScores();
							facade.sendNotification(Events.GAME_CYCLE_SCREENS, tmp);
						});
					timer.start();
					break;
			}
		}
		
		private function SetScores():void {
			playerIdx = raceData.GetPlayerIndex();
			var pos:int = raceData.racers[playerIdx].result;
			gameData.tournamentResults[gameData.currentTournament][raceData.trackType] = GameData.SCORING[pos];
			
			var results:Array = gameData.tournamentResults[gameData.currentTournament];
			if (results[0] == GameData.SCORING[0] && results[1] == GameData.SCORING[0] && results[2] == GameData.SCORING[0] && results[3] == GameData.SCORING[0]) {
				gameData.tournamentStatuses[gameData.currentTournament] = GameData.TOURNAMENT_WON;
				if (gameData.currentTournament < gameData.tournamentStatuses.length - 1) {
					gameData.tournamentStatuses[gameData.currentTournament + 1] = GameData.TOURNAMENT_AVAILABLE;
				}
			}
			
			// count won races, and apply achievement
			var winCount:int = 0;
			for each(var tourId:int in gameData.tournamentResults) {
				for each (var rId:int in gameData.tournamentResults[tourId]) {
					if (gameData.tournamentResults[tourId][rId] == GameData.SCORING[0]) {
						winCount++;
					}
				}
			}
			if (winCount >= 25) {
				achProxy.AddAchievement(14); // wygrana w sumie w 25 wyścigach
			}
		}
		
		public function get stage():Stage {
			return viewComponent as Stage;
		}
		
		private function InitiateRace():void {
			raceScreen = new RaceScreen(raceData, stage.stageWidth, stage.stageHeight);
			stage.addChild(raceScreen);
			stage.focus = raceScreen;
			
			playerFinished = false;
			playerIdx = raceData.GetPlayerIndex();
			if (playerIdx < 0) {
				throw new Error("no player");
			}
			
			for (var i:int = 0; i < raceData.racers.length; ++i) {
				raceData.racers[i].result = -1;
				raceData.racers[i].ResetAI();
			}
			
			raceWords = words.GetWords(gameData.currentTournament + 3);
			
			playerStarted = false;
			gameTotalTime = 0;
			currentResultForWin = 0;
			lastFrameStarted = new Date().time;
			stage.addEventListener(Event.ENTER_FRAME, onFrame);
		}
		
		private function onFrame(e:Event):void {
			var now:Date = new Date();
			var dif:Number = (now.time - lastFrameStarted) / 1000;
			lastFrameStarted = now.time;
			updateNotification.setBody(dif);
			
			facade.notifyObservers(updateNotification);
		}
		
		private function UpdateGame(delta:Number):void {
			// if player finished, make game faster
			if (playerFinished) {
				delta *= 10;
			}
			gameTotalTime += delta;
			
			if (!currentText && gameTotalTime > 0.5 && !playerFinished) {
				var idx:int = int(Math.random() * raceWords.length);
				var nextWord:String = raceWords[idx];
				raceWords.splice(idx, 1);
				
				raceScreen.SetText(nextWord);
				words.PlaySound(nextWord);
				
				textErrorCounter = 0;
				currentText = nextWord;
				currentLetter = 0;
			}
			
			if (playerStarted) {
				for (var i:int = 0; i < raceData.racers.length; ++i) {
					var vehicle:VehicleData = raceData.racers[i];
					
					// if vehicle is at end ignore it.
					if (vehicle.result >= 0) {
						continue;
					}
					
					// acceleration and speed
					vehicle.SetVelocity(VEH_SPEED);
					vehicle.rt_position += vehicle.rt_velocity * delta;
					
					vehicle.ProcessAI();
					
					if (vehicle.rt_position + raceScreen.vehicles[i].width > raceScreen.raceLength) {
						vehicle.rt_position = raceScreen.raceLength - raceScreen.vehicles[i].width;
						vehicle.result = currentResultForWin++;
						
						if (currentResultForWin == 4) {
							Logger.Log("End race");
						}
						
						if (i == playerIdx) {
							playerFinished = true;
							HideVisualText();
							raceScreen.ShowRaceEnd(vehicle.result);
							sounds.EffectEnd();
							Logger.Log("player finished");
							
							if (vehicle.result == 0) {
								raceWinStreak++;
							} else {
								raceWinStreak = 0;
							}
							sharedObj.data.raceWinStreak = raceWinStreak;
							
							if (raceWinStreak >= 5) {
								achProxy.AddAchievement(12); // wygrana w 5 wyścigach pod rząd
							}
							if (raceWinStreak >= 10) {
								achProxy.AddAchievement(13); // wygrana w 10 wyścigach pod rząd
							}
						}
					}
				}
			}
			raceScreen.Update();
		}
		
		private function HideVisualText():void {
			TweenLite.to(raceScreen.displayedText, 0.5, {alpha: 0, onComplete: function():void {
					currentText = null;
				}});
		}
	}

}