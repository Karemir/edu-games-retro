import { embed } from "@edugames/common/AssetLoader.js";
import { Bitmap } from "@edugames/common/flash/display/Bitmap.js";
import { Sprite } from "@edugames/common/flash/display/Sprite.js";
import { Event } from "@edugames/common/flash/events/Event.js";
import { MouseEvent } from "@edugames/common/flash/events/MouseEvent.js";
import { TextField } from "@edugames/common/flash/text/TextField.js";
import { Keyboard } from "@edugames/common/flash/ui/Keyboard.js";
import type { Class } from "@edugames/common/flash/utils/Class.js";
import { AppFacade } from "../AppFacade.js";
import { Events } from "../Events.js";
import { Sounds } from "../Proxies/Sounds.js";
import { TextStyles } from "../TextStyles.js";
import { TextButton } from "./TextButton.js";

/**
 *
 * @author Perzka Michalowy
 */
export class NewGameSelectionPanel extends Sprite {
	// PORT: [Embed] fields registered with the AssetLoader, paths relative to index.html
	private static imgBg: Class = embed("Assets/startGameBg.png");
	private static imgChoose: Class = embed("Assets/chooseVehicleBtn.png");
	private static imgTick: Class = embed("Assets/tickRed.png");
	
	public btnAccept: TextButton;
	public txtInputName: TextField;
	public inputCaret: Sprite;
	public sounds: Sounds;
		
	public playerName: string;
	public nameTyped: boolean;
	public currentVehicleId: number;
	
	private bg: Bitmap;
	private tick: Bitmap;
	private selectVeh0: Sprite;
	private selectVeh1: Sprite;
	private selectVeh2: Sprite;
	private selectVeh3: Sprite;

	private clickVeh0: Sprite;
	private clickVeh1: Sprite;
	private clickVeh2: Sprite;
	private clickVeh3: Sprite;
	
	private rdyCallback: Function;
	
	constructor(onClick: Function) {
		super();
		this.rdyCallback = onClick;
		this.bg = new NewGameSelectionPanel.imgBg();
		this.bg.smoothing = true;
		this.btnAccept = new TextButton("", new NewGameSelectionPanel.imgChoose());
		this.tick = new NewGameSelectionPanel.imgTick();
		this.sounds = AppFacade.GetInstance().retrieveProxy(Sounds.NAME) as Sounds;
		
		this.playerName = "Twoje Imię";
		this.nameTyped = false;
		this.txtInputName = TextStyles.CreateBoldText("", 0); //0x449977);
		this.currentVehicleId = 0;
		
		this.addChild(this.bg);
		this.addChild(this.btnAccept);
		//addChild(txtInputName);
		
		this.txtInputName.y = 175;
		this.txtInputName.x = 100;
		this.txtInputName.width = 160;
		this.inputCaret = new Sprite();
		this.inputCaret.y = this.txtInputName.y;
		this.inputCaret.addEventListener(Event.ENTER_FRAME, () => { // PORT: arrow function, the closure uses members
			this.inputCaret.graphics.clear();
			this.inputCaret.graphics.beginFill(0);
			this.inputCaret.graphics.drawRect(0, 4, 2, 23);
			this.inputCaret.x = this.txtInputName.x + this.txtInputName.width; 
			this.inputCaret.alpha = ((new Date().getMilliseconds() / 250) | 0) % 2; // PORT: AS3 Date.milliseconds
		} );
		//addChild(inputCaret);
		
		this.btnAccept.y = 270;
		this.btnAccept.x = 110;
		
		this.selectVeh0 = new Sprite();
		this.selectVeh1 = new Sprite();
		this.selectVeh2 = new Sprite();
		this.selectVeh3 = new Sprite();
		this.clickVeh0 = new Sprite();
		this.clickVeh1 = new Sprite();
		this.clickVeh2 = new Sprite();
		this.clickVeh3 = new Sprite();
		
		this.selectVeh0.graphics.beginFill(0, 0);
		this.selectVeh0.graphics.drawRect(0, 0, 30, 30);
		this.selectVeh1.graphics.beginFill(0, 0);
		this.selectVeh1.graphics.drawRect(0, 0, 30, 30);
		this.selectVeh2.graphics.beginFill(0, 0);
		this.selectVeh2.graphics.drawRect(0, 0, 30, 30);
		this.selectVeh3.graphics.beginFill(0, 0);
		this.selectVeh3.graphics.drawRect(0, 0, 30, 30);
		
		this.selectVeh0.x = 476;
		this.selectVeh0.y = 189;
		this.selectVeh1.x = 461;
		this.selectVeh1.y = 346;
		this.selectVeh2.x = 703;
		this.selectVeh2.y = 200;
		this.selectVeh3.x = 669;
		this.selectVeh3.y = 345;
		
		this.clickVeh0.graphics.beginFill(0, 0);
		this.clickVeh0.graphics.drawRect(0, 0, 200, 170);
		this.clickVeh1.graphics.beginFill(0, 0);
		this.clickVeh1.graphics.drawRect(0, 0, 230, 160);
		this.clickVeh2.graphics.beginFill(0, 0);
		this.clickVeh2.graphics.drawRect(0, 0, 200, 180);
		this.clickVeh3.graphics.beginFill(0, 0);
		this.clickVeh3.graphics.drawRect(0, 0, 200, 170);

		this.clickVeh0.x = 355;
		this.clickVeh0.y = 60;
		this.clickVeh1.x = 275;
		this.clickVeh1.y = 233;
		this.clickVeh2.x = 574;
		this.clickVeh2.y = 56;
		this.clickVeh3.x = 504;
		this.clickVeh3.y = 230;
		
		this.addChild(this.selectVeh0);
		this.addChild(this.selectVeh1);
		this.addChild(this.selectVeh2);
		this.addChild(this.selectVeh3);
		this.addChild(this.clickVeh0);
		this.addChild(this.clickVeh1);
		this.addChild(this.clickVeh2);
		this.addChild(this.clickVeh3);
		this.selectVeh0.addChild(this.tick);
		
		this.selectVeh0.addEventListener(MouseEvent.CLICK, this.OnSelectClick);
		this.selectVeh1.addEventListener(MouseEvent.CLICK, this.OnSelectClick);
		this.selectVeh2.addEventListener(MouseEvent.CLICK, this.OnSelectClick);
		this.selectVeh3.addEventListener(MouseEvent.CLICK, this.OnSelectClick);
		this.clickVeh0.addEventListener(MouseEvent.CLICK, this.OnSelectClick);
		this.clickVeh1.addEventListener(MouseEvent.CLICK, this.OnSelectClick);
		this.clickVeh2.addEventListener(MouseEvent.CLICK, this.OnSelectClick);
		this.clickVeh3.addEventListener(MouseEvent.CLICK, this.OnSelectClick);
		
		this.selectVeh0.buttonMode = this.selectVeh1.buttonMode = this.selectVeh2.buttonMode = this.selectVeh3.buttonMode = true;
		this.clickVeh0.buttonMode = this.clickVeh1.buttonMode = this.clickVeh2.buttonMode = this.clickVeh3.buttonMode = true;
		
		this.UpdatePlayerName();
		
		// attach events
		this.btnAccept.addEventListener(MouseEvent.CLICK, this.OnAcceptClicked);
	}
	
