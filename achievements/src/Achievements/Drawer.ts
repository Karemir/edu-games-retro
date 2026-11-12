import { Bitmap } from "@edugames/common/flash/display/Bitmap.js";
import { Sprite } from "@edugames/common/flash/display/Sprite.js";
import { embed } from "@edugames/common/AssetLoader.js";
import type { Class } from "@edugames/common/flash/utils/Class.js";
import type { GardenItem } from "./GardenItem.js";

/**
 * ...
 * @author Michal Perzak
 */
export class Drawer extends Sprite {
	// PORT: assets of the shared package, reached from any games/<name>/ page through ../../achievements/
	private static bmpBot: Class = embed("../../achievements/Assets/polka_dol.png");
	private static bmpTop: Class = embed("../../achievements/Assets/polka_gora.png");
	private static bmpMid: Class = embed("../../achievements/Assets/polka_srodek.png");
	
	private top: Bitmap;
	private bot: Bitmap;
	private midSegments: Bitmap[]; // PORT: Vector.<Bitmap>
	
	constructor(items: GardenItem[]) { // PORT: Vector.<GardenItem>
		super();
		this.top = new Drawer.bmpTop();
		this.bot = new Drawer.bmpBot();
		this.midSegments = [];
		let h: number = 0;
		
		this.top.smoothing = true;
		this.bot.smoothing = true;
		this.top.scaleX = this.top.scaleY = 0.75;
		this.bot.scaleX = this.bot.scaleY = 0.75;
		
		this.top.x = 3;
		this.addChild(this.top);
		this.addChild(items[0]);
		h += this.top.height;
		items[0].y = h - 10;
		items[0].x = 65; // TODO: count proper middle and align.
		for (let i: number = 0; i < items.length - 1; ++i) {
			let tmp: Bitmap = new Drawer.bmpMid();
			tmp.smoothing = true;
			tmp.scaleY = tmp.scaleX = 0.75;
			tmp.y = h;
			tmp.x = -1;
			h += tmp.height;
			this.midSegments.push(tmp);
			this.addChildAt(tmp, 0);
			
			let item: GardenItem = items[i + 1];
			this.addChild(item);
			item.y = h - 10;
			item.x = 65;
		}
		this.bot.x = 3;
		this.bot.y = h;
		this.addChildAt(this.bot, 0);
	}

}
