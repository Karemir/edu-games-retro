package VisualParts {
	import flash.display.DisplayObject;
	import flash.display.Sprite;
	import flash.text.TextField;
	import flash.text.TextFieldAutoSize;
	import flash.text.TextFormat;
	
	/**
	 * ...
	 * @author Perzka
	 */
	public class TextButton extends Sprite {
		public var text:String;
		public var img:DisplayObject;
		
		public var textField:TextField;
		
		public function TextButton(text:String, img:DisplayObject, format:TextFormat = null) {
			this.text = text;
			this.img = img;
			
			if (img) {
				addChild(img);
			} else {
				// add hitLayer
				var hitLayer:Sprite = new Sprite();
				hitLayer.graphics.beginFill(0, 0.3);
				hitLayer.graphics.drawRect(0, 0, width, height);
				hitLayer.graphics.endFill();
				addChild(hitLayer);
			}
			
			if (text) {
				textField = new TextField();
				
				if (format) {
					textField.defaultTextFormat = format;
				} else {
					var tf:TextFormat = new TextFormat("verdana", 30, 0, false, false, false);
					textField.defaultTextFormat = tf;
				}
				
				textField.selectable = false;
				textField.multiline = false;
				textField.autoSize = TextFieldAutoSize.LEFT;
				textField.wordWrap = false;
				textField.text = text;
				
				addChild(textField);
				if (textField.width < width) {
					textField.x = width / 2 - textField.width / 2;
				}
				if (textField.height < height) {
					textField.y = height / 2 - textField.height / 2;
				}
			}
			
			this.buttonMode = true;
			this.mouseChildren = false;
		}
	
	}

}