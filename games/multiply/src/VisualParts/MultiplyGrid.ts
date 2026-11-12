import { embed } from "@edugames/common/AssetLoader.js";
import { Bitmap } from "@edugames/common/flash/display/Bitmap.js";
import { Sprite } from "@edugames/common/flash/display/Sprite.js";
import { ColorTransform } from "@edugames/common/flash/geom/ColorTransform.js";
import type { Class } from "@edugames/common/flash/utils/Class.js";
import { MathQuestion } from "../Data/MathQuestion.js";

/**
 * ...
 * @author Perz
 */
export class MultiplyGrid extends Sprite {
	public question: MathQuestion;
	private markers: Sprite[];
	
	/**
	 * Topmost layer with lines drawn on it.
	 */
	private coverLayer: Sprite;
	private currentDif: number;
	
	// PORT: [Embed] fields registered with the AssetLoader, paths relative to index.html
	private static grid3bmp: Class = embed("Assets/multiplyVisual3.png");
	
	private static grid6bmp: Class = embed("Assets/multiplyVisual6.png");
	
	private static grid10bmp: Class = embed("Assets/multiplyVisual10.png");
			
	constructor() {
		super();						
		this.coverLayer = new Sprite();
		let bmp: Bitmap = new MultiplyGrid.grid3bmp();
		bmp.smoothing = true;
		this.coverLayer.addChild(bmp);
		//coverLayer.graphics.lineStyle(2, 0, 1);
		//coverLayer.graphics.drawRect(0, 0, w, h);
		//for (var lineX:int = 1; lineX < 10; ++lineX) {
			//coverLayer.graphics.moveTo(lineX * (w / 10.0), 0);
			//coverLayer.graphics.lineTo(lineX * (w / 10.0), h);
		//}
		//for (var lineY:int = 1; lineY < 10; ++lineY) {
			//coverLayer.graphics.moveTo(0, lineY * (h / 10.0));
			//coverLayer.graphics.lineTo(w, lineY * (h / 10.0));
		//}
		this.addChild(this.coverLayer);
		this.currentDif = 3;
		
		this.MakeRects();
	}

	public MakeRects(): void {
		for (let m of this.markers || []) { // PORT: AS3 `for each` over an unset Vector does nothing
			this.removeChild(m);
		}
		
		this.markers = [];
		for (let iy: number = 0; iy < this.currentDif; ++iy) {
			for (let ix: number = 0; ix < this.currentDif; ++ix) {
				let spr: Sprite = new Sprite();
				spr.graphics.beginFill(0xffffff, 0);
				spr.graphics.drawRect(0, 0, this.width / this.currentDif, this.height / this.currentDif);
				spr.graphics.beginFill(0xffffff, 1);
				if (this.currentDif == 3) {
					spr.graphics.drawRect(12, 12, this.width / this.currentDif - 24, this.height / this.currentDif - 24);
				} else {
					spr.graphics.drawRect(6, 6, this.width / this.currentDif - 12, this.height / this.currentDif - 12);
				}
				spr.x = ix * (this.width / this.currentDif);
				spr.y = iy * (this.height / this.currentDif);
				this.addChild(spr);
				this.markers.push(spr);
			}
		}
		
		this.UpdateMarkers();
	}
	
	public SetLevel(maxNum: number): void {
		this.coverLayer.removeChildAt(0);
		// PORT: the original never smooths the swapped-in grid bitmaps (unnoticed in Flash); the scaled canvas needs it or the lines get uneven widths
		let bmp: Bitmap;
		if (maxNum <= 3) {
			bmp = new MultiplyGrid.grid3bmp();
			this.currentDif = 3;
		} else if (maxNum <= 6) {
			bmp = new MultiplyGrid.grid6bmp();
			this.currentDif = 6;
		} else {
			bmp = new MultiplyGrid.grid10bmp();
			this.currentDif = 10;
		}
		bmp.smoothing = true;
		this.coverLayer.addChild(bmp);
		this.MakeRects();
	}
	
	public SetQuestion(q: MathQuestion): void {
		this.question = q;
		this.UpdateMarkers();
	}
	
	public UpdateMarkers(): void {
		let factorX: number = 0;
		let factorY: number = 0;
		
		if (this.question) {
			factorX = this.question.firstNumber;
			factorY = this.question.secondNumber;
		}
		
		for (let iy: number = 0; iy < this.currentDif; ++iy) {
			for (let ix: number = 0; ix < this.currentDif; ++ix) {
				let marker: Sprite = this.markers[iy * this.currentDif + ix];
				if (iy < factorY && ix < factorX) {
					marker.transform.colorTransform = new ColorTransform(1, 0, 0, 0.5);
				} else {
					marker.transform.colorTransform = new ColorTransform(0, 1, 0, 0);
				}
			}
		}
	}
}
