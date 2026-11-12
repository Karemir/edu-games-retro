import type { Class } from "@edugames/common/flash/utils/Class.js";
import { embed } from "@edugames/common/AssetLoader.js";
import { TweenLite } from "@edugames/common/com/greensock/TweenLite.js";
import { Bitmap } from "@edugames/common/flash/display/Bitmap.js";
import { Sprite } from "@edugames/common/flash/display/Sprite.js";
import { Point } from "@edugames/common/flash/geom/Point.js";
import { TextField } from "@edugames/common/flash/text/TextField.js";
import { TextFieldAutoSize } from "@edugames/common/flash/text/TextFieldAutoSize.js";
import { TextFormat } from "@edugames/common/flash/text/TextFormat.js";
import { TextFormatAlign } from "@edugames/common/flash/text/TextFormatAlign.js";
import { Achievement } from "../Achievement.js";

/**
 * ...
 * @author Perzak
 */
export class AchievementInfoPanel extends Sprite 
{
	// PORT: instance embed hoisted to static (registers at module load)
	private static fontKlepone: Class = embed("../../achievements/Assets/Klepon Scone.ttf", { fontName: "klepone", fontFamily: "klepone", mimeType: "application/x-font" });

	private static bgCl: Class = embed("../../achievements/Assets/popup.png");
	
	public bg: Bitmap;
	public title: TextField;
	public message: TextField;
	public prizeName: TextField;

	constructor() {
		super();
		this.title = AchievementInfoPanel.CreateTitleText("TITLE");
		this.message = AchievementInfoPanel.CreateNormalText("some very long description message long lon long long long long");
		this.prizeName = AchievementInfoPanel.CreateNormalText("Funny name", 0x4CA825);
		this.bg = new AchievementInfoPanel.bgCl();
		this.bg.smoothing = true;
		
		this.addChild(this.bg);
		this.addChild(this.title);
		this.addChild(this.prizeName);
		this.addChild(this.message);
		
		this.bg.height += 10;
		this.bg.x = -this.bg.width;
		this.bg.y = -this.bg.height / 2;
		this.title.x = this.bg.x + 10;
		this.title.y = this.bg.y + 2;
		this.prizeName.x = this.title.x;
		this.prizeName.y = this.title.y + 25;
		this.message.x = this.prizeName.x;
		this.message.y = this.prizeName.y + 25;
	}
	
	public ShowInfo(ach: Achievement, pt: Point): void {
		var me: AchievementInfoPanel = this;
		if (this.alpha > 0) {
			this.Hide(() => { this.UpdateAndShow(ach, pt); } );
		} else {
			this.UpdateAndShow(ach, pt);
		}
	}
	
	private UpdateAndShow(ach: Achievement, pt: Point): void {
		this.x = pt.x;
		this.y = pt.y;
		this.title.text = ach.title;
		this.message.text = ach.description;
		this.prizeName.text = ach.prizeName;
		this.Show(null);
	}
			
	public Show(cb: Function): void {
		if (cb != null) {
			TweenLite.to(this, 0.4, { alpha:1, onComplete: cb } );
		} else {
			TweenLite.to(this, 0.4, { alpha:1 } );
		}
	}
	
	public Hide(cb: Function): void {
		if(cb != null){
			TweenLite.to(this, 0.4, { alpha:0, onComplete: cb } );
		} else {
			TweenLite.to(this, 0.4, { alpha:0 } );
		}
	}

	public static CreateNormalText(text: string, color: number = 0): TextField {
		var txt: TextField = new TextField();
		txt.selectable = false;
		txt.multiline = true;
		txt.wordWrap = true;
		txt.autoSize = TextFieldAutoSize.NONE;
		
		var tf: TextFormat = new TextFormat("klepone", 16, color);
		tf.align = TextFormatAlign.LEFT;
		
		txt.width = 170;
		txt.height = 100;
		txt.defaultTextFormat = tf;
		txt.text = text;
		txt.embedFonts = true;
		
		return txt;
	}
	
	public static CreateTitleText(text: string, color: number = 0): TextField {
		var txt: TextField = new TextField();
		txt.selectable = false;
		txt.multiline = false;
		txt.autoSize = TextFieldAutoSize.LEFT;
		txt.defaultTextFormat = new TextFormat("klepone", 22, color, true);
		txt.text = text;
		txt.embedFonts = true;
		
		return txt;
	}
}
