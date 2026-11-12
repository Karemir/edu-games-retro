import { AchievementProxy } from "@edugames/achievements/Achievements/AchievementProxy.js";
import { TweenLite } from "@edugames/common/com/greensock/TweenLite.js";
import type { Stage } from "@edugames/common/flash/display/Stage.js";
import { Event } from "@edugames/common/flash/events/Event.js";
import { TimerEvent } from "@edugames/common/flash/events/TimerEvent.js";
import { SharedObject } from "@edugames/common/flash/net/SharedObject.js";
import { setTimeout } from "@edugames/common/flash/utils/setTimeout.js";
import { Timer } from "@edugames/common/flash/utils/Timer.js";
import type { IMediator } from "@edugames/common/org/puremvc/as3/interfaces/IMediator.js";
import type { INotification } from "@edugames/common/org/puremvc/as3/interfaces/INotification.js";
import { Mediator } from "@edugames/common/org/puremvc/as3/patterns/mediator/Mediator.js";
import { Notification } from "@edugames/common/org/puremvc/as3/patterns/observer/Notification.js";
import { Events } from "../Events.js";
import { Logger } from "../Logger.js";
import { VehicleData } from "../Proxies/Data/VehicleData.js";
import { GameData } from "../Proxies/GameData.js";
import { RaceData } from "../Proxies/RaceData.js";
import { Sounds } from "../Proxies/Sounds.js";
import { Words } from "../Proxies/Words.js";
import { RaceScreen } from "../Visuals/RaceScreen.js";

/**
 * ...
 * @author Perzka Michalowy
 */
export class RaceLogic extends Mediator implements IMediator {
	public static readonly VEH_SPEED: number = 30;
	public static readonly BOOST_TIME: number = 1.2;
	public static readonly BOOST_VALUE: number = 3.5;
	public static readonly BOOST_VALUE_SPREAD: number = 0.8;
	public static readonly BOOST_TIME_SPREAD: number = 0.5;
	public static readonly AI_FIRST_BOOST: number = 5000;
	public static readonly AI_BOOST_MIN_INTERVAL: number = 5500;
	public static readonly AI_BOOST_SPREAD: number = 7000;
	
	public static readonly NAME: string = "RaceLogic";
	
	public sounds: Sounds;
	public words: Words;
	public raceData: RaceData;
	public gameData: GameData;
	public raceWords: any[];
	
	public raceScreen: RaceScreen;
	
	private gameTotalTime: number = NaN; // PORT: Number default
	private lastFrameStarted: number = NaN; // PORT: Number default
	private updateNotification: Notification;
	private currentResultForWin: number = 0; // PORT: int default
	private playerIdx: number = 0; // PORT: int default
	private playerFinished: boolean = false; // PORT: Boolean default
	private playerStarted: boolean = false; // PORT: Boolean default
	
	private textErrorCounter: number = 0;
	private currentText: string;
	private currentLetter: number = 0; // PORT: int default
	
	private achProxy: AchievementProxy;
	private totalCorrectWords: number = 0;
	private goodWordsStreak: number = 0;
	private raceWinStreak: number = 0;
	private sharedObj: SharedObject;
	
	constructor(stageItem: Object) {
		super(RaceLogic.NAME, stageItem);
		this.sharedObj = SharedObject.getLocal("eduMultiply");
		if (this.sharedObj.data.totalCorrectWords) {
			this.totalCorrectWords = (Number(this.sharedObj.data.totalCorrectWords) | 0);
			this.raceWinStreak = (Number(this.sharedObj.data.raceWinStreak) | 0);
		}
		
		this.updateNotification = new Notification(Events.GAME_UPDATE_EVENT);
	}
	
	public onRegister(): void {
		Logger.Log("Game logic registered");
		
		this.raceData = this.facade.retrieveProxy(RaceData.NAME) as RaceData;
		this.gameData = this.facade.retrieveProxy(GameData.NAME) as GameData;
		this.words = this.facade.retrieveProxy(Words.NAME) as Words;
		this.sounds = this.facade.retrieveProxy(Sounds.NAME) as Sounds;
		this.achProxy = this.facade.retrieveProxy(AchievementProxy.NAME) as AchievementProxy;
		
		this.playerStarted = false;
		this.InitiateRace();
		this.sounds.StopMusic();
	}
	
