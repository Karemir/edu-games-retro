package Achievements {
	/**
	 * ...
	 * @author Michal Perzak
	 */
	public class AchievementTypes {
		public static const GAME_LOGIC_ACH_1:String = "logicAch1";
		public static const GAME_LOGIC_ACH_2:String = "logicAch2";
		public static const GAME_LOGIC_ACH_3:String = "logicAch3";
		public static const GAME_LOGIC_ACH_4:String = "logicAch4";
		public static const GAME_LOGIC_ACH_5:String = "logicAch5";
		public static const GAME_LETTERS_ACH_1:String = "lettersAch1";
		public static const GAME_LETTERS_ACH_2:String = "lettersAch2";
		public static const GAME_LETTERS_ACH_3:String = "lettersAch3";
		public static const GAME_LETTERS_ACH_4:String = "lettersAch4";
		public static const GAME_LETTERS_ACH_5:String = "lettersAch5";
		public static const GAME_MULTIPLY_ACH_1:String = "multiplyAch1";
		public static const GAME_MULTIPLY_ACH_2:String = "multiplyAch2";
		public static const GAME_MULTIPLY_ACH_3:String = "multiplyAch3";
		public static const GAME_MULTIPLY_ACH_4:String = "multiplyAch4";
		public static const GAME_MULTIPLY_ACH_5:String = "multiplyAch5";
		
		private static const ACHIEVEMENT_WORTH_TABLE:Object = new Object();
		{
			ACHIEVEMENT_WORTH_TABLE[GAME_LOGIC_ACH_1] = 5;
			ACHIEVEMENT_WORTH_TABLE[GAME_LOGIC_ACH_2] = 5;
			ACHIEVEMENT_WORTH_TABLE[GAME_LOGIC_ACH_3] = 10;
			ACHIEVEMENT_WORTH_TABLE[GAME_LOGIC_ACH_4] = 10;
			ACHIEVEMENT_WORTH_TABLE[GAME_LOGIC_ACH_5] = 15;

			ACHIEVEMENT_WORTH_TABLE[GAME_LETTERS_ACH_1] = 5;
			ACHIEVEMENT_WORTH_TABLE[GAME_LETTERS_ACH_2] = 5;
			ACHIEVEMENT_WORTH_TABLE[GAME_LETTERS_ACH_3] = 10;
			ACHIEVEMENT_WORTH_TABLE[GAME_LETTERS_ACH_4] = 10;
			ACHIEVEMENT_WORTH_TABLE[GAME_LETTERS_ACH_5] = 15;
			
			ACHIEVEMENT_WORTH_TABLE[GAME_MULTIPLY_ACH_1] = 5;
			ACHIEVEMENT_WORTH_TABLE[GAME_MULTIPLY_ACH_2] = 5;
			ACHIEVEMENT_WORTH_TABLE[GAME_MULTIPLY_ACH_3] = 10;
			ACHIEVEMENT_WORTH_TABLE[GAME_MULTIPLY_ACH_4] = 10;
			ACHIEVEMENT_WORTH_TABLE[GAME_MULTIPLY_ACH_5] = 15;
		}
		
		private static const ACHIEVEMENT_MSG_TABLE:Object = new Object();
		{
			ACHIEVEMENT_MSG_TABLE[GAME_LOGIC_ACH_1] = "Osiągnięcie 1";
			ACHIEVEMENT_MSG_TABLE[GAME_LOGIC_ACH_2] = "Osiągnięcie 2";
			ACHIEVEMENT_MSG_TABLE[GAME_LOGIC_ACH_3] = "Osiągnięcie 3";
			ACHIEVEMENT_MSG_TABLE[GAME_LOGIC_ACH_4] = "Osiągnięcie 4";
			ACHIEVEMENT_MSG_TABLE[GAME_LOGIC_ACH_5] = "Osiągnięcie 5";

			ACHIEVEMENT_MSG_TABLE[GAME_LETTERS_ACH_1] = "Osiągnięcie 1";
			ACHIEVEMENT_MSG_TABLE[GAME_LETTERS_ACH_2] = "Osiągnięcie 2";
			ACHIEVEMENT_MSG_TABLE[GAME_LETTERS_ACH_3] = "Osiągnięcie 3";
			ACHIEVEMENT_MSG_TABLE[GAME_LETTERS_ACH_4] = "Osiągnięcie 4";
			ACHIEVEMENT_MSG_TABLE[GAME_LETTERS_ACH_5] = "Osiągnięcie 5";
			
			ACHIEVEMENT_MSG_TABLE[GAME_MULTIPLY_ACH_1] = "Osiągnięcie 1";
			ACHIEVEMENT_MSG_TABLE[GAME_MULTIPLY_ACH_2] = "Osiągnięcie 2";
			ACHIEVEMENT_MSG_TABLE[GAME_MULTIPLY_ACH_3] = "Osiągnięcie 3";
			ACHIEVEMENT_MSG_TABLE[GAME_MULTIPLY_ACH_4] = "Osiągnięcie 4";
			ACHIEVEMENT_MSG_TABLE[GAME_MULTIPLY_ACH_5] = "Osiągnięcie 5";		
		}
		
		public static function GetAchievementPoints(GameAchievement:String):int {
			return ACHIEVEMENT_WORTH_TABLE[GameAchievement];
		}
		
		public static function GetAchievementMsg(GameAchievement:String):String {
			return ACHIEVEMENT_MSG_TABLE[GameAchievement];
		}
	}

}