package VisualParts {
	import flash.display.Bitmap;
	import flash.display.Sprite;
	
	/**
	 * ...
	 * @author Michal Perzak
	 */
	public class CraneOperator extends Sprite {
		[Embed(source = "../../Assets/operator.png")]private var normalBmp:Class;
		[Embed(source = "../../Assets/operatorAction.png")]private var actionBmp:Class;
		
		private var normalImg:Bitmap;
		private var actionImg:Bitmap;
		
		public static const STATE_NORMAL:int = 0;
		public static const STATE_ACTION:int = 1;
		public var state:int;
		
		public function CraneOperator() {
			normalImg = new normalBmp();
			actionImg = new actionBmp();
			normalImg.smoothing = true;
			actionImg.smoothing = true;
			
			normalImg.x = -normalImg.width / 2;
			normalImg.y = -normalImg.height / 2;
			actionImg.x = -actionImg.width / 2;
			actionImg.y = -actionImg.height / 2;
			
			addChild(normalImg);
			addChild(actionImg);
			
			state = STATE_NORMAL;
			actionImg.alpha = 0;
		}
		
		public function SetState(state:int):void {
			if (this.state == state) return;
			this.state = state;
			switch(state) {
				case STATE_NORMAL:
					actionImg.alpha = 0;
					normalImg.alpha = 1;
					break;
				case STATE_ACTION:
					actionImg.alpha = 1;
					normalImg.alpha = 0;
					break;
			}
		}
	}

}