import { Bitmap } from "@edugames/common/flash/display/Bitmap.js";
import { Sprite } from "@edugames/common/flash/display/Sprite.js";
import { Event } from "@edugames/common/flash/events/Event.js";
import { MouseEvent } from "@edugames/common/flash/events/MouseEvent.js";
import { embed } from "@edugames/common/AssetLoader.js";
import type { Class } from "@edugames/common/flash/utils/Class.js";
//import Achievements.GardenMediator; // PORT: achievements TODO
import { AppFacade } from "../AppFacade.js";
import { Content } from "../Content.js";
import { Events } from "../Events.js";
import { SoundPanel } from "./SoundPanel.js";

/**
 * ...
 * @author Perz
 */
export class MenuView extends Sprite{
	// PORT: instance embeds hoisted to static, so they register at module load
	private static projectLogoBmp: Class = embed("Assets/Logo_GwK.png");
	private static euLogoBmp: Class = embed("Assets/Logo_eu.png");
	
	private static btnArcadeImg: Class = embed("Assets/btnArcade.png");
	private static btnGardenImg: Class = embed("Assets/btnGarden.png");
	
	
	public euLogo: Bitmap;
	public projectLogo: Sprite;
	public bg: Bitmap;
	
	public btnArcade: Sprite;
	public btnGarden: Sprite;
	public soundPanel: SoundPanel;
	
	constructor() {
		super();
		this.euLogo = new MenuView.euLogoBmp();
		
		this.projectLogo = new Sprite();
		//var projLogo:Bitmap = new projectLogoBmp();
		//projLogo.smoothing = true;
		//projectLogo.addChild(projLogo);
		this.projectLogo.graphics.beginFill(0, 0);
		this.projectLogo.graphics.drawRect(0, 0, 110, 110);
		
		this.bg = Content.GetBitmap("bgBmp");
		this.soundPanel = new SoundPanel();
		
		this.euLogo.smoothing = true;
		this.bg.smoothing = true;
		let bmp: Bitmap = new MenuView.btnArcadeImg();
		bmp.smoothing = true;
		this.btnArcade = new Sprite();
		this.btnArcade.addChild(bmp);
		this.btnGarden = new Sprite();
		bmp = new MenuView.btnGardenImg();
		bmp.smoothing = true;
		this.btnGarden.addChild(bmp);
		
		this.btnArcade.buttonMode = true;
		this.btnGarden.buttonMode = true;
		
		this.addChild(this.bg);
		this.addChild(this.projectLogo);

		this.addChild(this.btnArcade);
		this.addChild(this.btnGarden);
		
		this.soundPanel.x = 10;
		this.soundPanel.y = 450;
		this.addChild(this.soundPanel);
		
		this.addEventListener(Event.ADDED_TO_STAGE, this.OnAdded);
	}
	
	private OnAdded(e: Event): void {
		this.euLogo.width = this.stage.stageWidth;
		this.euLogo.height = this.euLogo.scaleX * this.euLogo.height;
		this.euLogo.x = 0;
		this.euLogo.y = this.stage.stageHeight - this.euLogo.height;
		this.euLogo.alpha = 0.8;
		
		this.projectLogo.x = this.stage.stageWidth - this.projectLogo.width; //10;
		this.projectLogo.y = 0;//euLogo.y - 10 - projectLogo.height;
		this.projectLogo.buttonMode = true;
		
		this.bg.width = this.stage.stageWidth;
		this.bg.height = this.stage.stageHeight;
		
		this.btnArcade.x = 725;
		this.btnArcade.y = 325;
		
		this.btnGarden.x = 856;
		this.btnGarden.y = 382;
		
		this.btnArcade.addEventListener(MouseEvent.CLICK, this.OnArcade);
		this.btnGarden.addEventListener(MouseEvent.CLICK, this.OnGarden);
		
		this.projectLogo.addEventListener(MouseEvent.CLICK, this.OnProjectLogo);
		//Debug();
	}
	
	private OnArcade(e: Event): void {
		this.soundPanel.soundProxy.EffectClick();
		AppFacade.GetInstance().sendNotification(Events.NAVIGATION_CHOOSE_DIF, this.stage);
	}
	
	private OnGarden(e: Event): void {
		this.soundPanel.soundProxy.EffectClick();
		//AppFacade.GetInstance().registerMediator(new GardenMediator(stage));
		//AppFacade.GetInstance().sendNotification(Events.NAVIGATION_GAME_ARCADE, stage);
		// PORT: achievements TODO
		//AppFacade.GetInstance().registerMediator(new GardenMediator(stage));
	}

	private OnAchievement(e: Event): void {
		this.soundPanel.soundProxy.EffectClick();
		//AppFacade.GetInstance().sendNotification(Events.NAVIGATION_GAME_ARCADE, stage);
	}
	
	private OnProjectLogo(e: Event): void {
		this.soundPanel.soundProxy.EffectClick();
		AppFacade.GetInstance().sendNotification(Events.NAVIGATION_URL, "http://www.grawklasy.edu.pl/");
	}
}
