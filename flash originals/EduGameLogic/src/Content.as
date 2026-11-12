package  
{
	import flash.display.Bitmap;
	import flash.display.Loader;
	import flash.events.Event;
	import flash.utils.ByteArray;
	/**
	 * ...
	 * @author Perzka Michalowy
	 */
	public class Content
	{
		[Embed(source = "../Assets/R_execute.png", mimeType = "application/octet-stream")] 			private static var execute:Class;
		[Embed(source = "../Assets/R_forwardBlack.png", mimeType = "application/octet-stream")] 	private static var forwardBlack:Class;
		[Embed(source = "../Assets/R_forwardGray.png", mimeType = "application/octet-stream")] 		private static var forwardGray:Class;
		[Embed(source = "../Assets/R_rotateLeftBlack.png", mimeType = "application/octet-stream")] 	private static var rotateLeftBlack:Class;
		[Embed(source = "../Assets/R_rotateLeftGray.png", mimeType = "application/octet-stream")] 	private static var rotateLeftGray:Class;
		[Embed(source = "../Assets/R_rotateRightBlack.png", mimeType = "application/octet-stream")] private static var rotateRightBlack:Class;
		[Embed(source = "../Assets/R_rotateRightGray.png", mimeType = "application/octet-stream")] 	private static var rotateRightGray:Class;
		[Embed(source = "../Assets/R_useBlack.png", mimeType = "application/octet-stream")] 		private static var useBlack:Class;
		[Embed(source = "../Assets/R_useGray.png", mimeType = "application/octet-stream")] 			private static var useGray:Class;
		[Embed(source = "../Assets/gameUiBg.png", mimeType = "application/octet-stream")]			private static var gameUiBg:Class;
		[Embed(source = "../Assets/gameBg.png", mimeType = "application/octet-stream")]				private static var gameBg:Class;
		[Embed(source = "../Assets/MenuBg.jpg", mimeType = "application/octet-stream")] 			private static var bgBmp:Class;
		[Embed(source = "../Assets/fan.png", mimeType = "application/octet-stream")]				private static var fan:Class;
		[Embed(source = "../Assets/starNo.png", mimeType = "application/octet-stream")]				private static var starNo:Class;
		[Embed(source = "../Assets/starYes.png", mimeType = "application/octet-stream")]			private static var starYes:Class;
		[Embed(source = "../Assets/ambientBg.png", mimeType = "application/octet-stream")]			private static var ambientBg:Class;
		[Embed(source = "../Assets/levelSelector.png", mimeType = "application/octet-stream")]		private static var levelSelector:Class;
		                                                                                                    
		[Embed(source = "../Assets/lvlSelectEasy.png", mimeType = "application/octet-stream")]		private static var lvlSelEasy:Class;
		[Embed(source = "../Assets/lvlSelectHard.png", mimeType = "application/octet-stream")]		private static var lvlSelHard:Class;
		[Embed(source = "../Assets/lvlSelectMedium.png", mimeType = "application/octet-stream")]	private static var lvlSelMedium:Class;
		                                                                                                    
		[Embed(source = "../Assets/EndBtnMenu.png", mimeType = "application/octet-stream")]			private static var endBtnMenu:Class;
		[Embed(source = "../Assets/EndBtnNext.png", mimeType = "application/octet-stream")]			private static var endBtnNext:Class;
		[Embed(source = "../Assets/EndBtnReplay.png", mimeType = "application/octet-stream")]		private static var endBtnReplay:Class;
		[Embed(source = "../Assets/EndPopup.png", mimeType = "application/octet-stream")]			private static var endPopup:Class;
		[Embed(source = "../Assets/star.png", mimeType = "application/octet-stream")]				private static var star:Class;
		
		private static var classes:Array;
		
		public static function Init():void {
			classes = [];
			classes["endBtnMenu"] = LoadImage(endBtnMenu);
			classes["endBtnNext"] = LoadImage(endBtnNext);
			classes["endBtnReplay"] = LoadImage(endBtnReplay);
			classes["endPopup"] = LoadImage(endPopup);
			classes["star"] = LoadImage(star);
			
			classes["execute"] = LoadImage(execute);
			classes["forwardBlack"] = LoadImage(forwardBlack);
			classes["forwardGray"] = LoadImage(forwardGray);
			classes["rotateLeftBlack"] = LoadImage(rotateLeftBlack);
			classes["rotateLeftGray"] = LoadImage(rotateLeftGray);
			classes["rotateRightBlack"] = LoadImage(rotateRightBlack);
			classes["rotateRightGray"] = LoadImage(rotateRightGray);
			classes["useBlack"] = LoadImage(useBlack);
			classes["useGray"] = LoadImage(useGray);
			classes["gameUiBg"] = LoadImage(gameUiBg);
			classes["gameBg"] = LoadImage(gameBg);
			classes["bgBmp"] = LoadImage(bgBmp);
			classes["fan"] = LoadImage(fan);
			classes["starNo"] = LoadImage(starNo);
			classes["starYes"] = LoadImage(starYes);
			classes["ambientBg"] = LoadImage(ambientBg);
			classes["levelSelector"] = LoadImage(levelSelector);
			
			classes["lvlSelectEasy"] = LoadImage(lvlSelEasy);
			classes["lvlSelectHard"] = LoadImage(lvlSelHard);
			classes["lvlSelectMedium"] = LoadImage(lvlSelMedium);
		}
				
		public static function GetBitmap(name:String):Bitmap {
			var cl:Loader = classes[name];
			if (cl == null || !cl.content is Bitmap) {
				throw new Error("Bitmap not found: " + name);
			}
			var bmp:Bitmap = new Bitmap((cl.content as Bitmap).bitmapData);
			bmp.smoothing = true;
			
			return bmp;
		}
		
		private static function LoadImage(src:Class):Loader {
			var bg:Loader = new Loader();
			bg.loadBytes(new src() as ByteArray);
			bg.contentLoaderInfo.addEventListener(Event.COMPLETE, function(e:Event):void { (bg.content as Bitmap).smoothing = true; } );
			return bg;
		}

	}
}