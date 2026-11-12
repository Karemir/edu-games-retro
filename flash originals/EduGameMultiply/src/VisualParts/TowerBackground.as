package VisualParts {
	import com.greensock.TweenLite;
	import flash.display.Bitmap;
	import flash.display.Sprite;
	
	/**
	 * ...
	 * @author Perzka Michalowy
	 */
	public class TowerBackground extends Sprite {		
		[Embed(source="../../Assets/machineTop.png")]
		private var bgTopImg:Class;
		
		private var bg:Bitmap;
		private var bgTop:Bitmap;
		private var desiredWidth:int;
		private var desiredHeight:int;
		
		public var craneOperator:CraneOperator;
		
		public function TowerBackground(w:int, h:int) {
			bg = Content.GetBmp("bgImg");
			
			bgTop = new bgTopImg();
			bgTop.smoothing = true;
			addChild(bg);
			
			desiredHeight = h;
			desiredWidth = w;
			
			//bg.width = w;
			//bg.scaleY = bg.scaleX;
			
			bg.y = -bg.height + h;
			addChild(bgTop);
			
			craneOperator = new CraneOperator();
			craneOperator.x = 100;
			craneOperator.y = 50;
			addChild(craneOperator);
		}
		
		public function AddHeight(h:int, time:Number):void {
			Logger.Log("Move bg down " + h);
			
			var maxH:Number = bg.y +h;
			maxH = Math.min(0, maxH);
			
			TweenLite.to(bg, time, {y: maxH});
		}
	}

}