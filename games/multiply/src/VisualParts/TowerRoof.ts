import { Bitmap } from "@edugames/common/flash/display/Bitmap.js";
import { MovieClip } from "@edugames/common/flash/display/MovieClip.js";
import { Sprite } from "@edugames/common/flash/display/Sprite.js";
import { Event } from "@edugames/common/flash/events/Event.js";
import { MouseEvent } from "@edugames/common/flash/events/MouseEvent.js";
import { TextField } from "@edugames/common/flash/text/TextField.js";
import { TextFieldAutoSize } from "@edugames/common/flash/text/TextFieldAutoSize.js";
import { TextFormat } from "@edugames/common/flash/text/TextFormat.js";
import { embed } from "@edugames/common/AssetLoader.js";
import type { Class } from "@edugames/common/flash/utils/Class.js";
import { Sounds } from "../Proxies/Sounds.js";
import { AppFacade } from "../AppFacade.js";
import { Events } from "../Events.js";
import { TowerBlock } from "./TowerBlock.js";

/**
 * ...
 * @author Perzka Michalowy
 */
export class TowerRoof extends Sprite {
	// PORT: embeds are static
	private static roof1: Class = embed("Assets/roof1.png");
	private static roof2: Class = embed("Assets/roof2.png");
	private static roof3: Class = embed("Assets/roof3.png");
	private static roof4: Class = embed("Assets/roof4.png");

	private static flag11Cl: Class = embed("Assets/flag1_1.png");
	private static flag12Cl: Class = embed("Assets/flag1_2.png");
	private static flag13Cl: Class = embed("Assets/flag1_3.png");
	private static flag14Cl: Class = embed("Assets/flag1_4.png");
	private static flag21Cl: Class = embed("Assets/flag2_1.png");
	private static flag22Cl: Class = embed("Assets/flag2_2.png");
	private static flag23Cl: Class = embed("Assets/flag2_3.png");
	private static flag24Cl: Class = embed("Assets/flag2_4.png");

	private flagFrames: Bitmap[]; // PORT: Vector.<Bitmap>
	private flag: Sprite;
	private frameIdx: number;
	private frameCounter: number;

	private img: Bitmap;
	private roofType: number;
	private sounds: Sounds;

	constructor(type: number) {
		super();
		this.sounds = AppFacade.GetInstance().retrieveProxy(Sounds.NAME) as Sounds;

		this.roofType = type;
		switch(type) {
			case TowerBlock.TYPE_A:
				this.img = new TowerRoof.roof1();
				this.img.x = -11;
				this.img.y = 10;
				break;
			case TowerBlock.TYPE_B:
				this.img = new TowerRoof.roof2();
				this.img.x = -10;
				this.img.y = 10;
				break;
			case TowerBlock.TYPE_C:
				this.img = new TowerRoof.roof3();
				this.img.x = -13;
				this.img.y = 0;
				break;
			case TowerBlock.TYPE_D:
				this.img = new TowerRoof.roof4();
				this.img.x = -7;
				this.img.y = 5;
				break;
		}
		this.addChild(this.img);
		this.img.x += -this.img.width / 2;
		this.img.y += -this.img.height + 20;

		const btnMenuSprite: Sprite = new Sprite();
		btnMenuSprite.x = 0 + this.img.x;
		btnMenuSprite.y = 71 + this.img.y;
		btnMenuSprite.buttonMode = true;
		btnMenuSprite.graphics.beginFill(0, 0);
		btnMenuSprite.graphics.drawRect(0, 0, 90, 80);

		const btnNewGameSprite: Sprite = new Sprite();
		btnNewGameSprite.x = 183 + this.img.x;
		btnNewGameSprite.y = 27 + this.img.y;
		btnNewGameSprite.buttonMode = true;
		btnNewGameSprite.graphics.beginFill(0, 0);
		btnNewGameSprite.graphics.drawRect(0, 0, 44, 111);

		this.addChild(btnMenuSprite);
		this.addChild(btnNewGameSprite);

		this.InitializeFlag();

		btnMenuSprite.addEventListener(MouseEvent.CLICK, this.OnMenuClick);
		btnNewGameSprite.addEventListener(MouseEvent.CLICK, this.OnNewGame);

		this.addEventListener(Event.ENTER_FRAME, this.OnFrame);
	}

	private InitializeFlag(): void {
		this.flag = new Sprite();
		this.flagFrames = []; // PORT: new Vector.<Bitmap>()
		switch(this.roofType) {
			case TowerBlock.TYPE_A:
				this.flagFrames.push(new TowerRoof.flag11Cl(), new TowerRoof.flag12Cl(), new TowerRoof.flag13Cl(), new TowerRoof.flag14Cl());
				this.flag.x = -63;
				this.flag.y = -135;
				break;
			case TowerBlock.TYPE_B:
				this.flagFrames.push(new TowerRoof.flag11Cl(), new TowerRoof.flag12Cl(), new TowerRoof.flag13Cl(), new TowerRoof.flag14Cl());
				this.flag.x = -64;
				this.flag.y = -130;
				break;
			case TowerBlock.TYPE_C:
				this.flagFrames.push(new TowerRoof.flag21Cl(), new TowerRoof.flag22Cl(), new TowerRoof.flag23Cl(), new TowerRoof.flag24Cl(), new TowerRoof.flag24Cl(), new TowerRoof.flag23Cl(), new TowerRoof.flag22Cl(), new TowerRoof.flag21Cl());
				this.flag.x = -35;
				this.flag.y = -150;
				break;
			case TowerBlock.TYPE_D:
				this.flagFrames.push(new TowerRoof.flag21Cl(), new TowerRoof.flag22Cl(), new TowerRoof.flag23Cl(), new TowerRoof.flag24Cl(), new TowerRoof.flag24Cl(), new TowerRoof.flag23Cl(), new TowerRoof.flag22Cl(), new TowerRoof.flag21Cl());
				this.flag.x = -35;
				this.flag.y = -160;
				break;
		}
		this.addChild(this.flag);
		this.frameIdx = 0;
		this.frameCounter = 0;

		for (const bmp of this.flagFrames) { // PORT: for each
			bmp.x = -bmp.width / 2;
			bmp.y = -bmp.height / 2;
			bmp.smoothing = true;
		}
	}

	private SetFlagFrame(): void {
		if (this.flag.numChildren > 0) {
			this.flag.removeChildAt(0);
		}
		this.flag.addChild(this.flagFrames[this.frameIdx]);
	}

	private OnFrame(e: Event): void {
		this.frameCounter++;
		if (this.frameCounter >= 6) {
			this.frameCounter = 0;
			this.frameIdx++;
			if (this.frameIdx == this.flagFrames.length) {
				this.frameIdx = 0;
			}

			this.SetFlagFrame();
		}
	}

	private OnMenuClick(e: Event): void {
		this.sounds.EffectClick();
		AppFacade.GetInstance().sendNotification(Events.NAVIGATION_MENU, this.stage);
	}

	private OnNewGame(e: Event): void {
		this.sounds.EffectClick();
		AppFacade.GetInstance().sendNotification(Events.NAVIGATION_GAME_ARCADE, this.stage);
	}

}
