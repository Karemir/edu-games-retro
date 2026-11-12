import { Bitmap } from "@edugames/common/flash/display/Bitmap.js";
import { Sprite } from "@edugames/common/flash/display/Sprite.js";
import { Event } from "@edugames/common/flash/events/Event.js";
import { MouseEvent } from "@edugames/common/flash/events/MouseEvent.js";
import { AppFacade } from "../AppFacade.js";
import { Content } from "../Content.js";
import { Events } from "../Events.js";
import { SaveData } from "../Proxies/SaveData.js";
import { Sounds } from "../Proxies/Sounds.js";
import { LevelIcon } from "./LevelIcon.js";

/**
 * ...
 * @author ...
 */
export class LevelSelection extends Sprite 
{
	private lvlIcons: Array<any>;
	private levelsIdFrom: number = 0; // PORT: AS3 int defaults to 0
	private numLevels: number = 0; // PORT: AS3 int defaults to 0
	private iconContainer: Sprite;
	private saveData: SaveData;
	
	private bg: Bitmap;
	private backBtn: Sprite;
	
	constructor(levelsFrom: number, numLevels: number) 
	{
		super();
		this.numLevels = numLevels;
		this.levelsIdFrom = levelsFrom;
		this.addEventListener(Event.ADDED_TO_STAGE, this.onAdded);
		this.lvlIcons = new Array();
	}
	
	private onAdded(e: Event): void {
		this.removeEventListener(Event.ADDED_TO_STAGE, this.onAdded);
		
		this.bg = Content.GetBitmap("ambientBg");
		this.bg.width = this.stage.stageWidth;
		this.bg.height = this.stage.stageHeight;
		this.addChild(this.bg);
		this.bg.alpha = 0.7;
		
		let margin: number = 10;
		
		this.saveData = AppFacade.GetInstance().retrieveProxy(SaveData.NAME) as SaveData;
		this.iconContainer = new Sprite();
		this.addChild(this.iconContainer);
		
		let row: number = 0;
		
		for (let i: number = 0; i < this.numLevels; ++i) {
			let status: number = this.saveData.GetLevelStatus(i+this.levelsIdFrom);
			let icon: LevelIcon = new LevelIcon(i+this.levelsIdFrom, status);
			this.iconContainer.addChild(icon);
			this.lvlIcons.push(icon);
			
			let nextX: number = margin + i * (icon.width + margin);
			row = (i / 10) | 0;	// PORT: AS3 int assignment truncates
			
			icon.x = margin + (i%10) * (icon.width + margin) + 10;
			icon.y = margin + 200 + row * (icon.height + 5);
		}
		
		this.backBtn = new Sprite();
		let bmp: Bitmap = Content.GetBitmap("endBtnNext");
		bmp.scaleX = -1;
		this.backBtn.addChild(bmp);
		this.addChild(this.backBtn);
		this.backBtn.addEventListener(MouseEvent.CLICK, this.onBack);
		this.backBtn.buttonMode = true;
		
		this.backBtn.x = 10 + this.backBtn.width;
		this.backBtn.y = this.stage.stageHeight - this.backBtn.height - 10;
	}
	
	private onBack(e: Event): void {
		(AppFacade.GetInstance().retrieveProxy(Sounds.NAME) as Sounds).EffectClick();
		AppFacade.GetInstance().sendNotification(Events.NAVIGATION_CHOOSE_DIF, this.stage);
	}
	
}
