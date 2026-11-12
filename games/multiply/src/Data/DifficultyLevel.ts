import { Logger } from "../Logger.js";
import { GameMediator } from "../Mediators/GameMediator.js";

/**
 * ...
 * @author Perz
 */
export class DifficultyLevel {
	public static readonly MAX_LEVEL: number = 4;
	public currentLevel: number;
	public multiplyFactorMax: number;
	public multiplyFactorMin: number;
	private mode: string;
	
	public static readonly LEVEL_TIME_BONUS: Array<number> = [0, 20, 30, 40];
	
	constructor(gameMode: string) {
		this.mode = gameMode;
		this.currentLevel = 1;
		this.UpdateFactors();
	}
	
	public NextLevel(): void {
		if (this.IsMaxLevel()) return;
		
		this.currentLevel += 1;			
		this.UpdateFactors();			
	}
	
	public IsMaxLevel(): boolean {
		if (DifficultyLevel.MAX_LEVEL == this.currentLevel) return true;
		return false;
	}
	
	private UpdateFactors(): void {
		if (this.mode == GameMediator.GAME_MODE_FREEPLAY) {
			this.multiplyFactorMin = 1;
			this.multiplyFactorMax = 10;
			return;
		}
		
		switch (this.currentLevel) {
			case 1:
				this.multiplyFactorMin = 1;
				this.multiplyFactorMax = 3;
				break;
			case 2:
				this.multiplyFactorMin = 4;
				this.multiplyFactorMax = 5;
				break;
			case 3:
				this.multiplyFactorMin = 5;
				this.multiplyFactorMax = 7;
				break;
			case 4:
				this.multiplyFactorMin = 8;
				this.multiplyFactorMax = 10;
				break;
			default:
				Logger.Log("Difficulty level broken " + this.currentLevel);
		}
	}
}
