import { TextField } from "@edugames/common/flash/text/TextField.js";
import { TextFieldAutoSize } from "@edugames/common/flash/text/TextFieldAutoSize.js";
import { TextFormat } from "@edugames/common/flash/text/TextFormat.js";
import { TextFormatAlign } from "@edugames/common/flash/text/TextFormatAlign.js";

/**
 * ...
 * @author Perzka Michalowy
 */
export class TextStyles 
{
	public static CreateNormalText(text: string): TextField {
		var txt: TextField = new TextField();
		txt.selectable = false;
		txt.multiline = true;
		txt.autoSize = TextFieldAutoSize.LEFT;
		
		var tf: TextFormat = new TextFormat("MBold", 20, 0);
		tf.align = TextFormatAlign.CENTER;
		
		txt.defaultTextFormat = tf;
		txt.text = text;
		txt.embedFonts = true;
		
		return txt;
	}
	
	public static CreateBoldText(text: string, color: number = 0): TextField {
		var txt: TextField = new TextField();
		txt.selectable = false;
		txt.multiline = false;
		txt.autoSize = TextFieldAutoSize.LEFT;
		txt.defaultTextFormat = new TextFormat("MBold", 25, color, true);
		txt.text = text;
		txt.embedFonts = true;
		
		return txt;
	}

	public static CreateGameText(text: string, color: number = 0): TextField {
		var txt: TextField = new TextField();
		txt.selectable = false;
		txt.multiline = false;
		txt.autoSize = TextFieldAutoSize.LEFT;
		txt.defaultTextFormat = new TextFormat("MBold", 70, color, true);
		txt.text = text;
		txt.embedFonts = true;
		
		return txt;
	}
	
	public static CreateSummaryRaceScore(text: string, color: number = 0): TextField {
		var txt: TextField = new TextField();
		txt.selectable = false;
		txt.multiline = false;
		txt.autoSize = TextFieldAutoSize.LEFT;
		txt.defaultTextFormat = new TextFormat("MBold", 20, color);
		txt.text = text;
		txt.embedFonts = true;
		
		return txt;
	}
}
