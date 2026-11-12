package Visuals.Components {
	import flash.display.Sprite;
	import flash.text.TextField;
	import flash.text.TextFieldAutoSize;
	import flash.text.TextFormat;
	
	/**
	 * ...
	 * @author Perzak
	 */
	public class TxtButton extends Sprite {
		public function TxtButton(text:String, tf:TextFormat) {
			var d1:TextField = new TextField();
			if(tf){
				d1.defaultTextFormat = tf;
				d1.embedFonts = true;
			}
			d1.text = text;
			d1.selectable = false;
			d1.autoSize = TextFieldAutoSize.LEFT;
			addChild(d1);
			mouseChildren = false;
			buttonMode = true;
		}
	
	}

}