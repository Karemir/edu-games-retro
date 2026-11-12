package Achievements.Components 
{
	import Achievements.Achievement;
	import com.greensock.TweenLite;
	import flash.display.Bitmap;
	import flash.display.BitmapData;
	import flash.display.Sprite;
	import flash.geom.Point;
	import flash.text.TextField;
	import flash.text.TextFieldAutoSize;
	import flash.text.TextFormat;
	import flash.text.TextFormatAlign;
	
	/**
	 * ...
	 * @author Perzak
	 */
	public class AchievementInfoPanel extends Sprite 
	{
		[Embed(source = "../../../Assets/Klepon Scone.ttf", fontName = "klepone", fontFamily = "klepone", fontStyle = "normal", fontWeight = "normal", mimeType = "application/x-font", embedAsCFF = "false")] 
		private var fontKlepone:Class;

		[Embed(source = "../../../Assets/popup.png")] 
		private static var bgCl:Class;
		
		public var bg:Bitmap;
		public var title:TextField;
		public var message:TextField;
		public var prizeName:TextField;

		public function AchievementInfoPanel() {
			title = CreateTitleText("TITLE");
			message = CreateNormalText("some very long description message long lon long long long long");
			prizeName = CreateNormalText("Funny name", 0x4CA825);
			bg = new bgCl();
			bg.smoothing = true;
			
			addChild(bg);
			addChild(title);
			addChild(prizeName);
			addChild(message);
			
			bg.height += 10;
			bg.x = -bg.width;
			bg.y = -bg.height / 2;
			title.x = bg.x + 10;
			title.y = bg.y + 2;
			prizeName.x = title.x;
			prizeName.y = title.y + 25;
			message.x = prizeName.x;
			message.y = prizeName.y + 25;
		}
		
		public function ShowInfo(ach:Achievement, pt:Point):void {
			var me:AchievementInfoPanel = this;
			if (alpha > 0) {
				Hide(function():void { UpdateAndShow(ach, pt); } );
			} else {
				UpdateAndShow(ach, pt);
			}
		}
		
		private function UpdateAndShow(ach:Achievement, pt:Point):void {
			this.x = pt.x;
			this.y = pt.y;
			title.text = ach.title;
			message.text = ach.description;
			prizeName.text = ach.prizeName;
			Show(null);
		}
				
		public function Show(cb:Function):void {
			if (cb != null) {
				TweenLite.to(this, 0.4, { alpha:1, onComplete: cb } );
			} else {
				TweenLite.to(this, 0.4, { alpha:1 } );
			}
		}
		
		public function Hide(cb:Function):void {
			if(cb != null){
				TweenLite.to(this, 0.4, { alpha:0, onComplete: cb } );
			} else {
				TweenLite.to(this, 0.4, { alpha:0 } );
			}
		}

		public static function CreateNormalText(text:String, color:uint = 0):TextField {
			var txt:TextField = new TextField();
			txt.selectable = false;
			txt.multiline = true;
			txt.wordWrap = true;
			txt.autoSize = TextFieldAutoSize.NONE;
			
			var tf:TextFormat = new TextFormat("klepone", 16, color);
			tf.align = TextFormatAlign.LEFT;
			
			txt.width = 170;
			txt.height = 100;
			txt.defaultTextFormat = tf;
			txt.text = text;
			txt.embedFonts = true;
			
			return txt;
		}
		
		public static function CreateTitleText(text:String, color:uint = 0):TextField {
			var txt:TextField = new TextField();
			txt.selectable = false;
			txt.multiline = false;
			txt.autoSize = TextFieldAutoSize.LEFT;
			txt.defaultTextFormat = new TextFormat("klepone", 22, color, true);
			txt.text = text;
			txt.embedFonts = true;
			
			return txt;
		}
	}
}
