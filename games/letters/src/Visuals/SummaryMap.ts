import { embed } from "@edugames/common/AssetLoader.js";
import { TweenLite } from "@edugames/common/com/greensock/TweenLite.js";
import type { Bitmap } from "@edugames/common/flash/display/Bitmap.js";
import { Sprite } from "@edugames/common/flash/display/Sprite.js";
import type { Event } from "@edugames/common/flash/events/Event.js";
import { MouseEvent } from "@edugames/common/flash/events/MouseEvent.js";
import type { TextField } from "@edugames/common/flash/text/TextField.js";
import type { Class } from "@edugames/common/flash/utils/Class.js";
import { AppFacade } from "../AppFacade.js";
import { Content } from "../Content.js";
import { Events } from "../Events.js";
import { Logger } from "../Logger.js";
import { GameData } from "../Proxies/GameData.js";
import { Sounds } from "../Proxies/Sounds.js";
import { TextStyles } from "../TextStyles.js";

/**
 * ...
 * @author Michal Perzak
 */
export class SummaryMap extends Sprite {
	// PORT: instance embed hoisted to static
	private static mapCl: Class = embed("Assets/raceTracksScreen.png");
	
	public map: Bitmap;
	
	public race1Score: TextField;
	public race2Score: TextField;
	public race3Score: TextField;
	public race4Score: TextField;
	
	public race1Btn: Sprite;
	public race2Btn: Sprite;
	public race3Btn: Sprite;
	public race4Btn: Sprite;
	public nextRaceBtn: Sprite;
	public popup: Sprite;
	
	public selectedRace: string;
	
	constructor() {
		super();
		this.map = new SummaryMap.mapCl() as Bitmap;
		this.map.smoothing = true;
		this.addChild(this.map);
		
		this.race1Btn = new Sprite();
		this.race1Btn.addChild(Content.GetBitmap("tick"));
		this.race2Btn = new Sprite();
		this.race2Btn.addChild(Content.GetBitmap("tick"));
		this.race3Btn = new Sprite();
		this.race3Btn.addChild(Content.GetBitmap("tick"));
		this.race4Btn = new Sprite();
		this.race4Btn.addChild(Content.GetBitmap("tick"));
		
		this.race1Score = TextStyles.CreateSummaryRaceScore("100", 0x799f1c);
		this.race2Score = TextStyles.CreateSummaryRaceScore("100", 0x799f1c);
		this.race3Score = TextStyles.CreateSummaryRaceScore("100", 0x799f1c);
		this.race4Score = TextStyles.CreateSummaryRaceScore("100", 0x799f1c);
		
		this.nextRaceBtn = new Sprite();
		this.nextRaceBtn.addChild(Content.GetBitmap("raceStartBtn"));
		this.addChild(this.nextRaceBtn);
		this.nextRaceBtn.addEventListener(MouseEvent.CLICK, this.onNext);
		this.nextRaceBtn.buttonMode = true;
		
		this.nextRaceBtn.x = 100;
		this.nextRaceBtn.y = 290;
		
		this.addChild(this.race1Btn);
		this.addChild(this.race1Score);
		this.addChild(this.race2Btn);
		this.addChild(this.race2Score);
		this.addChild(this.race3Btn);
		this.addChild(this.race3Score);
		this.addChild(this.race4Btn);
		this.addChild(this.race4Score);
		
		this.race1Btn.x = 288;
		this.race1Btn.y = 118;
		this.race1Btn.name = "0";
		this.race2Btn.x = 308;
		this.race2Btn.y = 211;
		this.race2Btn.name = "1";
		this.race3Btn.x = 390;
		this.race3Btn.y = 278;
		this.race3Btn.name = "2";
		this.race4Btn.x = 470;
		this.race4Btn.y = 233;
		this.race4Btn.name = "3";
		
		this.race1Score.x = 631;
		this.race1Score.y = 175;
		this.race2Score.x = 631;
		this.race2Score.y = 232;
		this.race3Score.x = 631;
		this.race3Score.y = 289;
		this.race4Score.x = 631;
		this.race4Score.y = 346;
		
		this.race1Btn.buttonMode = true;
		this.race2Btn.buttonMode = true;
		this.race3Btn.buttonMode = true;
		this.race4Btn.buttonMode = true;
		
		this.race1Btn.addEventListener(MouseEvent.MOUSE_OVER, this.onHoverIn);
		this.race1Btn.addEventListener(MouseEvent.MOUSE_OUT, this.onHoverOut);
		this.race1Btn.addEventListener(MouseEvent.CLICK, this.onClick);
		this.race2Btn.addEventListener(MouseEvent.MOUSE_OVER, this.onHoverIn);
		this.race2Btn.addEventListener(MouseEvent.MOUSE_OUT, this.onHoverOut);
		this.race2Btn.addEventListener(MouseEvent.CLICK, this.onClick);
		this.race3Btn.addEventListener(MouseEvent.MOUSE_OVER, this.onHoverIn);
		this.race3Btn.addEventListener(MouseEvent.MOUSE_OUT, this.onHoverOut);
		this.race3Btn.addEventListener(MouseEvent.CLICK, this.onClick);
		this.race4Btn.addEventListener(MouseEvent.MOUSE_OVER, this.onHoverIn);
		this.race4Btn.addEventListener(MouseEvent.MOUSE_OUT, this.onHoverOut);
		this.race4Btn.addEventListener(MouseEvent.CLICK, this.onClick);
	}
	
