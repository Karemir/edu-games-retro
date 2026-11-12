import { Bitmap } from "@edugames/common/flash/display/Bitmap.js";
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
	public img: Bitmap;
	
	public textField: TextField;
	
	constructor(text: string, img: Bitmap, format: TextFormat = null) {
		super();
		this.text = text;
		this.img = img;
		img.smoothing = true;
		
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
		
		if (img) {
			this.addChild(img);
		}
		
		this.addChild(this.textField);
		if (this.textField.width < this.width) {
			this.textField.x = this.width / 2 - this.textField.width / 2;
		}
		if (this.textField.height < this.height) {
			this.textField.y = this.height / 2 - this.textField.height / 2;
		}
		
		this.buttonMode = true;
		this.mouseChildren = false;
		
		// add hitLayer
		let hitLayer: Sprite = new Sprite();
		hitLayer.graphics.beginFill(0xffffff, 0.01);
		hitLayer.graphics.drawRect(0, 0, this.width, this.height);
		hitLayer.graphics.endFill();
		this.addChildAt(hitLayer, 0);
	}

}
