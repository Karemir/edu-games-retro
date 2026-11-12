/**
 * ...
 * @author Michal Perzak
 */
export class AchievementTypes {
	public static readonly GAME_LOGIC_ACH_1: string = "logicAch1";
	public static readonly GAME_LOGIC_ACH_2: string = "logicAch2";
	public static readonly GAME_LOGIC_ACH_3: string = "logicAch3";
	public static readonly GAME_LOGIC_ACH_4: string = "logicAch4";
	public static readonly GAME_LOGIC_ACH_5: string = "logicAch5";
	public static readonly GAME_LETTERS_ACH_1: string = "lettersAch1";
	public static readonly GAME_LETTERS_ACH_2: string = "lettersAch2";
	public static readonly GAME_LETTERS_ACH_3: string = "lettersAch3";
	public static readonly GAME_LETTERS_ACH_4: string = "lettersAch4";
	public static readonly GAME_LETTERS_ACH_5: string = "lettersAch5";
	public static readonly GAME_MULTIPLY_ACH_1: string = "multiplyAch1";
	public static readonly GAME_MULTIPLY_ACH_2: string = "multiplyAch2";
	public static readonly GAME_MULTIPLY_ACH_3: string = "multiplyAch3";
	public static readonly GAME_MULTIPLY_ACH_4: string = "multiplyAch4";
	public static readonly GAME_MULTIPLY_ACH_5: string = "multiplyAch5";
	
	private static readonly ACHIEVEMENT_WORTH_TABLE: any = new Object();
	static { // PORT: AS3 class-level block, runs once when the class is initialised
		AchievementTypes.ACHIEVEMENT_WORTH_TABLE[AchievementTypes.GAME_LOGIC_ACH_1] = 5;
		AchievementTypes.ACHIEVEMENT_WORTH_TABLE[AchievementTypes.GAME_LOGIC_ACH_2] = 5;
		AchievementTypes.ACHIEVEMENT_WORTH_TABLE[AchievementTypes.GAME_LOGIC_ACH_3] = 10;
		AchievementTypes.ACHIEVEMENT_WORTH_TABLE[AchievementTypes.GAME_LOGIC_ACH_4] = 10;
		AchievementTypes.ACHIEVEMENT_WORTH_TABLE[AchievementTypes.GAME_LOGIC_ACH_5] = 15;

		AchievementTypes.ACHIEVEMENT_WORTH_TABLE[AchievementTypes.GAME_LETTERS_ACH_1] = 5;
		AchievementTypes.ACHIEVEMENT_WORTH_TABLE[AchievementTypes.GAME_LETTERS_ACH_2] = 5;
		AchievementTypes.ACHIEVEMENT_WORTH_TABLE[AchievementTypes.GAME_LETTERS_ACH_3] = 10;
		AchievementTypes.ACHIEVEMENT_WORTH_TABLE[AchievementTypes.GAME_LETTERS_ACH_4] = 10;
		AchievementTypes.ACHIEVEMENT_WORTH_TABLE[AchievementTypes.GAME_LETTERS_ACH_5] = 15;
		
		AchievementTypes.ACHIEVEMENT_WORTH_TABLE[AchievementTypes.GAME_MULTIPLY_ACH_1] = 5;
		AchievementTypes.ACHIEVEMENT_WORTH_TABLE[AchievementTypes.GAME_MULTIPLY_ACH_2] = 5;
		AchievementTypes.ACHIEVEMENT_WORTH_TABLE[AchievementTypes.GAME_MULTIPLY_ACH_3] = 10;
		AchievementTypes.ACHIEVEMENT_WORTH_TABLE[AchievementTypes.GAME_MULTIPLY_ACH_4] = 10;
		AchievementTypes.ACHIEVEMENT_WORTH_TABLE[AchievementTypes.GAME_MULTIPLY_ACH_5] = 15;
	}
	
	private static readonly ACHIEVEMENT_MSG_TABLE: any = new Object();
	static { // PORT: AS3 class-level block
		AchievementTypes.ACHIEVEMENT_MSG_TABLE[AchievementTypes.GAME_LOGIC_ACH_1] = "Osiągnięcie 1";
		AchievementTypes.ACHIEVEMENT_MSG_TABLE[AchievementTypes.GAME_LOGIC_ACH_2] = "Osiągnięcie 2";
		AchievementTypes.ACHIEVEMENT_MSG_TABLE[AchievementTypes.GAME_LOGIC_ACH_3] = "Osiągnięcie 3";
		AchievementTypes.ACHIEVEMENT_MSG_TABLE[AchievementTypes.GAME_LOGIC_ACH_4] = "Osiągnięcie 4";
		AchievementTypes.ACHIEVEMENT_MSG_TABLE[AchievementTypes.GAME_LOGIC_ACH_5] = "Osiągnięcie 5";

		AchievementTypes.ACHIEVEMENT_MSG_TABLE[AchievementTypes.GAME_LETTERS_ACH_1] = "Osiągnięcie 1";
		AchievementTypes.ACHIEVEMENT_MSG_TABLE[AchievementTypes.GAME_LETTERS_ACH_2] = "Osiągnięcie 2";
		AchievementTypes.ACHIEVEMENT_MSG_TABLE[AchievementTypes.GAME_LETTERS_ACH_3] = "Osiągnięcie 3";
		AchievementTypes.ACHIEVEMENT_MSG_TABLE[AchievementTypes.GAME_LETTERS_ACH_4] = "Osiągnięcie 4";
		AchievementTypes.ACHIEVEMENT_MSG_TABLE[AchievementTypes.GAME_LETTERS_ACH_5] = "Osiągnięcie 5";
		
		AchievementTypes.ACHIEVEMENT_MSG_TABLE[AchievementTypes.GAME_MULTIPLY_ACH_1] = "Osiągnięcie 1";
		AchievementTypes.ACHIEVEMENT_MSG_TABLE[AchievementTypes.GAME_MULTIPLY_ACH_2] = "Osiągnięcie 2";
		AchievementTypes.ACHIEVEMENT_MSG_TABLE[AchievementTypes.GAME_MULTIPLY_ACH_3] = "Osiągnięcie 3";
		AchievementTypes.ACHIEVEMENT_MSG_TABLE[AchievementTypes.GAME_MULTIPLY_ACH_4] = "Osiągnięcie 4";
		AchievementTypes.ACHIEVEMENT_MSG_TABLE[AchievementTypes.GAME_MULTIPLY_ACH_5] = "Osiągnięcie 5";		
	}
	
	public static GetAchievementPoints(GameAchievement: string): number {
		return AchievementTypes.ACHIEVEMENT_WORTH_TABLE[GameAchievement];
	}
	
	public static GetAchievementMsg(GameAchievement: string): string {
		return AchievementTypes.ACHIEVEMENT_MSG_TABLE[GameAchievement];
	}
}