	public SetScores(r1: number, r2: number, r3: number, r4: number): void {
		this.race1Score.text = r1 + "";
		this.race2Score.text = r2 + "";
		this.race3Score.text = r3 + "";
		this.race4Score.text = r4 + "";
		this.selectedRace = this.race1Btn.name;
		
		if (r4 == GameData.SCORING[0]) {
			var p4: Bitmap = Content.GetBitmap("PrizeSmall");
			p4.x = this.race4Btn.width / 2;
			p4.y = this.race4Btn.height / 2;
			p4.width = 36;
			p4.height = 42;
			this.race4Btn.addChild(p4);
			this.race4Btn.tabIndex = 4; // .mouseEnabled = false;
		} else {
			this.selectedRace = this.race4Btn.name;
		}
		if (r3 == GameData.SCORING[0]) {
			var p3: Bitmap = Content.GetBitmap("PrizeSmall");
			p3.x = this.race3Btn.width / 2;
			p3.y = this.race3Btn.height / 2;
			p3.width = 36;
			p3.height = 42;
			this.race3Btn.addChild(p3);
			this.race3Btn.tabIndex = 3; // .mouseEnabled = false;
		} else {
			this.selectedRace = this.race3Btn.name;
		}
		if (r2 == GameData.SCORING[0]) {
			var p2: Bitmap = Content.GetBitmap("PrizeSmall");
			p2.x = this.race2Btn.width / 2;
			p2.y = this.race2Btn.height / 2;
			p2.width = 36;
			p2.height = 42;
			this.race2Btn.addChild(p2);
			this.race2Btn.tabIndex = 2; // .mouseEnabled = false;
		} else {
			this.selectedRace = this.race2Btn.name;
		}
		
		if (r1 == GameData.SCORING[0]) {
			var p1: Bitmap = Content.GetBitmap("PrizeSmall");
			p1.x = this.race1Btn.width / 2;
			p1.y = this.race1Btn.height / 2;
			p1.width = 36;
			p1.height = 42;
			this.race1Btn.addChild(p1);
			this.race1Btn.tabIndex = 1;// .mouseEnabled = false;
		} else {
			this.selectedRace = this.race1Btn.name;
		}
		
		this.selectTrack(this.selectedRace);
	}
	
	private onHoverIn(e: Event): void {
		var img: Sprite = e.currentTarget as Sprite;
		img.getChildAt(0).alpha = 0.7;
		Logger.Log(img.name);
	}
	
	private onHoverOut(e: Event): void {
		var img: Sprite = e.currentTarget as Sprite;
		if(this.selectedRace != img.name){
			img.getChildAt(0).alpha = 0;
		}
	}
	
	private onClick(e: Event): void {
		Sounds.MenuClickSound();
		var img: Sprite = e.currentTarget as Sprite;
		this.selectTrack(img.name);
		//AppFacade.GetInstance().sendNotification(Events.MENU_RACE_SELECTED, img.name);
	}
	
	private selectTrack(trackId: string): void {
		this.race1Btn.getChildAt(0).alpha = 0;
		this.race2Btn.getChildAt(0).alpha = 0;
		this.race3Btn.getChildAt(0).alpha = 0;
		this.race4Btn.getChildAt(0).alpha = 0;
		this.selectedRace = trackId;
		var img: Sprite = this.getChildByName(trackId) as Sprite;
		img.getChildAt(0).alpha = 1;
		
		if (img.name == "2") {
			this.ShowPopup(img.x + 10, img.y + 60);
		} else {
			this.ShowPopup(img.x + 10, img.y - 30);
		}
	}
	
	private onNext(e: Event): void {
		Sounds.MenuClickSound();
		if (!this.selectedRace || this.selectedRace.length == 0) return;
		AppFacade.GetInstance().sendNotification(Events.MENU_RACE_SELECTED, this.selectedRace);
	}
	
	private ShowPopup(x: number, y: number): void {
		if (this.popup) {
			var tmp: Sprite = this.popup;
			TweenLite.to(tmp, 0.3, { alpha:0, onComplete: () => { this.removeChild(tmp); }} ); // PORT: arrow function, the closure uses members
			this.popup = null;
		}
		var popbmp: Bitmap = Content.GetBitmap("race" + this.selectedRace + "Name");
		this.popup = new Sprite();
		this.popup.addChild(popbmp);
		this.popup.alpha = 0;
		this.popup.x = x - this.popup.width / 2;
		this.popup.y = y - this.popup.height / 2;
		this.addChild(this.popup);
		TweenLite.to(this.popup, 0.4, { alpha:1 } );
	}
}
