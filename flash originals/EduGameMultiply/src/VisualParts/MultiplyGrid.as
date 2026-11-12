package VisualParts {
	import Data.MathQuestion;
	import flash.display.Bitmap;
	import flash.display.Sprite;
	import flash.geom.ColorTransform;
	
	/**
	 * ...
	 * @author Perz
	 */
	public class MultiplyGrid extends Sprite {
		public var question:MathQuestion;
		private var markers:Vector.<Sprite>;
		
		/**
		 * Topmost layer with lines drawn on it.
		 */
		private var coverLayer:Sprite;
		private var currentDif:int;
		
		[Embed(source="../../Assets/multiplyVisual3.png")]
		private var grid3bmp:Class;
		
		[Embed(source="../../Assets/multiplyVisual6.png")]
		private var grid6bmp:Class;
		
		[Embed(source="../../Assets/multiplyVisual10.png")]
		private var grid10bmp:Class;
				
		public function MultiplyGrid() {						
			coverLayer = new Sprite();
			var bmp:Bitmap = new grid3bmp();
			bmp.smoothing = true;
			coverLayer.addChild(bmp);
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
			addChild(coverLayer);
			currentDif = 3;
			
			MakeRects();
		}

		public function MakeRects():void {
			for each(var m:Sprite in markers) {
				removeChild(m);
			}
			
			markers = new Vector.<Sprite>();
			for (var iy:int = 0; iy < currentDif; ++iy) {
				for (var ix:int = 0; ix < currentDif; ++ix) {
					var spr:Sprite = new Sprite();
					spr.graphics.beginFill(0xffffff, 0);
					spr.graphics.drawRect(0, 0, width / currentDif, height / currentDif);
					spr.graphics.beginFill(0xffffff, 1);
					if (currentDif == 3) {
						spr.graphics.drawRect(12, 12, width / currentDif - 24, height / currentDif - 24);
					} else {
						spr.graphics.drawRect(6, 6, width / currentDif - 12, height / currentDif - 12);
					}
					spr.x = ix * (width / currentDif);
					spr.y = iy * (height / currentDif);
					addChild(spr);
					markers.push(spr);
				}
			}
			
			UpdateMarkers();
		}
		
		public function SetLevel(maxNum:int):void {
			coverLayer.removeChildAt(0);
			if (maxNum <= 3) {
				coverLayer.addChild(new grid3bmp());
				currentDif = 3;
			} else if (maxNum <= 6) {
				coverLayer.addChild(new grid6bmp());
				currentDif = 6;
			} else {
				coverLayer.addChild(new grid10bmp());
				currentDif = 10;
			}
			MakeRects();
		}
		
		public function SetQuestion(q:MathQuestion):void {
			question = q;
			UpdateMarkers();
		}
		
		public function UpdateMarkers():void {
			var factorX:int = 0;
			var factorY:int = 0;
			
			if (question) {
				factorX = question.firstNumber;
				factorY = question.secondNumber;
			}
			
			for (var iy:int = 0; iy < currentDif; ++iy) {
				for (var ix:int = 0; ix < currentDif; ++ix) {
					var marker:Sprite = markers[iy * currentDif + ix];
					if (iy < factorY && ix < factorX) {
						marker.transform.colorTransform = new ColorTransform(1, 0, 0, 0.5);
					} else {
						marker.transform.colorTransform = new ColorTransform(0, 1, 0, 0);
					}
				}
			}
		}
	}

}