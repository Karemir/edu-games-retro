import { Bitmap } from "@edugames/common/flash/display/Bitmap.js";
import { Sprite } from "@edugames/common/flash/display/Sprite.js";
import { TweenLite } from "@edugames/common/com/greensock/TweenLite.js";
import { embed } from "@edugames/common/AssetLoader.js";
import type { Class } from "@edugames/common/flash/utils/Class.js";
import { Content } from "../Content.js";
import { Logger } from "../Logger.js";
import { CraneOperator } from "./CraneOperator.js";

/**
 * ...
 * @author Perzka Michalowy
 */
export class TowerBackground extends Sprite {
	private static bgTopImg: Class = embed("Assets/machineTop.png"); // PORT: embeds are static

	private bg: Bitmap;
	private bgTop: Bitmap;
	private desiredWidth: number;
	private desiredHeight: number;

	public craneOperator: CraneOperator;

	constructor(w: number, h: number) {
		super();
		this.bg = Content.GetBmp("bgImg");

		this.bgTop = new TowerBackground.bgTopImg();
		this.bgTop.smoothing = true;
		this.addChild(this.bg);

		this.desiredHeight = h;
		this.desiredWidth = w;

		//bg.width = w;
		//bg.scaleY = bg.scaleX;

		this.bg.y = -this.bg.height + h;
		this.addChild(this.bgTop);

		this.craneOperator = new CraneOperator();
		this.craneOperator.x = 100;
		this.craneOperator.y = 50;
		this.addChild(this.craneOperator);
	}

	public AddHeight(h: number, time: number): void {
		Logger.Log("Move bg down " + h);

		let maxH: number = this.bg.y +h;
		maxH = Math.min(0, maxH);

		TweenLite.to(this.bg, time, {y: maxH});
	}
}
