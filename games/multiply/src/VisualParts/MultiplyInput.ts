import { embed } from "@edugames/common/AssetLoader.js";
import { Bitmap } from "@edugames/common/flash/display/Bitmap.js";
import { Sprite } from "@edugames/common/flash/display/Sprite.js";
import { Event } from "@edugames/common/flash/events/Event.js";
import { MouseEvent } from "@edugames/common/flash/events/MouseEvent.js";
import { TextField } from "@edugames/common/flash/text/TextField.js";
import { TextFieldAutoSize } from "@edugames/common/flash/text/TextFieldAutoSize.js";
import { TextFormat } from "@edugames/common/flash/text/TextFormat.js";
import type { Class } from "@edugames/common/flash/utils/Class.js";
import { AppFacade } from "../AppFacade.js";
import { MathQuestion } from "../Data/MathQuestion.js";
import { Events } from "../Events.js";
import { Sounds } from "../Proxies/Sounds.js";
import { TextButton } from "./TextButton.js";

/**
 * ...
 * @author Perz
 */
export class MultiplyInput extends Sprite {
	public texts: Sprite;
	public textQuestion: TextField;
	public textEquals: TextField;
	public textInput: TextField;
	public btnSurrender: TextButton;
	
	public question: MathQuestion;
	
	// PORT: [Embed] field registered with the AssetLoader, path relative to index.html
	private static btnSurrenderBmp: Class = embed("Assets/changeTask.png");
	
	constructor(w: number, h: number) {
		super();
		this.graphics.beginFill(0, 0);
		this.graphics.drawRect(0, 0, w, h);
		
		this.textQuestion = new TextField();
		this.textEquals = new TextField();
		this.textInput = new TextField();
		
		let tf1: TextFormat = new TextFormat("MBold", 36);
		let tf2: TextFormat = new TextFormat("MBold", 33);
		this.textEquals.defaultTextFormat = tf2;
		this.textInput.defaultTextFormat = tf1;
		this.textQuestion.defaultTextFormat = tf1;
		
		this.textEquals.embedFonts = true;
		this.textInput.embedFonts = true;
		this.textQuestion.embedFonts = true;
		
		this.textEquals.autoSize = this.textInput.autoSize = this.textQuestion.autoSize = TextFieldAutoSize.LEFT;
		this.textEquals.selectable = this.textInput.selectable = this.textQuestion.selectable = false;
		
		this.textEquals.text = "=";
		
		let btnSurrBg: Bitmap = new MultiplyInput.btnSurrenderBmp();
		btnSurrBg.smoothing = true;
		this.btnSurrender = new TextButton(null, btnSurrBg);
		
		this.texts = new Sprite();
		this.addChild(this.texts);
		this.texts.addChild(this.textEquals);
		this.texts.addChild(this.textQuestion);
		this.texts.addChild(this.textInput);
		this.addChild(this.btnSurrender);
		this.btnSurrender.addEventListener(MouseEvent.CLICK, this.OnSurrender);
		
		this.visible = false;
	}
	
	private OnSurrender(e: Event): void {
		this.question.CheckUserAnswer();
		AppFacade.GetInstance().sendNotification(Events.ANSWER_SURRENDER, this.question);
	}
	
	public SetQuestion(q: MathQuestion): void {
		this.visible = true;
		
		this.question = q;
		this.textQuestion.text = q.ToString();
		if (q.answerType == MathQuestion.ANSWER_BAD) {
			this.textInput.text = q.result.toString(); // change color
		} else if (q.answerType == MathQuestion.ANSWER_CORRECT) {
			this.textInput.text = q.result.toString(); // change color
		} else if (q.answerType == MathQuestion.ANSWER_WAITING) {
			this.textInput.text = "?";
		}
		
		this.textQuestion.y = 0;
		this.textQuestion.x = 0;
		this.textEquals.y = 1;// textQuestion.y + textQuestion.height + 10;
		this.textEquals.x = this.textQuestion.x + this.textQuestion.width + 5; //width / 2 - textEquals.width / 2;
		this.textInput.y = 0;// textEquals.y + textEquals.height + 10;
		this.textInput.x = this.textEquals.x + this.textEquals.width + 5;//width / 2 - textInput.width / 2;
		
		this.btnSurrender.y = this.height - this.btnSurrender.height - 2;
		this.btnSurrender.x = 175 - this.btnSurrender.width / 2 ;
		
		this.texts.x = 170 - this.texts.width / 2;
	}
	
	public UpdateQuestion(): void {
		if (this.question.userAnswer.length == 0) {
			this.textInput.text = "?";
		} else {
			this.textInput.text = this.question.userAnswer;
		}
		this.texts.x = 170 - this.texts.width / 2;
		//textInput.x = width / 2 - textInput.width / 2;
	}
}
