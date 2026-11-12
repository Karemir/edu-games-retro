import { Cubic } from "@edugames/common/com/greensock/easing/Cubic.js";
import { TweenLite } from "@edugames/common/com/greensock/TweenLite.js";
import { Bitmap } from "@edugames/common/flash/display/Bitmap.js";
import { Sprite } from "@edugames/common/flash/display/Sprite.js";
import { embed } from "@edugames/common/AssetLoader.js";
import type { Class } from "@edugames/common/flash/utils/Class.js";
import { TowerBlock } from "./TowerBlock.js";

/**
 * ...
 * @author Perz
 */
export class TowerBlockAddon extends Sprite {
	public relatedBlock: TowerBlock;
	public bmp: Bitmap;

	constructor(block: TowerBlock,  addonIdx: number = -1) {
		super();
		this.relatedBlock = block;
		if(addonIdx == -1){
			this.bmp = TowerBlockAddon.GetRandomAddon(block.blockType, block.GetSegmentId());
			addonIdx = Number(this.bmp.name) | 0; // PORT: int()
		} else {
			this.bmp = TowerBlockAddon.GetIndexedAddon(block.blockType, addonIdx);
		}
		// need to reset bmp data as it may persist
		this.bmp.alpha = 0;
		this.bmp.x = 0;
		this.bmp.y = 0;

		TowerBlockAddon.AlignAddon(this.bmp, block.blockType, addonIdx);
		block.addChild(this);
	}

	public Show(): void {
		this.addChild(this.bmp);
		this.bmp.x += this.relatedBlock.bg.x;
		this.bmp.y += -this.relatedBlock.GetSegmentHeight();
		TweenLite.to(this.bmp, 0.4, { alpha: 1, ease: Cubic.easeOut } );
	}

	public Hide(): void {
		const thisobj: TowerBlockAddon = this;
		// PORT: arrow function keeps `this` (AS3 closures resolve members through the enclosing instance)
		TweenLite.to(this.bmp, 0.4, { alpha: 0, ease: Cubic.easeIn, onComplete: () => { this.relatedBlock.removeChild(thisobj); }} );
	}

	// EMBEDS
	private static addonA0Cl: Class = embed("Assets/addonGiant.png");
	private static addonA1Cl: Class = embed("Assets/addonRogue.png");
	private static addonA2Cl: Class = embed("Assets/addonWraith.png");
	private static addonA3Cl: Class = embed("Assets/addonDragon.png");
	private static addonB0Cl: Class = embed("Assets/addonPipi.png");
	private static addonB1Cl: Class = embed("Assets/addonGranny.png");
	private static addonB2Cl: Class = embed("Assets/addonBicycle.png");
	private static addonB3Cl: Class = embed("Assets/addonTiger.png");
	private static addonB4Cl: Class = embed("Assets/addonSnake.png");
	private static addonB5Cl: Class = embed("Assets/addonDog.png");
	private static addonC0Cl: Class = embed("Assets/addonKingKong.png");
	private static addonC1Cl: Class = embed("Assets/addonFireman.png");
	private static addonC2Cl: Class = embed("Assets/addonUmbrella.png");
	private static addonC3Cl: Class = embed("Assets/addonSiren.png");
	private static addonC4Cl: Class = embed("Assets/addonClown.png");
	private static addonC5Cl: Class = embed("Assets/addonGhost.png");
	private static addonD0Cl: Class = embed("Assets/addonPig.png");
	private static addonD1Cl: Class = embed("Assets/addonR2D2.png");
	private static addonD2Cl: Class = embed("Assets/addonUfo.png");

	public static addonCollection: Array<any> = [
				[new TowerBlockAddon.addonA0Cl(), new TowerBlockAddon.addonA1Cl(), new TowerBlockAddon.addonA2Cl(), new TowerBlockAddon.addonA3Cl()],
				[new TowerBlockAddon.addonB0Cl(), new TowerBlockAddon.addonB1Cl(), new TowerBlockAddon.addonB2Cl(), new TowerBlockAddon.addonB3Cl(), new TowerBlockAddon.addonB4Cl(), new TowerBlockAddon.addonB5Cl()],
				[new TowerBlockAddon.addonC0Cl(), new TowerBlockAddon.addonC1Cl(), new TowerBlockAddon.addonC2Cl(), new TowerBlockAddon.addonC3Cl(), new TowerBlockAddon.addonC4Cl(), new TowerBlockAddon.addonC5Cl()],
				[new TowerBlockAddon.addonD0Cl(), new TowerBlockAddon.addonD1Cl(), new TowerBlockAddon.addonD2Cl()]];

