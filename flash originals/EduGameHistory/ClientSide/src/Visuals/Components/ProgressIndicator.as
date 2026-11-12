package Visuals.Components {
	import com.greensock.TweenLite;
	import flash.display.Sprite;
	import flash.text.TextField;
	import flash.text.TextFormat;
	import flash.text.TextFormatAlign;
	
	/**
	 * ...
	 * @author Perzak
	 */
	public class ProgressIndicator extends Sprite {
		
		private var prog:Sprite;
		private var w:int;
		private var h:int;
		private var percentage:Number;
		private var txt:TextField;
		
		public function ProgressIndicator(animateIn:Boolean, percentage:Number, w:int, h:int) {
			this.w = w;
			this.h = h;
			this.percentage = percentage;
			
			txt = new TextField();
			txt.embedFonts = true;
			txt.defaultTextFormat = new TextFormat("andale", 12, 0xffffff, null, null,null,null,null, TextFormatAlign.RIGHT);
			txt.selectable = false;
			txt.width = 40;
			txt.height = 15;
			addChild(txt);
			if(percentage > 0){
				txt.text = int(percentage * 100) + "%";
			} else {
				txt.text = "X";
			}
			//DrawBg();
			//DrawProg();
			//if (animateIn) {
			//	var origW:Number = prog.width;
			//	prog.width = 1;
			//	TweenLite.to(prog, 0.5, {width: origW});
			//}
		}
		
		private function DrawBg():void {
			graphics.beginFill(0xbbbbbb, 1);
			graphics.lineStyle(2, 0);
			graphics.drawRect(0, 0, w, h);
		}
		
		private function DrawProg():void {
			prog = new Sprite();
			if(percentage < 1){
				prog.graphics.beginFill(0xffff00);
			} else {
				prog.graphics.beginFill(0x00ff00);
			}
			prog.graphics.drawRect(1, 1, (w - 2) * percentage, h - 2);
			addChild(prog);
		}
	
	}

}