package Data {
	
	/**
	 * ...
	 * @author ...
	 */
	public class MathQuestion {
		public static const ANSWER_CORRECT:int = 1;
		public static const ANSWER_BAD:int = -1;
		public static const ANSWER_WAITING:int = 0;
		
		public var firstNumber:int;
		public var secondNumber:int;
		public var result:int;
		public var answerType:int
		
		public var userAnswer:String;
		public var difficultyLevel:int;
		
		public function MathQuestion(factorMin:int, factorMax:int, previousQuestion:MathQuestion, difficultyLevel:int) {
			factorMax += 1; // for sake of building
			
			if (!previousQuestion) { previousQuestion = new MathQuestion(0, 1, this, 0); } // prevent null from crashing checks bellow.
			
			// we don't want 0 to appear too often, so just make a reroll on zero
			var rerolls:int = 0;
			do{
				firstNumber = Math.floor(Math.random() * (factorMax - factorMin) + factorMin);
				secondNumber = Math.floor(Math.random() * factorMax);
				rerolls++;
				if (rerolls > 1) { Logger.Log("Reroll"); }
				
			}while (rerolls <= 1 && 
				((firstNumber == 0 || secondNumber == 0) || 
				 (previousQuestion.firstNumber == firstNumber && previousQuestion.secondNumber == firstNumber)));
			
			// flip numbers so they look more randomized.
			if (Math.random() < 0.5) {
				var tmp:int = firstNumber;
				firstNumber = secondNumber;
				secondNumber = tmp;
			}
			
			result = firstNumber * secondNumber;
			answerType = ANSWER_WAITING;
			userAnswer = "";
			this.difficultyLevel = difficultyLevel;
		}
		
		public function CheckUserAnswer():Boolean {
			if (userAnswer.length > 0 && int(userAnswer) == result) {
				answerType = ANSWER_CORRECT;
				return true;
			} else {
				answerType = ANSWER_BAD;
				return false;
			}
		}
		
		public function AnswerAddDigit(digit:String):void {
			userAnswer += digit;
			if (userAnswer.length > 3) {
				userAnswer = userAnswer.slice(0, 3);
			}
		}
		
		public function RemoveLastDigit():void {
			userAnswer = userAnswer.slice(0, userAnswer.length - 1);			
		}
		
		public function ToString():String {
			return firstNumber + " x " + secondNumber;
		}
		
		public function ToLongString():String {
			if (answerType == ANSWER_WAITING) {
				return firstNumber + " x " + secondNumber + " = ?";
			} else if (answerType == ANSWER_CORRECT || answerType == ANSWER_WAITING) {
				return firstNumber + " x " + secondNumber + " = " + result;
			} else {
				return ToString();
			}
		}
		
		public function ToSplicedString():Array {
			if (answerType == ANSWER_CORRECT || answerType == ANSWER_BAD) {
				return [firstNumber.toString(), secondNumber.toString(), result.toString()];
			} else {
				return [firstNumber.toString(), secondNumber.toString(), "?"];
			}
		}
	}
}