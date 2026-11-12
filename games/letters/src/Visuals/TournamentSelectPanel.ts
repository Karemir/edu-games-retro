import { embed } from "@edugames/common/AssetLoader.js";
import { TweenLite } from "@edugames/common/com/greensock/TweenLite.js";
import { Bitmap } from "@edugames/common/flash/display/Bitmap.js";
import { Sprite } from "@edugames/common/flash/display/Sprite.js";
import { Event } from "@edugames/common/flash/events/Event.js";
import { MouseEvent } from "@edugames/common/flash/events/MouseEvent.js";
import { TextField } from "@edugames/common/flash/text/TextField.js";
import type { Class } from "@edugames/common/flash/utils/Class.js";
import { AppFacade } from "../AppFacade.js";
import { Content } from "../Content.js";
import { Events } from "../Events.js";
import { MenuMediator } from "../Mediators/MenuMediator.js";
import { GameData } from "../Proxies/GameData.js";
import { Sounds } from "../Proxies/Sounds.js";
import { TextStyles } from "../TextStyles.js";
import { TextButton } from "./TextButton.js";

/**
 * ...
 * @author Michal Perzak
 */
export class TournamentSelectPanel extends Sprite {
	// PORT: [Embed] fields registered with the AssetLoader, paths relative to index.html
	private static bgBmp: Class = embed("Assets/raceBg.png");
	private static race1Bmp: Class = embed("Assets/race1Btn.png");
	private static race2Bmp: Class = embed("Assets/race2Btn.png");
	private static race3Bmp: Class = embed("Assets/race3Btn.png");
	
	public bg: Bitmap;
	public race1Btn: Sprite;
	public race2Btn: Sprite;
	public race3Btn: Sprite;
	public backBtn: Sprite;
	
	public txtProgress: TextField;
	public gameData: GameData;
	
	public onTournamentSelect: Function;
	
	constructor(onSelect: Function) {
		super();
		this.gameData = AppFacade.GetInstance().retrieveProxy(GameData.NAME) as GameData;
		this.onTournamentSelect = onSelect;
		this.bg = new TournamentSelectPanel.bgBmp();
		this.bg.smoothing = true;
		this.race1Btn = new TextButton("", new TournamentSelectPanel.race1Bmp());
		this.race2Btn = new TextButton("", new TournamentSelectPanel.race2Bmp());
		this.race3Btn = new TextButton("", new TournamentSelectPanel.race3Bmp());
		
		this.addChild(this.bg);
	
		this.txtProgress = TextStyles.CreateBoldText(this.gameData.GetTotalCompletion() + "%", 0x799f1c);
		this.txtProgress.x = 236;
		this.txtProgress.y = 315;
		this.addChild(this.txtProgress);
		
		this.race1Btn.x = 320;
		this.race1Btn.y = 33;
		this.race1Btn.name = "0";
		this.race2Btn.x = 455;
		this.race2Btn.y = 33;
		this.race2Btn.name = "1";
		this.race3Btn.x = 590;
		this.race3Btn.y = 25;
		this.race3Btn.name = "2";
		
		this.race1Btn.addEventListener(MouseEvent.CLICK, this.OnSelected);
		this.race2Btn.addEventListener(MouseEvent.CLICK, this.OnSelected);
		this.race3Btn.addEventListener(MouseEvent.CLICK, this.OnSelected);

		this.addEventListener(Event.ADDED_TO_STAGE, this.onAdded);
	}
		
	public onAdded(e: Event): void {			
		this.backBtn = new Sprite();
		this.backBtn.addChild(Content.GetBitmap("backBtn"));
		this.backBtn.addEventListener(MouseEvent.CLICK, this.OnBack);
		this.backBtn.buttonMode = true;
		this.backBtn.x = -25;
		this.backBtn.y = this.stage.height - this.backBtn.height - 140;
		this.backBtn.alpha = 0;
		TweenLite.to(this.backBtn, 0.5, { alpha: 1, delay:1 } );
		this.addChild(this.backBtn)
		
		this.ShowTournaments();
		this.ShowPrizes();
	}
	
	private ShowTournaments(): void {
		if (this.gameData.tournamentStatuses[2] >= GameData.TOURNAMENT_AVAILABLE) {
			this.addChild(this.race3Btn);
		}
		if (this.gameData.tournamentStatuses[1] >= GameData.TOURNAMENT_AVAILABLE) {
			this.addChild(this.race2Btn);
		}
		if (this.gameData.tournamentStatuses[0] >= GameData.TOURNAMENT_AVAILABLE) {
			this.addChild(this.race1Btn);
		}
	}
	
	private ShowPrizes(): void {
		if (this.gameData.tournamentStatuses[0] == GameData.TOURNAMENT_WON) {
			let p1: Bitmap = Content.GetBitmap("PrizeBig");
			p1.x = 61;
			p1.y = 255;
			this.race1Btn.addChild(p1);
		}

		if (this.gameData.tournamentStatuses[1] == GameData.TOURNAMENT_WON) {
			let p2: Bitmap = Content.GetBitmap("PrizeBig");
			p2.x = 61;
			p2.y = 255;
			this.race2Btn.addChild(p2);
		}
		
		if (this.gameData.tournamentStatuses[2] == GameData.TOURNAMENT_WON) {
			let p3: Bitmap = Content.GetBitmap("PrizeBig");
			p3.x = 61;
			p3.y = 255;
			this.race3Btn.addChild(p3);
		}
	}
	
	private OnSelected(e: Event): void {
		Sounds.MenuClickSound();
		let trg: Sprite = e.currentTarget as Sprite;
		this.onTournamentSelect(trg.name);
	}
	
	private OnBack(e: Event): void {
		Sounds.MenuClickSound();
		AppFacade.GetInstance().sendNotification(Events.NAVIGATE_MAIN_MENU, this.stage, MenuMediator.NAME);
	}
}
