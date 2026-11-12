package VisualParts {
	import adobe.utils.CustomActions;
	import Data.MathQuestion;
	import flash.display.Bitmap;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.text.TextField;
	import flash.text.TextFieldAutoSize;
	import flash.text.TextFormat;
	import Proxies.Sounds;
	
	/**
	 * ...
	 * @author Perz
	 */
	public class MultiplyInput extends Sprite {
		public var texts:Sprite;
		public var textQuestion:TextField;
		public var textEquals:TextField;
		public var textInput:TextField;
		public var btnSurrender:TextButton;
		
		public var question:MathQuestion;
		
		[Embed(source="../../Assets/changeTask.png")]
		private var btnSurrenderBmp:Class;
		
		public function MultiplyInput(w:int, h:int) {
			graphics.beginFill(0, 0);
			graphics.drawRect(0, 0, w, h);
			
			textQuestion = new TextField();
			textEquals = new TextField();
			textInput = new TextField();
			
			var tf1:TextFormat = new TextFormat("MBold", 36);
			var tf2:TextFormat = new TextFormat("MBold", 33);
			textEquals.defaultTextFormat = tf2;
			textInput.defaultTextFormat = tf1;
			textQuestion.defaultTextFormat = tf1;
			
			textEquals.embedFonts = true;
			textInput.embedFonts = true;
			textQuestion.embedFonts = true;
			
			textEquals.autoSize = textInput.autoSize = textQuestion.autoSize = TextFieldAutoSize.LEFT;
			textEquals.selectable = textInput.selectable = textQuestion.selectable = false;
			
			textEquals.text = "=";
			
			var btnSurrBg:Bitmap = new btnSurrenderBmp();
			btnSurrBg.smoothing = true;
			btnSurrender = new TextButton(null, btnSurrBg);
			
			texts = new Sprite();
			addChild(texts);
			texts.addChild(textEquals);
			texts.addChild(textQuestion);
			texts.addChild(textInput);
			addChild(btnSurrender);
			btnSurrender.addEventListener(MouseEvent.CLICK, OnSurrender);
			
			visible = false;
		}
		
		private function OnSurrender(e:Event):void {
			question.CheckUserAnswer();
			AppFacade.GetInstance().sendNotification(Events.ANSWER_SURRENDER, question);
		}
		
		public function SetQuestion(q:MathQuestion):void {
			visible = true;
			
			question = q;
			textQuestion.text = q.ToString();
			if (q.answerType == MathQuestion.ANSWER_BAD) {
				textInput.text = q.result.toString(); // change color
			} else if (q.answerType == MathQuestion.ANSWER_CORRECT) {
				textInput.text = q.result.toString(); // change color
			} else if (q.answerType == MathQuestion.ANSWER_WAITING) {
				textInput.text = "?";
			}
			
			textQuestion.y = 0;
			textQuestion.x = 0;
			textEquals.y = 1;// textQuestion.y + textQuestion.height + 10;
			textEquals.x = textQuestion.x + textQuestion.width + 5; //width / 2 - textEquals.width / 2;
			textInput.y = 0;// textEquals.y + textEquals.height + 10;
			textInput.x = textEquals.x + textEquals.width + 5;//width / 2 - textInput.width / 2;
			
			btnSurrender.y = height - btnSurrender.height - 2;
			btnSurrender.x = 175 - btnSurrender.width / 2 ;
			
			texts.x = 170 - texts.width / 2;
		}
		
		public function UpdateQuestion():void {
			if (question.userAnswer.length == 0) {
				textInput.text = "?";
			} else {
				textInput.text = question.userAnswer;
			}
			texts.x = 170 - texts.width / 2;
			//textInput.x = width / 2 - textInput.width / 2;
		}
	}

}