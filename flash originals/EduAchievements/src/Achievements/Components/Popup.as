package Achievements.Components {
	import Achievements.Achievement;
	import Achievements.AchievementTypes;
	import com.greensock.TweenLite;
	import flash.display.Bitmap;
	import flash.display.DisplayObject;
	import flash.display.MovieClip;
	import flash.display.Sprite;
	import flash.display.Stage;
	import flash.text.TextField;
	import flash.text.TextFieldAutoSize;
	import flash.text.TextFormat;
	import flash.text.TextFormatAlign;
	import flash.utils.setTimeout;
	
	/**
	 * ...
	 * @author Michal Perzak
	 */
	public class Popup extends Sprite {
		[Embed(source="../../../Assets/MyriadPro-Bold.ttf", fontName = "MBold", fontFamily="MBold", fontStyle="normal", fontWeight="normal", mimeType="application/x-font", embedAsCFF="false")] private static var mp_bold:Class;	

		[Embed(source = "../../../Assets/popupBg.png")]
		private var popCl:Class;
		
		public var popBG:Bitmap;
		public var score:MovieClip;
		public var txt:TextField;
		
		private static var stagePtr:Stage;
		
		public function Popup(ach:Achievement) {
			popBG = new popCl();
			popBG.smoothing = true;
			addChild(popBG);
			
			score = new ach.contentClass();
			addChild(score);
			score.stop();
			score.x = 45;
			score.y = 50;
			if(score.width > score.height){
				score.width = 80;
				score.scaleY = score.scaleX;
			} else {
				score.height = 80;
				score.scaleX = score.scaleY;
			}
			
			txt = new TextField();
			txt.selectable = false;
			txt.width = 290;
			txt.height = 90;
			txt.multiline = true;
			txt.wordWrap = true;
			txt.autoSize = TextFieldAutoSize.LEFT;
			txt.defaultTextFormat = new TextFormat("MBold", 22, 0xffffff, true, null, null, null, null, TextFormatAlign.CENTER);
			txt.embedFonts = true;
			txt.text = ach.description;
			
			txt.x = 50 + popBG.width / 2 - txt.width / 2;
			txt.y = 65;
			
			cacheAsBitmap = true;
			addChild(txt);
		}
		
		public static function Initialize(stage:Stage):void {
			stagePtr = stage;
			new mp_bold();
		}
		
		public static function ShowPopup(ach:Achievement):void {
			var popup:Popup = new Popup(ach);
			stagePtr.addChild(popup);
			popup.scaleX = popup.scaleY = 0.7;
			popup.alpha = 0.5;
			popup.x = stagePtr.stageWidth / 2 - popup.width / 2;
			popup.y = - popup.height;
			
			TweenLite.to(popup, 0.7, { y: 50, alpha: 1, onComplete: function():void { TweenLite.to(popup, 0.4, { alpha:0, delay:2, onComplete: function():void {
				popup.parent.removeChild(popup);
				popup = null;
			}});
			}} );
		}
	}

}