	public HandleNameKey(keyCode: number): void {
		return;
		
		if (keyCode == Keyboard.ENTER) {
			this.sounds.EffectKeypress();
			this.OnAcceptClicked(null);
		} else if (keyCode == Keyboard.BACKSPACE) {
			this.sounds.EffectKeypress();
			if (this.nameTyped) {
				this.playerName = this.playerName.slice(0, this.playerName.length - 1);
			} else {
				this.playerName = "";
				this.nameTyped = true;
			}
		} else if (((keyCode >= Keyboard.A && keyCode <= Keyboard.Z) || (keyCode >= Keyboard.NUMBER_0 && keyCode <= Keyboard.NUMBER_9)) && this.playerName.length < 15) {
			this.sounds.EffectKeypress();
			if (!this.nameTyped) {
				this.playerName = "";
				this.nameTyped = true;
			}
			if(this.playerName.length < 11){
				this.playerName += String.fromCharCode(keyCode).toUpperCase();
			}
		} else if ( keyCode == Keyboard.ESCAPE) {
			this.sounds.EffectKeypress();
			this.OnBackClicked(null);
		}
		
		this.UpdatePlayerName();
	}
	
	private UpdatePlayerName(): void {
		this.txtInputName.text = this.playerName;
		this.txtInputName.x = 190 -this.txtInputName.width / 2;
	}
	
	public OnBackClicked(e: Event): void {
		this.sounds.EffectClick();;
		AppFacade.GetInstance().sendNotification(Events.MAIN_MENU_PANEL_BACK);
	}
	
	public OnSelectClick(e: MouseEvent): void {
		this.sounds.EffectClick();
		if (e.currentTarget == this.selectVeh0 || e.currentTarget == this.clickVeh0) {
			this.selectVeh0.addChild(this.tick);
			this.currentVehicleId = 0;
		} else if (e.currentTarget == this.selectVeh1 || e.currentTarget == this.clickVeh1) {
			this.selectVeh1.addChild(this.tick);
			this.currentVehicleId = 1;
		} else if (e.currentTarget == this.selectVeh2 || e.currentTarget == this.clickVeh2) {
			this.selectVeh2.addChild(this.tick);
			this.currentVehicleId = 3;
		} else if (e.currentTarget == this.selectVeh3 || e.currentTarget == this.clickVeh3) {
			this.selectVeh3.addChild(this.tick);
			this.currentVehicleId = 2; // swap vehicles as there is a bug ;P
		}
	}
	
	public SelectVehicle(id: number): void {
		switch(id) {
			case 0: this.selectVeh0.addChild(this.tick); break;
			case 1: this.selectVeh1.addChild(this.tick); break;
			case 2: this.selectVeh2.addChild(this.tick); break;
			case 3: this.selectVeh3.addChild(this.tick); break;
		}
	}
	
	public OnAcceptClicked(e: Event): void {
		this.sounds.EffectClick();
		/*if (playerName.length == 0 || !nameTyped) {
			// Blink bad name - cant accept
			TweenLite.to(btnAccept, 0.1, {tint: 0xff0000, onComplete: function():void {
					TweenLite.to(btnAccept, 0.1, {removeTint: true});
				}});
		} else {*/
			AppFacade.GetInstance().sendNotification(Events.MAIN_MENU_GAME_READY);
			this.rdyCallback.call(null); // PORT: TS requires the thisArg of Function.call
		//}
	}
}
