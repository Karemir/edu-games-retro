package Visuals {
	import flash.display.Loader;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.text.TextField;
	import flash.text.TextFieldAutoSize;
	import flash.text.TextFormat;
	import flash.text.TextFormatAlign;
	import Proxies.DataStructs.DisplayQuestion;
	import Proxies.QuestionProxy;
	import Proxies.QuizConfigProxy;
	
	/**
	 * ...
	 * @author Perzak
	 */
	public class QuizPanel extends Sprite {
		public static const ALL_IMAGES_LOADED:String = "allLoaded";
		
		public var question:DisplayQuestion;
		public var images:Vector.<LoadedImage>;
		public var title:TextField;
		public var imagePanel:Sprite;
		
		private var selectionQueue:Vector.<LoadedImage>;
		private var quizConf:QuizConfigProxy;
		private var loadedImages:int;
		
		public static const WIDTH:int = 960;
		public static const HEIGHT:int = 450;
		
		public function QuizPanel(dispQuestion:DisplayQuestion) {
			graphics.beginFill(0xaaaaaa, 0);
			graphics.drawRect(0, 0, WIDTH, HEIGHT);
			this.question = dispQuestion;
			imagePanel = new Sprite();
			addChild(imagePanel);
			
			title = new TextField();
			title.selectable = false;
			title.defaultTextFormat = new TextFormat("andale", 20, 0xffffff, null, null, null, null, null, TextFormatAlign.CENTER);
			title.text = question.text;
			title.width = 710
			title.autoSize = TextFieldAutoSize.CENTER;
			title.wordWrap = true;
			title.embedFonts = true;
			addChild(title);
			
			title.x = WIDTH / 2 - title.width / 2;
			title.y = 0;
			graphics.lineStyle(1, 0xffffff);
			graphics.moveTo(125, title.y + title.height + 5);
			graphics.lineTo(WIDTH - 125, title.y + title.height + 5);
			
			quizConf = AppFacade.GetInstance().retrieveProxy(QuizConfigProxy.NAME) as QuizConfigProxy;
			images = new Vector.<LoadedImage>();
			selectionQueue = new Vector.<LoadedImage>();
		}
		
		public function UpdatePositioning():void {
			var margin:int = 10;
			for (var i:int = 0; i < images.length; ++i) {
				var tmp:LoadedImage = images[i] as LoadedImage;
				if (images.length == 4) {
					tmp.x = int(i % 2) * (tmp.width + margin);
					tmp.y = int(i / 2) * (tmp.height + margin);
				} else if (images.length == 6) {
					tmp.x = int(i % 3) * (tmp.width + margin);
					tmp.y = int(i / 3) * (tmp.height + margin);
				} else {
					tmp.x = int(i % 4) * (tmp.width + margin);
					tmp.y = int(i / 4) * (tmp.height + margin);
				}
			}
			
			imagePanel.y = title.y + title.height + 10;
			imagePanel.x = WIDTH / 2 - imagePanel.width / 2;
		}
		
		public function LoadImages():void {
			loadedImages = 0;
			
			var shouldBeImgs:int = quizConf.GetImgCountForDifficulty();
			var badImgCount:int = Math.min(question.badImages.length, question.badImages.length - (question.badImages.length - (shouldBeImgs - (quizConf.difficulty + 1))));
			
			for (var badIdx:int = 0; badIdx < badImgCount; ++badIdx) {
				CreateLoader(question.badImages[badIdx], false);
			}
			for (var i:int = 0; i < quizConf.difficulty + 1; ++i) {
				CreateLoader(question.correctImages[i], true);
			}
		}
		
		private function CreateLoader(imgName:String, isCorrect:Boolean):void {
			var imgSize:int = 205;
			if (quizConf.difficulty == QuestionProxy.DIF_MEDIUM) { imgSize = 205; }
			if (quizConf.difficulty == QuestionProxy.DIF_HARD) { imgSize = 205; }
			
			var ldImg:LoadedImage = new LoadedImage(imgName, isCorrect, imgSize);
			if (images.length > 0) {
				images.splice(int(Math.random() * images.length), 0, ldImg); // add to random position
			} else {
				images.push(ldImg);
			}
			imagePanel.addChild(ldImg);
			ldImg.addEventListener(LoadedImage.LOAD_ERROR, onLoadError);
			ldImg.addEventListener(LoadedImage.LOADED, onLoadComplete);
			ldImg.addEventListener(LoadedImage.DESELECTED, onDeselect);
			ldImg.addEventListener(LoadedImage.SELECTED, onSelect);
		}
		
		/**
		 * returns the score in percentage 0-1
		 * @return
		 */
		public function CheckAnswersAndScore():Number {
			var count:Number = 0;
			for (var i:int = 0; i < images.length; ++i) {
				count += images[i].CheckAnswer();
			}
			count = Math.max(0, count);
			return count / (quizConf.difficulty + 1);
		}
		
		private function onLoadComplete(e:Event):void {
			loadedImages += 1;
			if (loadedImages == quizConf.GetImgCountForDifficulty()) {
				UpdatePositioning();
				dispatchEvent(new Event(ALL_IMAGES_LOADED));
			}
		}
		
		private function onSelect(e:Event):void {
			var img:LoadedImage = e.currentTarget as LoadedImage;
			if (!img) return;

			var maxChoice:int = quizConf.difficulty + 1;
			if (maxChoice <= selectionQueue.length) {
				selectionQueue[0].Deselect();
			}
			selectionQueue.push(img);
			
			trace("after select " + selectionQueue.length);
		}
		
		private function onDeselect(e:Event):void {
			var img:LoadedImage = e.currentTarget as LoadedImage;
			if (!img) return;
			
			var idx:int = selectionQueue.indexOf(img);
			if (idx > 0) {
				selectionQueue.splice(idx, 1);
			} else if (idx == 0) {
				selectionQueue.shift();
			}
			
			trace("deselect : " + selectionQueue.length);
		}
		
		private function onLoadError(e:Event):void {
			// TODO
			trace("Error is not handled yet");
		}
	}

}