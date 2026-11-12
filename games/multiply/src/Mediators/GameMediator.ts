import type { Stage } from "@edugames/common/flash/display/Stage.js";
import { KeyboardEvent } from "@edugames/common/flash/events/KeyboardEvent.js";
import { Keyboard } from "@edugames/common/flash/ui/Keyboard.js";
import type { IMediator } from "@edugames/common/org/puremvc/as3/interfaces/IMediator.js";
import type { INotification } from "@edugames/common/org/puremvc/as3/interfaces/INotification.js";
import { Mediator } from "@edugames/common/org/puremvc/as3/patterns/mediator/Mediator.js";
import { DifficultyLevel } from "../Data/DifficultyLevel.js";
import { MathQuestion } from "../Data/MathQuestion.js";
import { Events } from "../Events.js";
import { GameView } from "../GameView.js";
import { Logger } from "../Logger.js";
import { GameProxy } from "../Proxies/GameProxy.js";
import { GameTimer } from "../Proxies/GameTimer.js";
import { Sounds } from "../Proxies/Sounds.js";
import { MathSubMediator } from "./MathSubMediator.js";
import { TowerSubMediator } from "./TowerSubMediator.js";

/**
 * ...
 * @author Perz
 */
export class GameMediator extends Mediator implements IMediator {
	public static readonly NAME: string = "GameMediator";
	public static readonly GAME_MODE_ARCADE: string = "arcade";
	public static readonly GAME_MODE_FREEPLAY: string = "freeplay";
	
	public gameView: GameView;
	public gameProxy: GameProxy;
	public gameTimer: GameTimer;
	public soundProxy: Sounds;
	public gameMode: string;
	public gameEnded: boolean = false; // PORT: AS3 Boolean defaults to false
	
	constructor(stageItem: Object, mode: string) {
		super(GameMediator.NAME, stageItem);
		
		this.gameView = new GameView();
		
		Logger.Log("Game: " + mode);
		this.gameMode = mode;
	}
	
	public onRegister(): void {
		super.onRegister();
		
		this.gameProxy = this.facade.retrieveProxy(GameProxy.NAME) as GameProxy;
		this.gameProxy.Reset();
		
		this.gameTimer = this.facade.retrieveProxy(GameTimer.NAME) as GameTimer;
		this.gameTimer.Reset(GameTimer.GAME_ARCADE_TIME);
		
		this.soundProxy = this.facade.retrieveProxy(Sounds.NAME) as Sounds;
		
		this.stage.addChild(this.gameView);
		
		// register sub mediators
		this.facade.registerMediator(new TowerSubMediator(this.gameView.towerPanel));
		this.facade.registerMediator(new MathSubMediator(this.gameView.questionPanel));
		
		this.gameProxy.gameMode = this.gameMode;
		this.StartGame();
		
		this.stage.addEventListener(KeyboardEvent.KEY_DOWN, this.OnKey);
		this.stage.focus = this.gameView;
	}
	
	public StartGame(): void {
		this.gameEnded = false;
		this.gameProxy.Reset();
		this.gameProxy.NextQuestion();
		if (this.gameMode == GameMediator.GAME_MODE_ARCADE) {
			this.gameTimer.Reset(GameTimer.GAME_ARCADE_TIME);
		} else {
			this.gameTimer.Reset(GameTimer.GAME_FREEPLAY_TIME);
		}
		//gameTimer.Start();
	}
	
	public onRemove(): void {
		super.onRemove();
		
		this.stage.removeChild(this.gameView);
		
		this.facade.removeMediator(MathSubMediator.NAME);
		this.facade.removeMediator(TowerSubMediator.NAME);
		
		this.stage.removeEventListener(KeyboardEvent.KEY_DOWN, this.OnKey);
	}
	
	public listNotificationInterests(): Array<any> {
		return [Events.ANSWER_BAD, Events.ANSWER_OK, Events.ANSWER_SURRENDER, Events.CREATE_NEW_QUESTION, Events.NEW_QUESTION, Events.NEW_LEVEL, Events.GAME_NUM_BACK, Events.GAME_NUM_DONE, Events.GAME_NUM_ENTERED, Events.GAME_TIMER_TIME_ENDED,];
	}
	
	public handleNotification(notification: INotification): void {
		let name: string = notification.getName();
		let body: Object = notification.getBody();
		
		// end game condition - if time is up, no events are handled by the game
		if (this.gameEnded) {
			return;
		}
		
		switch (name) {
			case Events.CREATE_NEW_QUESTION: 
				this.gameProxy.NextQuestion();
				break;
			case Events.ANSWER_SURRENDER: 
				(body as MathQuestion).answerType = MathQuestion.ANSWER_BAD;
				this.soundProxy.EffectError();
				this.gameProxy.NextQuestion();
				break;
			case Events.GAME_NUM_ENTERED: 
				this.gameProxy.currentQuestion.AnswerAddDigit(body as string);
				break;
			case Events.GAME_NUM_DONE: 
				if (this.gameProxy.currentQuestion.CheckUserAnswer()) {
					this.facade.sendNotification(Events.ANSWER_OK, this.gameProxy.currentQuestion);
				} else {
					this.soundProxy.EffectError();
					this.facade.sendNotification(Events.ANSWER_BAD, this.gameProxy.currentQuestion);
				}
				break;
			case Events.GAME_NUM_BACK: 
				this.gameProxy.currentQuestion.RemoveLastDigit();
				break;
			case Events.NEW_LEVEL:  
				{
					let diflvl: DifficultyLevel = body as DifficultyLevel;
					this.gameTimer.AddTime(DifficultyLevel.LEVEL_TIME_BONUS[diflvl.currentLevel - 1]);
				}
				break;
			case Events.GAME_TIMER_TIME_ENDED: 
				this.gameEnded = true;
				break;
		}
	}
	
	public OnKey(e: KeyboardEvent): void {
		if (e.keyCode == Keyboard.ENTER) {
			this.soundProxy.EffectKeypress();
			this.sendNotification(Events.GAME_NUM_DONE);
			
		} else if (e.keyCode == Keyboard.BACKSPACE) {
			this.soundProxy.EffectKeypress();
			this.sendNotification(Events.GAME_NUM_BACK);
			
		} else if (e.keyCode >= Keyboard.NUMBER_0 && e.keyCode <= Keyboard.NUMBER_9) {
			if (!this.gameTimer.isRunning && !this.gameEnded) {
				this.gameTimer.Start();
			}
			let pressedChar: string = String.fromCharCode(e.charCode);
			this.soundProxy.EffectKeypress();
			this.sendNotification(Events.GAME_NUM_ENTERED, pressedChar);
		} else if (e.keyCode == Keyboard.ESCAPE) {
			this.soundProxy.EffectClick();
			this.sendNotification(Events.NAVIGATION_MENU, this.stage);
		}
	}
	
	public get stage(): Stage {
		return this.viewComponent as Stage;
	}
}
