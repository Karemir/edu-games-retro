package VisualParts {
	import com.greensock.easing.Cubic;
	import com.greensock.TweenLite;
	import flash.display.Bitmap;
	import flash.display.Sprite;
	
	/**
	 * ...
	 * @author Perz
	 */
	public class TowerBlockAddon extends Sprite {
		public var relatedBlock:TowerBlock;
		public var bmp:Bitmap;
		
		public function TowerBlockAddon(block:TowerBlock,  addonIdx:int = -1) {
			relatedBlock = block;
			if(addonIdx == -1){
				bmp = GetRandomAddon(block.blockType, block.GetSegmentId());
				addonIdx = int(bmp.name);
			} else {
				bmp = GetIndexedAddon(block.blockType, addonIdx);
			}
			// need to reset bmp data as it may persist
			bmp.alpha = 0;
			bmp.x = 0;
			bmp.y = 0; 
			
			AlignAddon(bmp, block.blockType, addonIdx);
			block.addChild(this);
		}
				
		public function Show():void {
			addChild(bmp);
			bmp.x += relatedBlock.bg.x;
			bmp.y += -relatedBlock.GetSegmentHeight();
			TweenLite.to(bmp, 0.4, { alpha: 1, ease: Cubic.easeOut } );
		}
		
		public function Hide():void {
			var thisobj:TowerBlockAddon = this;
			TweenLite.to(bmp, 0.4, { alpha: 0, ease: Cubic.easeIn, onComplete: function():void { relatedBlock.removeChild(thisobj); }} );
		}
		
		// EMBEDS
		[Embed(source = "../../Assets/addonGiant.png")]		private static var addonA0Cl:Class;
		[Embed(source = "../../Assets/addonRogue.png")]		private static var addonA1Cl:Class;
		[Embed(source = "../../Assets/addonWraith.png")]	private static var addonA2Cl:Class;
		[Embed(source = "../../Assets/addonDragon.png")]	private static var addonA3Cl:Class;
		[Embed(source = "../../Assets/addonPipi.png")]		private static var addonB0Cl:Class;
		[Embed(source = "../../Assets/addonGranny.png")]	private static var addonB1Cl:Class;
		[Embed(source = "../../Assets/addonBicycle.png")]	private static var addonB2Cl:Class;
		[Embed(source = "../../Assets/addonTiger.png")]		private static var addonB3Cl:Class;
		[Embed(source = "../../Assets/addonSnake.png")]		private static var addonB4Cl:Class;
		[Embed(source = "../../Assets/addonDog.png")]		private static var addonB5Cl:Class;
		[Embed(source = "../../Assets/addonKingKong.png")]	private static var addonC0Cl:Class;
		[Embed(source = "../../Assets/addonFireman.png")]	private static var addonC1Cl:Class;
		[Embed(source = "../../Assets/addonUmbrella.png")]	private static var addonC2Cl:Class;
		[Embed(source = "../../Assets/addonSiren.png")]		private static var addonC3Cl:Class;
		[Embed(source = "../../Assets/addonClown.png")]		private static var addonC4Cl:Class;
		[Embed(source = "../../Assets/addonGhost.png")]		private static var addonC5Cl:Class;
		[Embed(source = "../../Assets/addonPig.png")]		private static var addonD0Cl:Class;
		[Embed(source = "../../Assets/addonR2D2.png")]		private static var addonD1Cl:Class;
		[Embed(source = "../../Assets/addonUfo.png")]		private static var addonD2Cl:Class;
		
		public static var addonCollection:Array = [
					[new addonA0Cl(), new addonA1Cl(), new addonA2Cl(), new addonA3Cl()],
					[new addonB0Cl(), new addonB1Cl(), new addonB2Cl(), new addonB3Cl(), new addonB4Cl(), new addonB5Cl()],
					[new addonC0Cl(), new addonC1Cl(), new addonC2Cl(), new addonC3Cl(), new addonC4Cl(), new addonC5Cl()],
					[new addonD0Cl(), new addonD1Cl(), new addonD2Cl()]];
		
		public static function GetRandomAddon(blockType:int, blockBgIdx:int):Bitmap {
			var arr:Array = addonCollection[blockType - 1];
			var rndItem:int = int(arr.length * Math.random());

			if (blockType == TowerBlock.TYPE_B) {
				if (blockBgIdx == 1) {
					// return snake
					return GetIndexedAddon(blockType, 4);
				} else if (blockBgIdx == 5) {
					// return tiger
					return GetIndexedAddon(blockType, 3);
				} else {
					// no repetitions
					while (rndItem == 4 || rndItem == 3) {
						rndItem = int(arr.length * Math.random());
					}
					return GetIndexedAddon(blockType, rndItem);
				}
			}
			
			var bitmap:Bitmap = arr[rndItem] as Bitmap;
			bitmap.name = rndItem.toString();
			bitmap.smoothing = true;
			
			return bitmap;
		}
		
		public static function GetIndexedAddon(blockType:int, idx:int):Bitmap {
			var bitmap:Bitmap = addonCollection[blockType - 1][idx] as Bitmap;
			bitmap.name = idx.toString();
			bitmap.smoothing = true;
			
			return bitmap;
		}
		
		public static function GetAddonCount(blockType:int):int {
			return addonCollection[blockType - 1].length;
		}
		
		private static function AlignAddon(bmp:Bitmap, blockType:int, addonIdx:int):void {
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

}