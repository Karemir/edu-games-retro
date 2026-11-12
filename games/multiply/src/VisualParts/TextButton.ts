import { DisplayObject } from "@edugames/common/flash/display/DisplayObject.js";
import { Sprite } from "@edugames/common/flash/display/Sprite.js";
import { TextField } from "@edugames/common/flash/text/TextField.js";
import { TextFieldAutoSize } from "@edugames/common/flash/text/TextFieldAutoSize.js";
import { TextFormat } from "@edugames/common/flash/text/TextFormat.js";

/**
 * ...
 * @author Perzka
 */
export class TextButton extends Sprite {
	public text: string;
	public img: DisplayObject;
	
	public textField: TextField;
	
	constructor(text: string, img: DisplayObject, format: TextFormat = null) {
		super();
		this.text = text;
		this.img = img;
		
		if (img) {
			this.addChild(img);
		} else {
			// add hitLayer
			let hitLayer: Sprite = new Sprite();
			hitLayer.graphics.beginFill(0, 0.3);
			hitLayer.graphics.drawRect(0, 0, this.width, this.height);
			hitLayer.graphics.endFill();
			this.addChild(hitLayer);
		}
		
		if (text) {
			this.textField = new TextField();
			
			if (format) {
				this.textField.defaultTextFormat = format;
			} else {
				let tf: TextFormat = new TextFormat("verdana", 30, 0, false, false, false);
				this.textField.defaultTextFormat = tf;
			}
			
			this.textField.selectable = false;
			this.textField.multiline = false;
			this.textField.autoSize = TextFieldAutoSize.LEFT;
			this.textField.wordWrap = false;
			this.textField.text = text;
			
			this.addChild(this.textField);
			if (this.textField.width < this.width) {
				this.textField.x = this.width / 2 - this.textField.width / 2;
			}
			if (this.textField.height < this.height) {
				this.textField.y = this.height / 2 - this.textField.height / 2;
			}
		}
		
		this.buttonMode = true;
		this.mouseChildren = false;
	}

}
