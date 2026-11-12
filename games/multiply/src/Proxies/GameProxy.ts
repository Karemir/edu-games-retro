import { AchievementProxy } from "@edugames/achievements/Achievements/AchievementProxy.js";
import { SharedObject } from "@edugames/common/flash/net/SharedObject.js";
import type { IProxy } from "@edugames/common/org/puremvc/as3/interfaces/IProxy.js";
import { Proxy } from "@edugames/common/org/puremvc/as3/patterns/proxy/Proxy.js";
import { AppFacade } from "../AppFacade.js";
import { DifficultyLevel } from "../Data/DifficultyLevel.js";
import { MathQuestion } from "../Data/MathQuestion.js";
import { Events } from "../Events.js";
import { Logger } from "../Logger.js";
import { GameMediator } from "../Mediators/GameMediator.js";

/**
 * ...
 * @author Perzka
 */
export class GameProxy extends Proxy implements IProxy {
	public static NAME: string = "QuestionsProxy";
	
	public static readonly LEVEL_HEIGHTS: Array<number> = [0, 500, 1100, 1800];
	
	/**
	 * Score is displayed in freeplay mode.
	 */
	public score: number; 
	public difLevel: DifficultyLevel;
	public questionList: Array<MathQuestion>; // PORT: Vector.<MathQuestion>
	public currentQuestion: MathQuestion;
	public gameMode: string;
	
	public towerHeight: number;
	
	public correctAnsCount: number;
	public totalAnsCount: number = 0; // PORT: int default, read before assignment in the constructor
	
	public sharedObj: SharedObject;
	public achProxy: AchievementProxy;
	
	constructor() {
		super();
		this.Reset();
		this.sharedObj = SharedObject.getLocal("eduMultiply");
		
		if (this.sharedObj.data.totalAnsCount) {
			this.totalAnsCount = (this.sharedObj.data.totalAnsCount | 0); // PORT: int(x) -> (x | 0)
		}			
	}
	
	public onRegister(): void {
		super.onRegister();
		this.achProxy = this.facade.retrieveProxy(AchievementProxy.NAME) as AchievementProxy;
	}
	
	public SetMode(isFreeplay: boolean): void {
		if (isFreeplay) {
			this.gameMode = GameMediator.GAME_MODE_FREEPLAY;
		} else {
			this.gameMode = GameMediator.GAME_MODE_ARCADE;
		}
	}
	
	public NextQuestion(): void {	
		if (this.currentQuestion && this.currentQuestion.answerType == MathQuestion.ANSWER_CORRECT) {
			this.correctAnsCount++;
			this.totalAnsCount++;
			this.score += this.currentQuestion.result;
			this.sendNotification(Events.GAME_TOWER_HEIGHT_UPDATE, 0);
			
			if (this.correctAnsCount == 10) {
				this.achProxy.AddAchievement(1); // "Poprawnie wykonane 10 działań pod rząd"
			}
			if (this.correctAnsCount == 30) {
				this.achProxy.AddAchievement(2); // "Poprawnie wykonane 30 działań pod rząd"
			}
			this.sharedObj.data.totalAnsCount = this.totalAnsCount;
			if (this.totalAnsCount >= 50) {
				this.achProxy.AddAchievement(3); // "Poprawnie wykonane 50 działań (w sumie)"
			}
			if (this.totalAnsCount >= 100) {
				this.achProxy.AddAchievement(4); // "Poprawnie wykonane 100 działań (w sumie)"
			}
			
		} else {
			this.correctAnsCount = 0;
		}
		
		var q: MathQuestion = new MathQuestion(this.difLevel.multiplyFactorMin, this.difLevel.multiplyFactorMax, this.currentQuestion, this.difLevel.currentLevel);
		this.questionList.push(q);
		this.currentQuestion = q;
		
		AppFacade.GetInstance().sendNotification(Events.NEW_QUESTION, q);
	}
	
	public GrowTower(amount: number): void {
		this.towerHeight += amount;
		
		AppFacade.GetInstance().sendNotification(Events.GAME_TOWER_HEIGHT_UPDATE, ((this.towerHeight / 10) | 0)); // PORT: int(x) -> (x | 0)
		
		Logger.Log("Tower grew to " + this.towerHeight);
		for (var i: number = 0; i < GameProxy.LEVEL_HEIGHTS.length; ++i) {
			if (GameProxy.LEVEL_HEIGHTS[i] <= this.towerHeight && i > this.difLevel.currentLevel - 1) {
				Logger.Log("Next Level! current " + this.difLevel.currentLevel);
				this.difLevel.NextLevel();
				
				AppFacade.GetInstance().sendNotification(Events.NEW_LEVEL, this.difLevel);
				
				if (this.difLevel.IsMaxLevel()) {
					this.achProxy.AddAchievement(7); // "Wybuduj kosmiczny budynek"
				}
				break;
			}
		}
		
		if (750 < this.towerHeight) {
			this.achProxy.AddAchievement(5); //"Zbudowana wieża na 75 metrów"
		}
		if (1500 < this.towerHeight) {
			this.achProxy.AddAchievement(6); // "Zbudowana wieża na 150 metrów"
		}
	}
	
	public Reset(): void {
		this.questionList = new Array<MathQuestion>(); // PORT: new Vector.<MathQuestion>()
		this.currentQuestion = null;
		this.towerHeight = 0;
		this.score = 0;
		this.correctAnsCount = 0;
		
		this.difLevel = new DifficultyLevel(this.gameMode);
		if (this.gameMode == "freeplay") {
			this.sendNotification(Events.GAME_NEW_FREEPLAY);
		} else {
			this.sendNotification(Events.GAME_NEW_ARCADE);
		}
	}
	
	public getProxyName(): string {
		return GameProxy.NAME;
	}
}
