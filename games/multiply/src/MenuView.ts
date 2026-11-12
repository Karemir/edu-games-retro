// PORT: achievements TODO: import { GardenMediator } from "./Achievements/GardenMediator.js";
import { embed } from "@edugames/common/AssetLoader.js";
import { Bitmap } from "@edugames/common/flash/display/Bitmap.js";
import { Sprite } from "@edugames/common/flash/display/Sprite.js";
import { Event } from "@edugames/common/flash/events/Event.js";
import { MouseEvent } from "@edugames/common/flash/events/MouseEvent.js";
import type { Class } from "@edugames/common/flash/utils/Class.js";
import { AppFacade } from "./AppFacade.js";
import { Content } from "./Content.js";
import { Events } from "./Events.js";
import { SoundPanel } from "./VisualParts/SoundPanel.js";
import { TextButton } from "./VisualParts/TextButton.js";
import { TowerBlock } from "./VisualParts/TowerBlock.js";
import { TowerBlockAddon } from "./VisualParts/TowerBlockAddon.js";
import { TowerRoof } from "./VisualParts/TowerRoof.js";
/**
 * ...
 * @author Perz
 */
export class MenuView extends Sprite{
	
	// PORT: [Embed] fields registered with the AssetLoader, paths relative to index.html (were instance fields)
	private static btnArcadeImg: Class = embed("Assets/btnArcade.png");
	private static btnFreeplayImg: Class = embed("Assets/btnFreeplay.png");
	private static btnGardenImg: Class = embed("Assets/btnGarden.png");
	
	public projectLogo: Sprite;
	public bg: Bitmap;
	
	public btnArcade: TextButton;
	public btnFreeplay: TextButton;
	public btnGarden: TextButton;
	public soundPanel: SoundPanel;
	
	constructor() {
		super();
		
		this.projectLogo = new Sprite();
		this.projectLogo.graphics.beginFill(0, 0);
		this.projectLogo.graphics.drawRect(0, 0, 110, 110);
		
		this.bg = Content.GetBmp("bgBmp");
		this.soundPanel = new SoundPanel();
		
		let bmp: Bitmap = new MenuView.btnArcadeImg();
		bmp.smoothing = true;
		this.btnArcade = new TextButton(null, bmp);

		bmp = new MenuView.btnFreeplayImg();
		bmp.smoothing = true;
		this.btnFreeplay = new TextButton(null, bmp);
		let gardenBmp: Bitmap =  new MenuView.btnGardenImg();
		gardenBmp.smoothing = true;
		this.btnGarden = new TextButton(null, gardenBmp);
		
		this.addChild(this.bg);
		this.addChild(this.projectLogo);

		this.addChild(this.btnArcade);
		this.addChild(this.btnFreeplay);
		this.addChild(this.btnGarden);
		
		this.soundPanel.x = 10;
		this.soundPanel.y = 450;
		this.addChild(this.soundPanel);
		
		this.addEventListener(Event.ADDED_TO_STAGE, this.OnAdded);
	}
	
	private OnAdded(e: Event): void {
		this.projectLogo.x = this.stage.stageWidth - this.projectLogo.width; //10;
		this.projectLogo.y = 0;//euLogo.y - 10 - projectLogo.height;
		this.projectLogo.buttonMode = true;
		
		this.bg.width = this.stage.stageWidth;
		this.bg.height = this.stage.stageHeight;
		
		this.btnArcade.x = 495;
		this.btnArcade.y = 330;
		this.btnFreeplay.x = 626;
		this.btnFreeplay.y = 330;
		
		this.btnGarden.x = 856;
		this.btnGarden.y = 382;

		this.btnArcade.addEventListener(MouseEvent.CLICK, this.OnArcade);
		this.btnFreeplay.addEventListener(MouseEvent.CLICK, this.OnFreeplay);
		this.btnGarden.addEventListener(MouseEvent.CLICK, this.OnGarden);
		
		this.projectLogo.addEventListener(MouseEvent.CLICK, this.OnProjectLogo);
		
		//Debug();
	}
	
	private Debug(): void {
		for (let i: number = TowerBlock.TYPE_A; i <= TowerBlock.TYPE_D; ++i) {
			for (let j: number = 0; j < TowerBlockAddon.GetAddonCount(i); ++j) {
				let t: TowerBlock = new TowerBlock(i, 0);
				t.x = 200 * i;
				t.y = 100 * j + 90;
				this.addChild(t);
				
				let ad: TowerBlockAddon = new TowerBlockAddon(t, j);
				ad.Show();
			}
		}
	}
	
	private OnArcade(e: Event): void {
		this.soundPanel.soundProxy.EffectClick();
		AppFacade.GetInstance().sendNotification(Events.NAVIGATION_GAME_ARCADE, this.stage);
	}
	
	private OnFreeplay(e: Event): void {
		this.soundPanel.soundProxy.EffectClick();
		AppFacade.GetInstance().sendNotification(Events.NAVIGATION_GAME_FREEPLAY, this.stage);
	}
	
	private OnGarden(e: Event): void {
		this.soundPanel.soundProxy.EffectClick();
		// PORT: achievements TODO
		//AppFacade.GetInstance().registerMediator(new GardenMediator(stage));
		//AppFacade.GetInstance().sendNotification(Events.NAVIGATION_GAME_ARCADE, stage);
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
