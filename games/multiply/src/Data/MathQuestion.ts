import { Logger } from "../Logger.js";

/**
 * ...
 * @author ...
 */
export class MathQuestion {
	public static readonly ANSWER_CORRECT: number = 1;
	public static readonly ANSWER_BAD: number = -1;
	public static readonly ANSWER_WAITING: number = 0;
	
	// PORT: AS3 int fields default to 0 (the "previousQuestion = new MathQuestion(0, 1, this, 0)" check reads them before they are assigned)
	public firstNumber: number = 0;
	public secondNumber: number = 0;
	public result: number = 0;
	public answerType: number = 0;
	
	public userAnswer: string;
	public difficultyLevel: number = 0; // PORT: int default
	
	constructor(factorMin: number, factorMax: number, previousQuestion: MathQuestion, difficultyLevel: number) {
		factorMax += 1; // for sake of building
		
		if (!previousQuestion) { previousQuestion = new MathQuestion(0, 1, this, 0); } // prevent null from crashing checks bellow.
		
		// we don't want 0 to appear too often, so just make a reroll on zero
		var rerolls: number = 0;
		do{
			this.firstNumber = Math.floor(Math.random() * (factorMax - factorMin) + factorMin);
			this.secondNumber = Math.floor(Math.random() * factorMax);
			rerolls++;
			if (rerolls > 1) { Logger.Log("Reroll"); }
			
		}while (rerolls <= 1 && 
			((this.firstNumber == 0 || this.secondNumber == 0) || 
			 (previousQuestion.firstNumber == this.firstNumber && previousQuestion.secondNumber == this.firstNumber)));
		
		// flip numbers so they look more randomized.
		if (Math.random() < 0.5) {
			var tmp: number = this.firstNumber;
			this.firstNumber = this.secondNumber;
			this.secondNumber = tmp;
		}
		
		this.result = this.firstNumber * this.secondNumber;
		this.answerType = MathQuestion.ANSWER_WAITING;
		this.userAnswer = "";
		this.difficultyLevel = difficultyLevel;
	}
	
	public CheckUserAnswer(): boolean {
		if (this.userAnswer.length > 0 && (Number(this.userAnswer) | 0) == this.result) { // PORT: int(x) -> (Number(x) | 0)
			this.answerType = MathQuestion.ANSWER_CORRECT;
			return true;
		} else {
			this.answerType = MathQuestion.ANSWER_BAD;
			return false;
		}
	}
	
	public AnswerAddDigit(digit: string): void {
		this.userAnswer += digit;
		if (this.userAnswer.length > 3) {
			this.userAnswer = this.userAnswer.slice(0, 3);
		}
	}
	
	public RemoveLastDigit(): void {
		this.userAnswer = this.userAnswer.slice(0, this.userAnswer.length - 1);			
	}
	
	public ToString(): string {
		return this.firstNumber + " x " + this.secondNumber;
	}
	
	public ToLongString(): string {
		if (this.answerType == MathQuestion.ANSWER_WAITING) {
			return this.firstNumber + " x " + this.secondNumber + " = ?";
		} else if (this.answerType == MathQuestion.ANSWER_CORRECT || this.answerType == MathQuestion.ANSWER_WAITING) {
			return this.firstNumber + " x " + this.secondNumber + " = " + this.result;
		} else {
			return this.ToString();
		}
	}
	
	public ToSplicedString(): Array<any> {
		if (this.answerType == MathQuestion.ANSWER_CORRECT || this.answerType == MathQuestion.ANSWER_BAD) {
			return [this.firstNumber.toString(), this.secondNumber.toString(), this.result.toString()];
		} else {
			return [this.firstNumber.toString(), this.secondNumber.toString(), "?"];
		}
	}
}
