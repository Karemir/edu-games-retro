import { TweenLite } from "@edugames/common/com/greensock/TweenLite.js";
import { Bitmap } from "@edugames/common/flash/display/Bitmap.js";
import { Sprite } from "@edugames/common/flash/display/Sprite.js";
import { Event } from "@edugames/common/flash/events/Event.js";
import { MouseEvent } from "@edugames/common/flash/events/MouseEvent.js";
import { BlurFilter } from "@edugames/common/flash/filters/BlurFilter.js";
import { DropShadowFilter } from "@edugames/common/flash/filters/DropShadowFilter.js";
import { TextField } from "@edugames/common/flash/text/TextField.js";
import { TextFieldAutoSize } from "@edugames/common/flash/text/TextFieldAutoSize.js";
import { TextFormat } from "@edugames/common/flash/text/TextFormat.js";
import { AppFacade } from "../AppFacade.js";
import { Content } from "../Content.js";
import { Events } from "../Events.js";
import { Sounds } from "../Proxies/Sounds.js";
import { Character } from "./Character.js";
import { CommandList } from "./CommandList.js";
import { GameLevel } from "./GameLevel.js";
import { RoboCommand } from "./RoboCommand.js";

/**
 * ...
 * @author Michal Perzak
 */
export class Screen extends Sprite {
	public gameLayer: Sprite;
	public uiLayer: Sprite;
	public uiBgBmp: Bitmap;
	public gameBgBmp: Bitmap;
	public recDot: Sprite;
	public comCount: TextField;
	public lvlLabel: TextField;
	
	public endPopup: Sprite;
	public btnReplay: Sprite;
	public btnMenu: Sprite;
	public btnNext: Sprite;
	public backBtn: Sprite;
	
	public gameLevel: GameLevel;
	public character: Character;
	
	private btnExecute: Sprite;
	private btnForward: Sprite;
	private btnLeft: Sprite;
	private btnRight: Sprite;
	private btnUse: Sprite;
	public commandList: CommandList;
	public currentLevel: number;
	
	private fanSprite: Sprite;
	public fanSpeed: number;
	private sounds: Sounds;
	
	constructor(levelId: number) {
		super();
		this.currentLevel = levelId;
		this.gameLevel = new GameLevel(this.currentLevel);
		this.character = new Character(this.gameLevel.GetStartDirection());
		this.recDot = new Sprite();
		this.comCount = new TextField();
		
		this.addEventListener(Event.ADDED_TO_STAGE, this.onAdded);
		this.addEventListener(Event.ENTER_FRAME, this.UpdateFan);
	}
	
	private onAdded(e: Event): void {
		this.removeEventListener(Event.ADDED_TO_STAGE, this.onAdded);
		this.gameLayer = new Sprite();
		this.uiLayer = new Sprite();
		
		this.uiBgBmp = Content.GetBitmap("gameUiBg");
		this.uiLayer.addChild(this.uiBgBmp);
		this.uiBgBmp.y = this.stage.stageHeight - this.uiBgBmp.height;
		
		this.gameBgBmp = Content.GetBitmap("ambientBg");
		this.addChild(this.gameBgBmp);
		this.CreateComCount();
		
		// create dot
		this.recDot.graphics.beginFill(0xFFA63D);
		this.recDot.graphics.drawCircle(13, 13, 13);
		this.recDot.x = 693;
		this.recDot.y = 34;
		
		this.addChild(this.gameLayer);
		this.addChild(this.uiLayer);
		this.uiLayer.addChild(this.recDot);
		this.CreateFan();
		
		this.character.gameLevel = this.gameLevel;
		
		this.gameLayer.addChild(this.gameLevel);
		this.character.SetPosition(this.gameLevel.startBrick);
		this.gameLevel.SetPlayer(this.character);
		
		this.btnExecute = new RoboCommand(RoboCommand.EXECUTE, true);
		this.btnForward = new RoboCommand(RoboCommand.FORWARD, true);
		this.btnLeft = new RoboCommand(RoboCommand.ROTATE_LEFT, true);
		this.btnRight = new RoboCommand(RoboCommand.ROTATE_RIGHT, true);
		this.btnUse = new RoboCommand(RoboCommand.USE, true);
		
		this.uiLayer.addChild(this.btnLeft);
		this.uiLayer.addChild(this.btnForward);
		this.uiLayer.addChild(this.btnRight);
		this.uiLayer.addChild(this.btnUse);
		this.uiLayer.addChild(this.btnExecute);
		
		this.btnLeft.x = 35;
		this.btnLeft.y = 408;
		this.btnForward.x = this.btnLeft.x + this.btnLeft.width + 5;
		this.btnForward.y = this.btnLeft.y;
		this.btnRight.x = this.btnForward.x + this.btnForward.width + 5;
		this.btnRight.y = this.btnLeft.y;
		this.btnUse.x = this.btnForward.x - 3;
		this.btnUse.y = this.btnForward.y - this.btnUse.height - 5;
		
		this.btnExecute.x = this.btnForward.x;
		this.btnExecute.y = this.btnForward.y + this.btnForward.height + 5;
		
		//uiLayer.graphics.beginFill(0xffffff, 0.7);
		//uiLayer.graphics.drawRect(0, 430, uiLayer.width + 10, uiLayer.height + 10);
		
		this.commandList = new CommandList();
		this.uiLayer.addChild(this.commandList);
		this.commandList.x = 73;
		this.commandList.y = this.stage.stageHeight - this.commandList.height - 18;
		
		this.backBtn = new Sprite();
		let bmp: Bitmap = Content.GetBitmap("endBtnNext");
		bmp.scaleX = -1;
		this.backBtn.addChild(bmp);
		this.addChild(this.backBtn);
		this.backBtn.addEventListener(MouseEvent.CLICK, this.onMenuClick);
		this.backBtn.buttonMode = true;
		
		this.backBtn.x = 10 + this.backBtn.width;
		this.backBtn.y = 10;
		
		this.sounds = AppFacade.GetInstance().retrieveProxy(Sounds.NAME) as Sounds;
	}
	
