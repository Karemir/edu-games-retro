package Data {
	import Achievements.Components.Popup;
	import Mediators.GameMediator;
	/**
	 * ...
	 * @author Perz
	 */
	public class DifficultyLevel {
		public static const MAX_LEVEL:int = 4;
		public var currentLevel:int;
		public var multiplyFactorMax:int;
		public var multiplyFactorMin:int;
		private var mode:String;
		
		public static const LEVEL_TIME_BONUS:Array = [0, 20, 30, 40];
		
		public function DifficultyLevel(gameMode:String) {
			this.mode = gameMode;
			currentLevel = 1;
			UpdateFactors();
		}
		
		public function NextLevel():void {
			if (IsMaxLevel()) return;
			
			currentLevel += 1;			
			UpdateFactors();			
		}
		
		public function IsMaxLevel():Boolean {
			if (MAX_LEVEL == currentLevel) return true;
			return false;
		}
		
		private function UpdateFactors():void {
			if (mode == GameMediator.GAME_MODE_FREEPLAY) {
				multiplyFactorMin = 1;
				multiplyFactorMax = 10;
				return;
			}
			
			switch(currentLevel) {
				case 1:
					multiplyFactorMin = 1;
					multiplyFactorMax = 3;
					break;
				case 2:
					multiplyFactorMin = 4;
					multiplyFactorMax = 5;
					break;
				case 3:
					multiplyFactorMin = 5;
					multiplyFactorMax = 7;
					break;
				case 4:
					multiplyFactorMin = 8;
					multiplyFactorMax = 10;
					break;
				default:
					Logger.Log("Difficulty level broken " + currentLevel);
			}
		}
	}

}