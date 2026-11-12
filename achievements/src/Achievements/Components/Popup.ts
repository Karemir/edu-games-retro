import type { Class } from "@edugames/common/flash/utils/Class.js";
import { embed } from "@edugames/common/AssetLoader.js";
import { TweenLite } from "@edugames/common/com/greensock/TweenLite.js";
import { Bitmap } from "@edugames/common/flash/display/Bitmap.js";
import { MovieClip } from "@edugames/common/flash/display/MovieClip.js";
import { Sprite } from "@edugames/common/flash/display/Sprite.js";
import { Stage } from "@edugames/common/flash/display/Stage.js";
import { TextField } from "@edugames/common/flash/text/TextField.js";
import { TextFieldAutoSize } from "@edugames/common/flash/text/TextFieldAutoSize.js";
import { TextFormat } from "@edugames/common/flash/text/TextFormat.js";
import { TextFormatAlign } from "@edugames/common/flash/text/TextFormatAlign.js";
import { Achievement } from "../Achievement.js";

/**
 * ...
 * @author Michal Perzak
 */
export class Popup extends Sprite {
	private static mp_bold: Class = embed("../../achievements/Assets/MyriadPro-Bold.ttf", { fontName: "MBold", fontFamily: "MBold", mimeType: "application/x-font" });

	// PORT: instance embed hoisted to static (registers at module load)
	private static popCl: Class = embed("../../achievements/Assets/popupBg.png");
	
	public popBG: Bitmap;
	public score: MovieClip;
	public txt: TextField;
	
	private static stagePtr: Stage;
	
	constructor(ach: Achievement) {
		super();
		this.popBG = new Popup.popCl();
		this.popBG.smoothing = true;
		this.addChild(this.popBG);
		
		this.score = new ach.contentClass();
		this.addChild(this.score);
		this.score.stop();
		this.score.x = 45;
		this.score.y = 50;
		if(this.score.width > this.score.height){
			this.score.width = 80;
			this.score.scaleY = this.score.scaleX;
		} else {
			this.score.height = 80;
			this.score.scaleX = this.score.scaleY;
		}
		
		this.txt = new TextField();
		this.txt.selectable = false;
		this.txt.width = 290;
		this.txt.height = 90;
		this.txt.multiline = true;
		this.txt.wordWrap = true;
		this.txt.autoSize = TextFieldAutoSize.LEFT;
		this.txt.defaultTextFormat = new TextFormat("MBold", 22, 0xffffff, true, null, null, null, null, TextFormatAlign.CENTER);
		this.txt.embedFonts = true;
		this.txt.text = ach.description;
		
		this.txt.x = 50 + this.popBG.width / 2 - this.txt.width / 2;
		this.txt.y = 65;
		
		this.cacheAsBitmap = true;
		this.addChild(this.txt);
	}
	
	public static Initialize(stage: Stage): void {
		Popup.stagePtr = stage;
		new Popup.mp_bold();
	}
	
	public static ShowPopup(ach: Achievement): void {
		var popup: Popup = new Popup(ach);
		Popup.stagePtr.addChild(popup);
		popup.scaleX = popup.scaleY = 0.7;
		popup.alpha = 0.5;
		popup.x = Popup.stagePtr.stageWidth / 2 - popup.width / 2;
		popup.y = - popup.height;
		
		TweenLite.to(popup, 0.7, { y: 50, alpha: 1, onComplete: function(): void { TweenLite.to(popup, 0.4, { alpha:0, delay:2, onComplete: function(): void {
			popup.parent.removeChild(popup);
			popup = null;
		}});
		}} );
	}
}
