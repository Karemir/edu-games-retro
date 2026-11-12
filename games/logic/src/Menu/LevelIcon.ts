import { Bitmap } from "@edugames/common/flash/display/Bitmap.js";
import { Sprite } from "@edugames/common/flash/display/Sprite.js";
import { Event } from "@edugames/common/flash/events/Event.js";
import { MouseEvent } from "@edugames/common/flash/events/MouseEvent.js";
import { TextField } from "@edugames/common/flash/text/TextField.js";
import { TextFieldAutoSize } from "@edugames/common/flash/text/TextFieldAutoSize.js";
import { TextFormat } from "@edugames/common/flash/text/TextFormat.js";
import { AppFacade } from "../AppFacade.js";
import { Content } from "../Content.js";
import { Events } from "../Events.js";
import { SaveData } from "../Proxies/SaveData.js";

/**
 * Represents a single level in selection screen.
 * Also shows stars if the level is completed
 * @author ...
 */
export class LevelIcon extends Sprite 
{
	public status: number = 0; // PORT: int default
	public levelId: number = 0; // PORT: int default
	
	constructor(levelId: number, status: number) 
	{
		super();
		this.addEventListener(MouseEvent.CLICK, this.onSelected);
		this.buttonMode = true;
		this.mouseChildren = false;
		this.levelId = levelId;
		
		this.addChild(Content.GetBitmap("levelSelector"));
		
		var txt: TextField = new TextField();
		txt.defaultTextFormat = new TextFormat("8bit", 18);
		txt.text = (levelId + 1) + "";
		txt.autoSize = TextFieldAutoSize.LEFT;
		txt.embedFonts = true;
		this.addChild(txt);
		txt.x = this.width / 2 - txt.width / 2 - 4;
		txt.y = 80 / 2 - txt.height / 2;
		
		var s1: Bitmap;
		var s2: Bitmap;
		var s3: Bitmap;

		switch(status) {
			case SaveData.LEVEL_3_STAR:
				s1 = Content.GetBitmap("starYes");
				s2 = Content.GetBitmap("starYes");
				s3 = Content.GetBitmap("starYes");
				break;
			case SaveData.LEVEL_2_STAR:
				s1 = Content.GetBitmap("starYes");
				s2 = Content.GetBitmap("starYes");
				s3 = Content.GetBitmap("starNo");
				break;
			case SaveData.LEVEL_1_STAR:
				s1 = Content.GetBitmap("starYes");
				s2 = Content.GetBitmap("starNo");
				s3 = Content.GetBitmap("starNo");
				break;
			case SaveData.LEVEL_NOT_COMPLETED:
				s1 = new Bitmap();
				s2 = new Bitmap();
				s3 = new Bitmap();
				break;
		}
		
		this.addChild(s1);
		this.addChild(s2);
		this.addChild(s3);
					
		s1.y = 71;
		s2.y = 71;
		s3.y = 71;
		
		s1.x = 5;
		s2.x = s1.width + s1.x;
		s3.x = s2.width + s2.x;
	}
	
	private onSelected(e: Event): void {
		this.removeEventListener(MouseEvent.CLICK, this.onSelected);
		AppFacade.GetInstance().sendNotification(Events.MENU_LEVEL_SELECTED, this.stage, this.levelId.toString());
	}
}
