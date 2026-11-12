package  
{
	import flash.text.TextField;
	import flash.text.TextFieldAutoSize;
	import flash.text.TextFormat;
	import flash.text.TextFormatAlign;
	/**
	 * ...
	 * @author Perzka Michalowy
	 */
	public class TextStyles 
	{
		public static function CreateNormalText(text:String):TextField {
			var txt:TextField = new TextField();
			txt.selectable = false;
			txt.multiline = true;
			txt.autoSize = TextFieldAutoSize.LEFT;
			
			var tf:TextFormat = new TextFormat("MBold", 20, 0);
			tf.align = TextFormatAlign.CENTER;
			
			txt.defaultTextFormat = tf;
			txt.text = text;
			txt.embedFonts = true;
			
			return txt;
		}
		
		public static function CreateBoldText(text:String, color:uint = 0):TextField {
			var txt:TextField = new TextField();
			txt.selectable = false;
			txt.multiline = false;
			txt.autoSize = TextFieldAutoSize.LEFT;
			txt.defaultTextFormat = new TextFormat("MBold", 25, color, true);
			txt.text = text;
			txt.embedFonts = true;
			
			return txt;
		}

		public static function CreateGameText(text:String, color:uint = 0):TextField {
			var txt:TextField = new TextField();
			txt.selectable = false;
			txt.multiline = false;
			txt.autoSize = TextFieldAutoSize.LEFT;
			txt.defaultTextFormat = new TextFormat("MBold", 70, color, true);
			txt.text = text;
			txt.embedFonts = true;
			
			return txt;
		}
		
		public static function CreateSummaryRaceScore(text:String, color:uint = 0):TextField {
			var txt:TextField = new TextField();
			txt.selectable = false;
			txt.multiline = false;
			txt.autoSize = TextFieldAutoSize.LEFT;
			txt.defaultTextFormat = new TextFormat("MBold", 20, color);
			txt.text = text;
			txt.embedFonts = true;
			
			return txt;
		}
	}

}