	public CreateFan(): void {
		this.fanSprite = new Sprite();
		let bmp: Bitmap = Content.GetBitmap("fan");
		this.fanSprite.addChild(bmp);
		bmp.x = -bmp.width / 2;
		bmp.y = -bmp.height / 2;
		
		this.addChild(this.fanSprite);
		this.fanSprite.x = 872;
		this.fanSprite.y = 78;
		
		this.fanSpeed = 0;
		this.StopFan();
	}
	
	public CreateComCount(): void {
		let tf: TextFormat = new TextFormat("8bit", 27, 0xFFA63D);
		this.comCount.defaultTextFormat = tf;
		this.comCount.autoSize = TextFieldAutoSize.LEFT;
		this.comCount.x = 727;
		this.comCount.y = 30;
		this.comCount.text = "0";
		this.comCount.embedFonts = true;
		this.comCount.selectable = false;
		
		this.uiLayer.addChild(this.comCount);

		this.lvlLabel = new TextField();
		tf.size = 20;
		this.lvlLabel.defaultTextFormat = tf;
		this.lvlLabel.autoSize = TextFieldAutoSize.LEFT;
		this.lvlLabel.x = 80;
		this.lvlLabel.y = 25;
		this.lvlLabel.text = "PLANSZA NR " + (this.currentLevel + 1);
		this.lvlLabel.embedFonts = true;
		this.lvlLabel.selectable = false;
		this.lvlLabel.filters = [new DropShadowFilter(0,0,0,1,6,6,2)];
		this.uiLayer.addChild(this.lvlLabel);
	}
	
	public UpdateComCount(count: number): void {
		this.comCount.text = count.toString();
	}
	
	public UpdateFan(e: Event): void {
		this.fanSprite.rotation += this.fanSpeed;
		//if (fanSpeed > 0.5 && fanSprite.filters.length == 0) {
		//fanSprite.filters = [new BlurFilter()];
		//} else if (fanSprite.filters.length > 0) {
		//fanSprite.filters = [];
		//}
	}
	
	public StartFan(): void {
		TweenLite.to(this, 3, {fanSpeed: 19});
		this.recDot.alpha = 0;
	}
	
	public StopFan(): void {
		TweenLite.to(this, 1, {fanSpeed: 0.4});
		this.recDot.alpha = 1;
	}
	
