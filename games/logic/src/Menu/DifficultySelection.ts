import { Bitmap } from "@edugames/common/flash/display/Bitmap.js";
import { Sprite } from "@edugames/common/flash/display/Sprite.js";
import { Event } from "@edugames/common/flash/events/Event.js";
import { MouseEvent } from "@edugames/common/flash/events/MouseEvent.js";
import { DropShadowFilter } from "@edugames/common/flash/filters/DropShadowFilter.js";
import { ColorTransform } from "@edugames/common/flash/geom/ColorTransform.js";
import { TextField } from "@edugames/common/flash/text/TextField.js";
import { TextFieldAutoSize } from "@edugames/common/flash/text/TextFieldAutoSize.js";
import { TextFormat } from "@edugames/common/flash/text/TextFormat.js";
import { AppFacade } from "../AppFacade.js";
import { Content } from "../Content.js";
import { Events } from "../Events.js";
import { GameLogic } from "../Mediators/GameLogic.js";
import { Sounds } from "../Proxies/Sounds.js";

/**
 * ...
 * @author Michal Perzak
 */
export class DifficultySelection extends Sprite {
	
	public btnEasy: Sprite;
	public btnMedium: Sprite;
	public btnHard: Sprite;
	
	private bg: Bitmap;
	private backBtn: Sprite;
	
	constructor() {
		super();
		this.addEventListener(Event.ADDED_TO_STAGE, this.onAdded);
	}
	
	private onAdded(e: Event): void {
		this.removeEventListener(Event.ADDED_TO_STAGE, this.onAdded);
		
		this.bg = Content.GetBitmap("ambientBg");
		this.bg.width = this.stage.stageWidth;
		this.bg.height = this.stage.stageHeight;
		this.addChild(this.bg);
		this.bg.alpha = 0.7;
		
		this.btnEasy = new Sprite();
		this.btnMedium = new Sprite();
		this.btnHard = new Sprite();
		
		this.btnEasy.addChild(Content.GetBitmap("lvlSelectEasy"));
		this.btnMedium.addChild(Content.GetBitmap("lvlSelectMedium"));
		this.btnHard.addChild(Content.GetBitmap("lvlSelectHard"));
		
		//tintColor(btnEasy, 0x22, 0xFF, 0x33, 1);
		//tintColor(btnMedium, 0xFF, 0xEA, 0x68, 1);
		//tintColor(btnHard, 0xFF, 0x6B, 0x51, 1);
		
		this.addChild(this.btnEasy);
		this.addChild(this.btnMedium);
		this.addChild(this.btnHard);
		
		let tf: TextFormat = new TextFormat("8bit", 27, 0xFFA63D);
		let txtEasy: TextField = new TextField();
		txtEasy.defaultTextFormat = tf;
		txtEasy.autoSize = TextFieldAutoSize.LEFT;
		txtEasy.text = "PROSTY";
		txtEasy.embedFonts = true;
		txtEasy.filters = [new DropShadowFilter(0, 0, 0, 1, 4, 4, 4)];
		txtEasy.x = (this.btnEasy.width - txtEasy.width)/2;
		txtEasy.y = this.btnEasy.height + 10;
		let txtMed: TextField = new TextField();
		txtMed.defaultTextFormat = tf;
		txtMed.autoSize = TextFieldAutoSize.LEFT;
		txtMed.text = "NORMALNY";
		txtMed.embedFonts = true;
		txtMed.filters = [new DropShadowFilter(0, 0, 0, 1, 4, 4, 4)];
		txtMed.x = (this.btnMedium.width - txtMed.width) / 2;
		txtMed.y = this.btnMedium.height + 10;
		let txtHard: TextField = new TextField();
		txtHard.defaultTextFormat = tf;
		txtHard.autoSize = TextFieldAutoSize.LEFT;
		txtHard.text = "TRUDNY";
		txtHard.embedFonts = true;
		txtHard.x = (this.btnHard.width - txtHard.width)/2;
		txtHard.y = this.btnHard.height + 10;
		txtHard.filters = [new DropShadowFilter(0, 0, 0, 1, 4, 4, 4)];
		
		this.btnEasy.scaleX = this.btnEasy.scaleY = this.btnMedium.scaleX = this.btnMedium.scaleY = this.btnHard.scaleX = this.btnHard.scaleY = 1.3;
		this.btnEasy.x = this.stage.stageWidth / 2 - this.btnEasy.width / 2 - this.btnMedium.width - 90;
		this.btnMedium.x = this.stage.stageWidth / 2 - this.btnMedium.width / 2;
		this.btnHard.x = this.stage.stageWidth / 2 - this.btnHard.width / 2 + this.btnMedium.width + 90;
		
		this.btnEasy.y = this.stage.stageHeight / 2 - this.btnEasy.height / 1.5;
		this.btnMedium.y = this.stage.stageHeight / 2 - this.btnMedium.height / 1.5;
		this.btnHard.y = this.stage.stageHeight / 2 - this.btnHard.height / 1.5;
		
		this.btnEasy.addChild(txtEasy);
		this.btnMedium.addChild(txtMed);
		this.btnHard.addChild(txtHard);
		
		this.btnEasy.buttonMode = this.btnMedium.buttonMode = this.btnHard.buttonMode = true;
		this.btnEasy.mouseChildren = this.btnMedium.mouseChildren = this.btnHard.mouseChildren = false;
		this.btnEasy.addEventListener(MouseEvent.CLICK, this.onEasy);
		this.btnMedium.addEventListener(MouseEvent.CLICK, this.onMedium);
		this.btnHard.addEventListener(MouseEvent.CLICK, this.onHard);
		
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
	
	private tintColor(mc: Sprite, r: number, g: number, b: number, alphaSet: number): void {
		let cTint: ColorTransform = new ColorTransform(r / 255.0, g / 255.0, b / 255.0, alphaSet);
		mc.transform.colorTransform = cTint;
	}
	
	public onEasy(e: Event): void {
		(AppFacade.GetInstance().retrieveProxy(Sounds.NAME) as Sounds).EffectClick();
		AppFacade.GetInstance().sendNotification(Events.NAVIGATION_CHOOSE_LEVEL, this.stage, GameLogic.GAME_DIF_EASY.toString());
	}
	
	public onMedium(e: Event): void {
		(AppFacade.GetInstance().retrieveProxy(Sounds.NAME) as Sounds).EffectClick();
		AppFacade.GetInstance().sendNotification(Events.NAVIGATION_CHOOSE_LEVEL, this.stage, GameLogic.GAME_DIF_MEDIUM.toString());
	}
	
	public onHard(e: Event): void {
		(AppFacade.GetInstance().retrieveProxy(Sounds.NAME) as Sounds).EffectClick();
		AppFacade.GetInstance().sendNotification(Events.NAVIGATION_CHOOSE_LEVEL, this.stage, GameLogic.GAME_DIF_HARD.toString());
	}
	
	public onBack(e: Event): void {
		(AppFacade.GetInstance().retrieveProxy(Sounds.NAME) as Sounds).EffectClick();
		AppFacade.GetInstance().sendNotification(Events.NAVIGATION_MENU, this.stage);
	}
}