	public static GetRandomAddon(blockType: number, blockBgIdx: number): Bitmap {
		const arr: Array<any> = TowerBlockAddon.addonCollection[blockType - 1];
		let rndItem: number = (arr.length * Math.random()) | 0; // PORT: int()

		if (blockType == TowerBlock.TYPE_B) {
			if (blockBgIdx == 1) {
				// return snake
				return TowerBlockAddon.GetIndexedAddon(blockType, 4);
			} else if (blockBgIdx == 5) {
				// return tiger
				return TowerBlockAddon.GetIndexedAddon(blockType, 3);
			} else {
				// no repetitions
				while (rndItem == 4 || rndItem == 3) {
					rndItem = (arr.length * Math.random()) | 0; // PORT: int()
				}
				return TowerBlockAddon.GetIndexedAddon(blockType, rndItem);
			}
		}

		const bitmap: Bitmap = arr[rndItem] as Bitmap;
		bitmap.name = rndItem.toString();
		bitmap.smoothing = true;

		return bitmap;
	}

	public static GetIndexedAddon(blockType: number, idx: number): Bitmap {
		const bitmap: Bitmap = TowerBlockAddon.addonCollection[blockType - 1][idx] as Bitmap;
		bitmap.name = idx.toString();
		bitmap.smoothing = true;

		return bitmap;
	}

	public static GetAddonCount(blockType: number): number {
		return TowerBlockAddon.addonCollection[blockType - 1].length;
	}

	private static AlignAddon(bmp: Bitmap, blockType: number, addonIdx: number): void {
		if (blockType == TowerBlock.TYPE_A) {
			// TYPE_A blocks may be random
			if (addonIdx == 0) { // giant
				bmp.x += 15;
				bmp.y -= 3;
			}else if (addonIdx == 1) { // gosc z maczuga
				bmp.x += bmp.width * 0.55;
				bmp.y += 5;
			} else if ( addonIdx == 2) { // zjawa
				bmp.x += 40;
				bmp.y -= 23;
			} else if (addonIdx == 3) { // dragon
				bmp.x += 0;
				bmp.y -= 20;
			}
		} else if (blockType == TowerBlock.TYPE_B) {
			if (addonIdx == 0) { // pipi
				bmp.x += bmp.width * 0.6;
				bmp.y += 1;
			} else if (addonIdx == 1) { // granny
				bmp.x += bmp.width * 1.1;
				bmp.y -= 11;
			} else if ( addonIdx == 2) { // bike
				bmp.x += 30;
				bmp.y -= 9
			} else if ( addonIdx == 3) { // tiger
				bmp.x += 35;
				bmp.y -= 10;
			} else if ( addonIdx == 4) { // snake
				bmp.x += 73;
				bmp.y -= 5;
			} else if (addonIdx == 5) { // dog
				bmp.x += 20;
				bmp.y -= 2;
			}
		} else if (blockType == TowerBlock.TYPE_C) {
			if (addonIdx == 0) { // kingkong
				bmp.x += 5;
				bmp.y -= 22;
			} else if (addonIdx == 1) { // fireman
				bmp.x += 0;
				bmp.y -= 15;
			} else if ( addonIdx == 2) { // umbrella
				bmp.x += 30;
				bmp.y -= 8;
			} else if ( addonIdx == 3) { // siren
				bmp.x += 17;
				bmp.y -= 7;
			} else if ( addonIdx == 4) { // clown
				bmp.x += 40;
				bmp.y -= 23;
			} else if (addonIdx == 5) { // ghost
				bmp.x += 30;
				bmp.y -= 9;
			}
		} else if (blockType == TowerBlock.TYPE_D) {
			if (addonIdx == 0) { // pig
				bmp.x += 40;
				bmp.y -= 25;
			} else if (addonIdx == 1) { // r2d2
				bmp.x += 50;
				bmp.y -= 4;
			} else if ( addonIdx == 2) { // ufo
				bmp.x += 20;
				bmp.y -= 18;
			}
		}
	}
}