	public ShowEndPopup(moves: number, stars: number, nextVisible: boolean): void {
		let overlay: Sprite = new Sprite();
		overlay.graphics.beginFill(0xffffff, 0.3);
		overlay.graphics.drawRect(0, 0, this.stage.stageWidth, this.stage.stageHeight);
		this.addChild(overlay);
		overlay.alpha = 0;
		TweenLite.to(overlay, 1.5, { alpha:1 } );
		
		this.endPopup = new Sprite();
		this.endPopup.addChild(Content.GetBitmap("endPopup"));
		this.addChild(this.endPopup);
		this.endPopup.x = this.stage.stageWidth / 2 - this.endPopup.width / 2;
		this.endPopup.y = this.stage.stageHeight / 2 - this.endPopup.height / 2 - 50;
		
		this.btnMenu = new Sprite();
		this.btnMenu.addChild(Content.GetBitmap("endBtnMenu"));
		this.btnMenu.x = 278 - 70;
		this.btnMenu.y = 222 - 50;
		this.btnMenu.buttonMode = true;
		this.btnMenu.addEventListener(MouseEvent.CLICK, this.onMenuClick);
		this.endPopup.addChild(this.btnMenu);
		
		this.btnReplay = new Sprite();
		this.btnReplay.addChild(Content.GetBitmap("endBtnReplay"));
		this.btnReplay.x = 345 - 70;
		this.btnReplay.y = 222 - 50;
		this.btnReplay.buttonMode = true;
		this.btnReplay.addEventListener(MouseEvent.CLICK, this.onReplayClick);
		this.endPopup.addChild(this.btnReplay);
		
		let s1: Bitmap = Content.GetBitmap("star");
		s1.x = 210;
		s1.y = 75;
		this.endPopup.addChild(s1);
		if (stars >= 2) {
			let s2: Bitmap = Content.GetBitmap("star");
			s2.x = 270;
			s2.y = 75;
			this.endPopup.addChild(s2);
		}
		if (stars >= 3) {
			let s3: Bitmap = Content.GetBitmap("star");
			s3.x = 330;
			s3.y = 75;
			this.endPopup.addChild(s3);
		}
		
		let txt: TextField = new TextField();
		let tf: TextFormat = new TextFormat("8bit", 18, 0xFEF056);
		txt.defaultTextFormat = tf;
		txt.autoSize = TextFieldAutoSize.LEFT;
		txt.text = moves + " ";
		if (moves == 1) {
			txt.appendText("KOMENDA");
		} else if (moves > 1 && moves < 5) {
			txt.appendText("KOMENDY");
		} else {
			txt.appendText("KOMEND");
		}
		
		txt.embedFonts = true;
		txt.mouseEnabled = false;
		this.endPopup.addChild(txt);
		txt.x = 305 - txt.width / 2;
		txt.y = 130;
		
		if (nextVisible) {
			this.btnNext = new Sprite();
			this.btnNext.addChild(Content.GetBitmap("endBtnNext"));
			this.btnNext.x = 411 - 70;
			this.btnNext.y = 222 - 50;
			this.btnNext.buttonMode = true;
			this.btnNext.addEventListener(MouseEvent.CLICK, this.onNextClick);
			this.endPopup.addChild(this.btnNext);
		}
		this.endPopup.alpha = 0;
		TweenLite.to(this.endPopup, 0.5, { alpha:1, delay: 1.5 } );
	}
	
	public Show(): void {
		this.character.AnimateIn();
	}
	
	public Hide(onHidden: Function): void {
		// create 2 black boxes on top and bot, and grow them. 
		let boxTop: Sprite = new Sprite();
		let boxBot: Sprite = new Sprite();
		
		boxTop.graphics.beginFill(0);
		boxBot.graphics.beginFill(0);
		boxTop.graphics.drawRect(0, 0, this.stage.stageWidth, 1);
		boxBot.graphics.drawRect(0, 0, this.stage.stageWidth, 1);
		
		this.addChild(boxTop);
		this.addChild(boxBot);
		boxTop.y = -1;
		boxBot.y = this.stage.stageHeight + 1;
		
		TweenLite.to(boxTop, 0.5, {height: this.stage.stageHeight / 2});
		TweenLite.to(boxBot, 0.5, {height: this.stage.stageHeight / 2, y: this.stage.stageHeight / 2, onComplete: onHidden});
	}
	
	public onMenuClick(e: Event): void {
		this.sounds.EffectClick();
		AppFacade.GetInstance().sendNotification(Events.NAVIGATION_CHOOSE_LEVEL, this.stage, (this.currentLevel / 20 + 1).toString());
	}
	
	public onNextClick(e: Event): void {
		this.sounds.EffectClick();
		AppFacade.GetInstance().sendNotification(Events.MENU_LEVEL_SELECTED, this.stage, (this.currentLevel+1).toString());
	}
	
	public onReplayClick(e: Event): void {
		this.sounds.EffectClick();
		AppFacade.GetInstance().sendNotification(Events.GAME_RESET_LEVEL, this.stage);
	}
}
