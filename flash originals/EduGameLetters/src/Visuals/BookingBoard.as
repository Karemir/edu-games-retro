package Visuals 
{
	import flash.display.Bitmap;
	import flash.display.Sprite;
	import flash.text.TextField;
	import Proxies.Data.RacerData;
	
	/**
	 * Represent singneg racers to a track.
	 * @author Perzka Michalowy
	 */
	public class BookingBoard extends Sprite 
	{
		public static const BOARD_WIDTH:int = 230;
		public static const BOARD_HEIGHT:int = 250;

		private var line1:TextField;
		private var line2:TextField;
		private var line3:TextField;
		private var line4:TextField;
		
		public var racers:Vector.<RacerData>
		public function BookingBoard(trackIcon:Bitmap) 
		{
			racers = new Vector.<RacerData>();
			buttonMode = true;
			mouseChildren = false;
			
			addChild(trackIcon);
			trackIcon.x = BOARD_WIDTH / 2 - trackIcon.width / 2;
			trackIcon.y = 10;
			
			line1 = TextStyles.CreateBookingEntry("1. ");
			line2 = TextStyles.CreateBookingEntry("2. ");
			line3 = TextStyles.CreateBookingEntry("3. ");
			line4 = TextStyles.CreateBookingEntry("4. ");
			
			addChild(line1);
			addChild(line2);
			addChild(line3);
			addChild(line4);
			
			line1.x = line2.x = line3.x = line4.x = 5;
			line1.y = trackIcon.y + trackIcon.height + 20;
			line2.y = line1.y + line1.height + 6;
			line3.y = line2.y + line2.height + 6;
			line4.y = line3.y + line3.height + 6;
			
			graphics.lineStyle(2, 0, 1);
			graphics.moveTo(line1.x, line1.y + line1.height + 3);
			graphics.lineTo(line1.x + (BOARD_WIDTH - line1.x - 5), line1.y + line1.height + 3);
			
			graphics.moveTo(line2.x, line2.y + line2.height + 3);
			graphics.lineTo(line2.x + (BOARD_WIDTH - line2.x - 5), line2.y + line2.height + 3);
			
			graphics.moveTo(line3.x, line3.y + line3.height + 3);
			graphics.lineTo(line3.x + (BOARD_WIDTH - line3.x - 5), line3.y + line3.height + 3);
			
			graphics.moveTo(line4.x, line4.y + line4.height + 3);
			graphics.lineTo(line4.x + (BOARD_WIDTH - line4.x - 5), line4.y + line4.height + 3);
			
			var maskSprite:Sprite = new Sprite();
			maskSprite.graphics.beginFill(0, 0);
			maskSprite.graphics.drawRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
			addChild(maskSprite);
			mask = maskSprite;
			
			graphics.beginFill(0x449977, 0.3);
			graphics.drawRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
		}
		
		public function AddRacer(racer:RacerData):void {
			if (racers.length == 4) return;
			var pos:uint = racers.push(racer);
			
			switch(pos) {
				case 1:
					line1.appendText(racer.name);
					break;
				case 2:
					line2.appendText(racer.name);
					break;
				case 3:
					line3.appendText(racer.name);
					break;
				case 4:
					line4.appendText(racer.name);
					break;
				default:
					Logger.Log("TOO MANY RACERS!!");
			}
		}
		
		public function IsFull():Boolean {
			return (racers.length == 4);
		}
		
	}

}