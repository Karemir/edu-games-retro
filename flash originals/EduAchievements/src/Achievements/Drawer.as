package Achievements {
	import flash.display.Bitmap;
	import flash.display.Sprite;
	
	/**
	 * ...
	 * @author Michal Perzak
	 */
	public class Drawer extends Sprite {
		[Embed(source="../../Assets/polka_dol.png")]
		private static var bmpBot:Class;
		[Embed(source="../../Assets/polka_gora.png")]
		private static var bmpTop:Class;
		[Embed(source="../../Assets/polka_srodek.png")]
		private static var bmpMid:Class;
		
		private var top:Bitmap;
		private var bot:Bitmap;
		private var midSegments:Vector.<Bitmap>;
		
		public function Drawer(items:Vector.<GardenItem>) {
			top = new bmpTop();
			bot = new bmpBot();
			midSegments = new Vector.<Bitmap>();
			var h:Number = 0;
			
			top.smoothing = true;
			bot.smoothing = true;
			top.scaleX = top.scaleY = 0.75;
			bot.scaleX = bot.scaleY = 0.75;
			
			top.x = 3;
			addChild(top);
			addChild(items[0]);
			h += top.height;
			items[0].y = h - 10;
			items[0].x = 65; // TODO: count proper middle and align.
			for (var i:int = 0; i < items.length - 1; ++i) {
				var tmp:Bitmap = new bmpMid();
				tmp.smoothing = true;
				tmp.scaleY = tmp.scaleX = 0.75;
				tmp.y = h;
				tmp.x = -1;
				h += tmp.height;
				midSegments.push(tmp);
				addChildAt(tmp, 0);
				
				var item:GardenItem = items[i + 1];
				addChild(item);
				item.y = h - 10;
				item.x = 65;
			}
			bot.x = 3;
			bot.y = h;
			addChildAt(bot, 0);
		}
	
	}

}