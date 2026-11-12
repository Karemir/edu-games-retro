package  
{
	import flash.display.Bitmap;
	import flash.display.DisplayObject;
	import flash.display.Loader;
	import flash.events.Event;
	import flash.utils.ByteArray;
	/**
	 * ...
	 * @author Perzak
	 */
	public class Content 
	{
		[Embed(source="../Assets/gameBg.jpg", mimeType = "application/octet-stream")] private static var bgImg:Class;
//		[Embed(source = "../Assets/Logo_GwK.png", mimeType = "application/octet-stream")]private static var projectLogoBmp:Class;
//		[Embed(source = "../Assets/Logo_eu.png", mimeType = "application/octet-stream")]private static var euLogoBmp:Class;
		[Embed(source="../Assets/MenuBg.png", mimeType = "application/octet-stream")]private static var bgBmp:Class;
		[Embed(source = "../Assets/leftPanelBg.png", mimeType = "application/octet-stream")] private static var leftPanelBmp:Class;

		private static var bitmaps:Array;
		
		public static function Init():void {
			bitmaps = [];
			bitmaps["bgImg"] = LoadImage(bgImg);
//			bitmaps["projectLogoBmp"] = LoadImage(projectLogoBmp);
//			bitmaps["euLogoBmp"] = LoadImage(euLogoBmp);
			bitmaps["bgBmp"] = LoadImage(bgBmp);
			bitmaps["leftPanelBmp"] = LoadImage(leftPanelBmp);			
		}
		
		private static function LoadImage(src:Class):DisplayObject {
			var bg:Loader = new Loader();
			bg.loadBytes(new src() as ByteArray);
			bg.contentLoaderInfo.addEventListener(Event.COMPLETE, function(e:Event):void { (bg.content as Bitmap).smoothing = true; } );
			return bg;
		}
		
		public static function GetBmp(className:String):Bitmap {
			var ldr:Loader = bitmaps[className];
			if (!ldr || !ldr.content is Bitmap) {
				return null;
			}
			
			return ldr.content as Bitmap;
		}
	}

}