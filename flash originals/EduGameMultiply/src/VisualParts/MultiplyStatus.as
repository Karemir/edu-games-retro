package VisualParts 
{
	import flash.display.Sprite;
	import flash.text.TextField;
	import flash.text.TextFieldAutoSize;
	import flash.text.TextFormat;
	import flash.text.TextFormatAlign;
	
	/**
	 * Shows current height and time left
	 * @author Perzka Michalowy
	 */
	public class MultiplyStatus extends Sprite 
	{
		public var heightValue:TextField;
		public var heightLabel:TextField;
		public var timeValue:TextField;
		public var timeLabel:TextField;
		
		private var heightBasePos:int;
		
		private var desiredWidth:int;
		private var desiredHeight:int;
		
		public function MultiplyStatus(w:int, h:int) 
		{
			desiredHeight = h;
			desiredWidth = w;
			
			var tf:TextFormat = new TextFormat("verdana", 16, 0);
			tf.align = TextFormatAlign.CENTER;
			
			heightLabel = new TextField();
			timeLabel = new TextField();
			timeValue = new TextField();
			heightValue = new TextField();
			
			tf.size = 20;
			tf.bold = true;
			heightLabel.defaultTextFormat = timeLabel.defaultTextFormat = tf;			
			heightValue.defaultTextFormat = timeValue.defaultTextFormat = tf;
			heightValue.textColor = 0xcbe089;
			timeValue.textColor = 0xcbe089;
			
			heightLabel.selectable = heightValue.selectable = timeLabel.selectable = timeValue.selectable = false;
			heightLabel.autoSize = heightValue.autoSize = timeLabel.autoSize = timeValue.autoSize = TextFieldAutoSize.LEFT;
			
			addChild(heightLabel);
			addChild(heightValue);
			addChild(timeLabel);
			addChild(timeValue);
			
			heightLabel.multiline = true;
			timeLabel.multiline = true;
			
			heightLabel.text = "m";
			timeLabel.text = "s";
			
			timeValue.text = "0";
			heightValue.text = "0";
			
			heightLabel.x = 75;
			heightLabel.y = 20;
			heightValue.x = heightBasePos = 88;
			heightValue.x -= heightValue.width / 2;
			
			timeValue.x = 255; //desiredWidth * 3 / 4 + 30;
			timeLabel.x = 270;//desiredWidth * 2 / 4 + 20;
			timeLabel.y = 20;
		}
		
		public function SetTowerHeight(h:int):void {
			if (h > 0)
				heightValue.text = h + "";// + " m";
			heightValue.x = heightBasePos - heightValue.width / 2;
		}
		
		public function SetTimeLeft(timeStr:String):void {
			timeValue.text = timeStr;
		}
		
	}

}