import { Bitmap } from "@edugames/common/flash/display/Bitmap.js";
import { Sprite } from "@edugames/common/flash/display/Sprite.js";
import { TextField } from "@edugames/common/flash/text/TextField.js";
import { TextFormat } from "@edugames/common/flash/text/TextFormat.js";
import { Sine } from "@edugames/common/com/greensock/easing/Sine.js";
import { TweenLite } from "@edugames/common/com/greensock/TweenLite.js";
import { embed } from "@edugames/common/AssetLoader.js";
import type { Class } from "@edugames/common/flash/utils/Class.js";
import { GameMediator } from "../Mediators/GameMediator.js";
import { GameProxy } from "../Proxies/GameProxy.js";
import { AppFacade } from "../AppFacade.js";
import { Logger } from "../Logger.js";
import { HeightMarker } from "./HeightMarker.js";
import { TextButton } from "./TextButton.js";
import { TowerBlock } from "./TowerBlock.js";

/**
 * ...
 * @author Perzka Michalowy
 */
export class HeightIndicator extends Sprite {
	private desiredHeight: number;

	private static balloonCl: Class = embed("Assets/baloon.png"); // PORT: embeds are static
	private static person1Cl: Class = embed("Assets/balloonPerson1.png"); // PORT: embeds are static
	private static person2Cl: Class = embed("Assets/balloonPerson2.png"); // PORT: embeds are static
	private static person3Cl: Class = embed("Assets/balloonPerson3.png"); // PORT: embeds are static
	private static person4Cl: Class = embed("Assets/balloonPerson4.png"); // PORT: embeds are static

	private static readonly markerPositions: Array<any> = [50, 100, 150, 200, 300, 400, 500, 750, 1000, 1500, 2000, 3000];
	private markers: HeightMarker[]; // PORT: Vector.<HeightMarker>

	private balloonContainer: Sprite;
	private balloon: Bitmap;
	private balloonText: TextButton;
	private balloonTextStyle: TextFormat;
	private person: Bitmap;
	private balloonStartPos: number;

	private heightCounter: number;

	private gameProxy: GameProxy;

	constructor(h: number) {
		super();
		this.desiredHeight = h;
		this.heightCounter = 0;
		this.mouseChildren = false;

		this.markers = [];
		for (const pos of HeightIndicator.markerPositions) { // PORT: for each
			const tmp: HeightMarker = new HeightMarker(pos);
			this.addChild(tmp);
			tmp.x = -50;
			tmp.y = -pos * 10 + this.desiredHeight - 25; // 25 is half block size. me lazy.

			this.markers.push(tmp);
		}

		this.balloonText = new TextButton(" ", null);
		this.balloonTextStyle = new TextFormat("MBold", 23);
		this.balloonText.textField.defaultTextFormat = this.balloonTextStyle;
		this.balloonText.textField.embedFonts = true;

		this.balloonContainer = new Sprite();
		this.balloon = new HeightIndicator.balloonCl();
		this.balloon.smoothing = true;
		this.balloonContainer.addChild(this.balloon);
		this.balloonContainer.y = this.desiredHeight - this.balloon.height - 30;
		this.balloonContainer.x = -this.balloon.width + 5;
		this.balloonStartPos = this.balloonContainer.y;
		this.balloonText.y = 50;
		this.balloonContainer.addChild(this.balloonText);
		this.addChild(this.balloonContainer);

		this.gameProxy = AppFacade.GetInstance().retrieveProxy(GameProxy.NAME) as GameProxy;
	}

	public AddHeight(h: number, time: number): void {
		Logger.Log("Move markers down " + h);

		for (const mark of this.markers) { // PORT: for each
			TweenLite.to(mark, time, {y: mark.y + h});
		}

		if (this.balloon.y == this.balloonStartPos) {
			this.OnBalloonAnimationComplete();
		} else {
			TweenLite.to(this.balloonContainer, time, {y: this.balloonContainer.y + h, onComplete: this.OnBalloonAnimationComplete});
		}
	}

	public UpdateHeightTxt(h: number): void {
		if (this.gameProxy.gameMode == GameMediator.GAME_MODE_ARCADE) {
			if (h > 0)
				this.balloonText.textField.text = h + " m";
		} else if(this.gameProxy.score > 0) {
			this.balloonText.textField.text = this.gameProxy.score + " pkt";
		} else {
			this.balloonText.textField.text = " ";
		}
		this.balloonText.x = this.balloonContainer.width / 2 - this.balloonText.width / 2;
	}

	public OnBalloonAnimationComplete(): void {
		TweenLite.to(this.balloonContainer, 2, {y: 100, ease: Sine.easeInOut});
	}

	public SetPerson(blockType: number): void {
		if (this.person) {
			this.balloonContainer.removeChild(this.person);
			this.person = null;
		}
		switch (blockType) {
			case TowerBlock.TYPE_A:
				this.person = new HeightIndicator.person1Cl();
				this.person.x = 5;
				this.person.y = 150;
				break;
			case TowerBlock.TYPE_B:
				this.person = new HeightIndicator.person2Cl();
				this.person.x = 15;
				this.person.y = 155;
				break;
			case TowerBlock.TYPE_C:
				this.person = new HeightIndicator.person3Cl();
				this.person.x = 25;
				this.person.y = 160;
				break;
			case TowerBlock.TYPE_D:
				this.person = new HeightIndicator.person4Cl();
				this.person.x = 25;
				this.person.y = 170;
				break;
		}
		this.person.smoothing = true;
		this.balloonContainer.addChild(this.person);
	}
}
