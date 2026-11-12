package VisualParts 
{
	import flash.display.Sprite;
	import flash.text.TextField;
	import flash.text.TextFieldAutoSize;
	import flash.text.TextFormat;
	
	/**
	 * ...
	 * @author Perzka Michalowy
	 */
	public class HeightMarker extends Sprite 
	{
		public var text:TextField;
		
		public function HeightMarker(meters:int) 
		{
			text = new TextField();
			
			var tf:TextFormat = new TextFormat("verdana", 14, 0);
			text.defaultTextFormat = tf;
			text.selectable = false;
			text.autoSize = TextFieldAutoSize.LEFT;
			
			text.text = meters + " m";
			addChild(text);
			
			graphics.lineStyle(3, 0, 1);
			graphics.moveTo(0, text.height + 5);
			graphics.lineTo(50, text.height + 5);
			text.x = width - text.width;
			
			// DISABLED!
			visible = false;
		}
		
	}

}