import { Circ } from "@edugames/common/com/greensock/easing/Circ.js";
import { TweenLite } from "@edugames/common/com/greensock/TweenLite.js";
import { Bitmap } from "@edugames/common/flash/display/Bitmap.js";
import { Sprite } from "@edugames/common/flash/display/Sprite.js";
import { Event } from "@edugames/common/flash/events/Event.js";
import { MouseEvent } from "@edugames/common/flash/events/MouseEvent.js";
import { AppFacade } from "../AppFacade.js";
import { Content } from "../Content.js";
import { Events } from "../Events.js";
import { RaceSummaryLogic } from "../Mediators/RaceSummaryLogic.js";
import type { GameData } from "../Proxies/GameData.js";
import { SummaryMap } from "./SummaryMap.js";

/**
 * ...
 * @author Michal Perzak
 */
export class RaceSummaryScreen extends Sprite {
	public bg: Bitmap;
	public map: SummaryMap;
	public gameData: GameData;
	
	public backBtn: Sprite;
	
	constructor(gameData: GameData) {
		super();
		this.gameData = gameData;
		
		this.addEventListener(Event.ADDED_TO_STAGE, this.onAdded);
	}
	
	private onAdded(e: Event): void {
		this.bg = Content.GetBitmap("menuBg");
		this.addChild(this.bg);
		
		let overlay: Sprite = new Sprite();
		overlay.graphics.beginFill(0xffffff, 0.7);
		overlay.graphics.drawRect(0, 0, this.stage.stageWidth, this.stage.stageHeight);
		this.addChild(overlay);
		
		this.map = new SummaryMap();
		this.addChild(this.map);
		
		this.map.x = this.stage.stageWidth;
		this.map.y = 20;
		
		this.backBtn = new Sprite();
		this.backBtn.addChild(Content.GetBitmap("backBtn"));
		this.backBtn.addEventListener(MouseEvent.CLICK, this.onBack);
		this.backBtn.buttonMode = true;
		this.backBtn.x = 15;
		this.backBtn.y = this.stage.height - this.backBtn.height - 130;
		this.addChild(this.backBtn)

		TweenLite.to(this.map, 0.9, {x: this.stage.stageWidth / 2 - this.map.width / 2, ease: Circ.easeOut});
		this.InitRaceButtons();
	}
	
	private onClick(e: MouseEvent): void {
		AppFacade.GetInstance().sendNotification(Events.GAME_SUMMARY_NEXT);
	}
	
	private onBack(e: MouseEvent): void {
		AppFacade.GetInstance().sendNotification(Events.GAME_CYCLE_SCREENS, AppFacade.GetInstance().retrieveMediator(RaceSummaryLogic.NAME), "menu");
	}
	
	private InitRaceButtons(): void {
		let scores: any[] = this.gameData.tournamentResults[this.gameData.currentTournament];
		this.map.SetScores(scores[0], scores[1], scores[2], scores[3]);
	}
	
	private OnRaceSelected(e: MouseEvent): void {
		let btn: Sprite = e.currentTarget as Sprite;
		if (btn) {
			AppFacade.GetInstance().sendNotification(Events.MENU_RACE_SELECTED, Number(btn.name) | 0);
		}
	}
}
