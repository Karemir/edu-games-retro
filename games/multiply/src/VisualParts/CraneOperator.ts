import { Bitmap } from "@edugames/common/flash/display/Bitmap.js";
import { Sprite } from "@edugames/common/flash/display/Sprite.js";
import { embed } from "@edugames/common/AssetLoader.js";
import type { Class } from "@edugames/common/flash/utils/Class.js";

/**
 * ...
 * @author Michal Perzak
 */
export class CraneOperator extends Sprite {
	private static normalBmp: Class = embed("Assets/operator.png"); // PORT: embeds are static
	private static actionBmp: Class = embed("Assets/operatorAction.png"); // PORT: embeds are static

	private normalImg: Bitmap;
	private actionImg: Bitmap;

	public static readonly STATE_NORMAL: number = 0;
	public static readonly STATE_ACTION: number = 1;
	public state: number;

	constructor() {
		super();
		this.normalImg = new CraneOperator.normalBmp();
		this.actionImg = new CraneOperator.actionBmp();
		this.normalImg.smoothing = true;
		this.actionImg.smoothing = true;

		this.normalImg.x = -this.normalImg.width / 2;
		this.normalImg.y = -this.normalImg.height / 2;
		this.actionImg.x = -this.actionImg.width / 2;
		this.actionImg.y = -this.actionImg.height / 2;

		this.addChild(this.normalImg);
		this.addChild(this.actionImg);

		this.state = CraneOperator.STATE_NORMAL;
		this.actionImg.alpha = 0;
	}

	public SetState(state: number): void {
		if (this.state == state) return;
		this.state = state;
		switch(state) {
			case CraneOperator.STATE_NORMAL:
				this.actionImg.alpha = 0;
				this.normalImg.alpha = 1;
				break;
			case CraneOperator.STATE_ACTION:
				this.actionImg.alpha = 1;
				this.normalImg.alpha = 0;
				break;
		}
	}
}
