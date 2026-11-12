import { Sprite } from "@edugames/common/flash/display/Sprite.js";
import { TextField } from "@edugames/common/flash/text/TextField.js";
import { TextFieldAutoSize } from "@edugames/common/flash/text/TextFieldAutoSize.js";
import { TextFormat } from "@edugames/common/flash/text/TextFormat.js";
import { TextFormatAlign } from "@edugames/common/flash/text/TextFormatAlign.js";

/**
 * Shows current height and time left
 * @author Perzka Michalowy
 */
export class MultiplyStatus extends Sprite 
{
	public heightValue: TextField;
	public heightLabel: TextField;
	public timeValue: TextField;
	public timeLabel: TextField;
	
	private heightBasePos: number;
	
	private desiredWidth: number;
	private desiredHeight: number;
	
	constructor(w: number, h: number) 
	{
		super();
		this.desiredHeight = h;
		this.desiredWidth = w;
		
		let tf: TextFormat = new TextFormat("verdana", 16, 0);
		tf.align = TextFormatAlign.CENTER;
		
		this.heightLabel = new TextField();
		this.timeLabel = new TextField();
		this.timeValue = new TextField();
		this.heightValue = new TextField();
		
		tf.size = 20;
		tf.bold = true;
		this.heightLabel.defaultTextFormat = this.timeLabel.defaultTextFormat = tf;			
		this.heightValue.defaultTextFormat = this.timeValue.defaultTextFormat = tf;
		this.heightValue.textColor = 0xcbe089;
		this.timeValue.textColor = 0xcbe089;
		
		this.heightLabel.selectable = this.heightValue.selectable = this.timeLabel.selectable = this.timeValue.selectable = false;
		this.heightLabel.autoSize = this.heightValue.autoSize = this.timeLabel.autoSize = this.timeValue.autoSize = TextFieldAutoSize.LEFT;
		
		this.addChild(this.heightLabel);
		this.addChild(this.heightValue);
		this.addChild(this.timeLabel);
		this.addChild(this.timeValue);
		
		this.heightLabel.multiline = true;
		this.timeLabel.multiline = true;
		
		this.heightLabel.text = "m";
		this.timeLabel.text = "s";
		
		this.timeValue.text = "0";
		this.heightValue.text = "0";
		
		this.heightLabel.x = 75;
		this.heightLabel.y = 20;
		this.heightValue.x = this.heightBasePos = 88;
		this.heightValue.x -= this.heightValue.width / 2;
		
		this.timeValue.x = 255; //desiredWidth * 3 / 4 + 30;
		this.timeLabel.x = 270;//desiredWidth * 2 / 4 + 20;
		this.timeLabel.y = 20;
	}
	
	public SetTowerHeight(h: number): void {
		if (h > 0)
			this.heightValue.text = h + "";// + " m";
		this.heightValue.x = this.heightBasePos - this.heightValue.width / 2;
	}
	
	public SetTimeLeft(timeStr: string): void {
		this.timeValue.text = timeStr;
	}
	
}