	public onRemove(): void {
		Logger.Log("Game logic removed");
		this.sounds.PlayMusic();
		if (this.raceScreen) {
			this.stage.removeChild(this.raceScreen);
			this.raceScreen = null;
			
			this.stage.removeEventListener(Event.ENTER_FRAME, this.onFrame);
		}
	}
	
	public listNotificationInterests(): Array<any> {
		return [Events.KEY_PRESS, Events.GAME_UPDATE_EVENT, Events.GAME_END_VISUAL_RACE];
	}
	
	public handleNotification(notification: INotification): void {
		var noteName: string = notification.getName();
		var body: Object = notification.getBody();
		
		switch (noteName) {
			case Events.GAME_UPDATE_EVENT: 
				this.UpdateGame(body as number);
				break;
			case Events.KEY_PRESS: 
				this.playerStarted = true;
				if (this.currentText && this.currentLetter < this.currentText.length) {
					var pressedLetter: string = String.fromCharCode(body as any).toLowerCase();
					var curLetter: string = this.currentText.substr(this.currentLetter, 1);
					if (pressedLetter == curLetter) {
						this.raceScreen.LetterDone();
						this.currentLetter++;
						
						if (this.currentLetter == this.currentText.length) {
							this.raceData.racers[this.playerIdx].Boost();
							this.HideVisualText();
							this.sounds.EffectBoost();
							
							this.goodWordsStreak++;
							this.totalCorrectWords++;
							this.sharedObj.data.totalCorrectWords = this.totalCorrectWords;
							
							if (this.goodWordsStreak >= 5) {
								this.achProxy.AddAchievement(8); // "5 poprawnie zapisanych słów pod rząd"
							}
							if (this.goodWordsStreak >= 10) {
								this.achProxy.AddAchievement(9); // "10 poprawnie zapisanych słów pod rząd"
							}
							
							if (this.totalCorrectWords >= 50) {
								this.achProxy.AddAchievement(10); // "50 poprawnie zapisanych słów (w sumie)"
							}
							if (this.totalCorrectWords >= 100) {
								this.achProxy.AddAchievement(11); // "100 poprawnie zapisanych słów (w sumie)"
							}
						} else {
							this.sounds.EffectKeypress(); // correct letter but not the last
						}
					} else {
						this.textErrorCounter++;
						this.goodWordsStreak = 0;
						
						this.sounds.EffectError(); // bad letter
						if (this.textErrorCounter >= 2) {
							this.textErrorCounter = 0;
							setTimeout(this.words.PlaySound, 120, this.currentText);
						}
					}
				}
				break;
			case Events.GAME_END_VISUAL_RACE: 
				var timer: Timer = new Timer(1, 1);
				var tmp: RaceLogic = this;
				timer.addEventListener(TimerEvent.TIMER, () => { // PORT: arrow function, the closure uses members
						this.SetScores();
						this.facade.sendNotification(Events.GAME_CYCLE_SCREENS, tmp);
					});
				timer.start();
				break;
		}
	}
	
	private SetScores(): void {
		this.playerIdx = this.raceData.GetPlayerIndex();
		var pos: number = this.raceData.racers[this.playerIdx].result;
		this.gameData.tournamentResults[this.gameData.currentTournament][this.raceData.trackType] = GameData.SCORING[pos];
		
		var results: any[] = this.gameData.tournamentResults[this.gameData.currentTournament];
		if (results[0] == GameData.SCORING[0] && results[1] == GameData.SCORING[0] && results[2] == GameData.SCORING[0] && results[3] == GameData.SCORING[0]) {
			this.gameData.tournamentStatuses[this.gameData.currentTournament] = GameData.TOURNAMENT_WON;
			if (this.gameData.currentTournament < this.gameData.tournamentStatuses.length - 1) {
				this.gameData.tournamentStatuses[this.gameData.currentTournament + 1] = GameData.TOURNAMENT_AVAILABLE;
			}
		}
		
		// count won races, and apply achievement
		var winCount: number = 0;
		// PORT: `for each (var x:int in ...)` iterates the values and coerces each to int; `| 0` emulates that coercion (the original indexes with it, oddities kept)
		for (const tourIdValue of this.gameData.tournamentResults) {
			var tourId: number = (tourIdValue as any) | 0;
			for (const rIdValue of this.gameData.tournamentResults[tourId]) {
				var rId: number = (rIdValue as any) | 0;
				if (this.gameData.tournamentResults[tourId][rId] == GameData.SCORING[0]) {
					winCount++;
				}
			}
		}
		if (winCount >= 25) {
			this.achProxy.AddAchievement(14); // wygrana w sumie w 25 wyścigach
		}
	}
	
