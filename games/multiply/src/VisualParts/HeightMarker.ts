import { Sprite } from "@edugames/common/flash/display/Sprite.js";
import { TextField } from "@edugames/common/flash/text/TextField.js";
import { TextFieldAutoSize } from "@edugames/common/flash/text/TextFieldAutoSize.js";
import { TextFormat } from "@edugames/common/flash/text/TextFormat.js";

/**
 * ...
 * @author Perzka Michalowy
 */
export class HeightMarker extends Sprite
{
	public text: TextField;

	constructor(meters: number)
	{
		super();
		this.text = new TextField();

		const tf: TextFormat = new TextFormat("verdana", 14, 0);
		this.text.defaultTextFormat = tf;
		this.text.selectable = false;
		this.text.autoSize = TextFieldAutoSize.LEFT;

		this.text.text = meters + " m";
		this.addChild(this.text);

		this.graphics.lineStyle(3, 0, 1);
		this.graphics.moveTo(0, this.text.height + 5);
		this.graphics.lineTo(50, this.text.height + 5);
		this.text.x = this.width - this.text.width;

		// DISABLED!
		this.visible = false;
	}

}