	public get stage(): Stage {
		return this.viewComponent as Stage;
	}
	
	private InitiateRace(): void {
		this.raceScreen = new RaceScreen(this.raceData, this.stage.stageWidth, this.stage.stageHeight);
		this.stage.addChild(this.raceScreen);
		this.stage.focus = this.raceScreen;
		
		this.playerFinished = false;
		this.playerIdx = this.raceData.GetPlayerIndex();
		if (this.playerIdx < 0) {
			throw new Error("no player");
		}
		
		for (var i: number = 0; i < this.raceData.racers.length; ++i) {
			this.raceData.racers[i].result = -1;
			this.raceData.racers[i].ResetAI();
		}
		
		this.raceWords = this.words.GetWords(this.gameData.currentTournament + 3);
		
		this.playerStarted = false;
		this.gameTotalTime = 0;
		this.currentResultForWin = 0;
		this.lastFrameStarted = new Date().getTime(); // PORT: Date.time -> getTime()
		this.stage.addEventListener(Event.ENTER_FRAME, this.onFrame);
	}
	
	private onFrame(e: Event): void {
		var now: Date = new Date();
		var dif: number = (now.getTime() - this.lastFrameStarted) / 1000; // PORT: Date.time -> getTime()
		this.lastFrameStarted = now.getTime();
		this.updateNotification.setBody(dif);
		
		this.facade.notifyObservers(this.updateNotification);
	}
	
	private UpdateGame(delta: number): void {
		// if player finished, make game faster
		if (this.playerFinished) {
			delta *= 10;
		}
		this.gameTotalTime += delta;
		
		if (!this.currentText && this.gameTotalTime > 0.5 && !this.playerFinished) {
			var idx: number = (Math.random() * this.raceWords.length) | 0;
			var nextWord: string = this.raceWords[idx];
			this.raceWords.splice(idx, 1);
			
			this.raceScreen.SetText(nextWord);
			this.words.PlaySound(nextWord);
			
			this.textErrorCounter = 0;
			this.currentText = nextWord;
			this.currentLetter = 0;
		}
		
		if (this.playerStarted) {
			for (var i: number = 0; i < this.raceData.racers.length; ++i) {
				var vehicle: VehicleData = this.raceData.racers[i];
				
				// if vehicle is at end ignore it.
				if (vehicle.result >= 0) {
					continue;
				}
				
				// acceleration and speed
				vehicle.SetVelocity(RaceLogic.VEH_SPEED);
				vehicle.rt_position += vehicle.rt_velocity * delta;
				
				vehicle.ProcessAI();
				
				if (vehicle.rt_position + this.raceScreen.vehicles[i].width > this.raceScreen.raceLength) {
					vehicle.rt_position = this.raceScreen.raceLength - this.raceScreen.vehicles[i].width;
					vehicle.result = this.currentResultForWin++;
					
					if (this.currentResultForWin == 4) {
						Logger.Log("End race");
					}
					
					if (i == this.playerIdx) {
						this.playerFinished = true;
						this.HideVisualText();
						this.raceScreen.ShowRaceEnd(vehicle.result);
						this.sounds.EffectEnd();
						Logger.Log("player finished");
						
						if (vehicle.result == 0) {
							this.raceWinStreak++;
						} else {
							this.raceWinStreak = 0;
						}
						this.sharedObj.data.raceWinStreak = this.raceWinStreak;
						
						if (this.raceWinStreak >= 5) {
							this.achProxy.AddAchievement(12); // wygrana w 5 wyścigach pod rząd
						}
						if (this.raceWinStreak >= 10) {
							this.achProxy.AddAchievement(13); // wygrana w 10 wyścigach pod rząd
						}
					}
				}
			}
		}
		this.raceScreen.Update();
	}
	
	private HideVisualText(): void {
		TweenLite.to(this.raceScreen.displayedText, 0.5, {alpha: 0, onComplete: () => { // PORT: arrow function, the closure uses members
				this.currentText = null;
			}});
	}
}
