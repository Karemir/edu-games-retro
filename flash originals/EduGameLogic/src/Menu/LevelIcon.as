package Menu 
{
	import flash.display.Bitmap;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.text.TextField;
	import flash.text.TextFieldAutoSize;
	import flash.text.TextFormat;
	import Proxies.SaveData;
	
	/**
	 * Represents a single level in selection screen.
	 * Also shows stars if the level is completed
	 * @author ...
	 */
	public class LevelIcon extends Sprite 
	{
		public var status:int;
		public var levelId:int;
		
		public function LevelIcon(levelId:int, status:int) 
		{
			addEventListener(MouseEvent.CLICK, onSelected);
			buttonMode = true;
			mouseChildren = false;
			this.levelId = levelId;
			
			addChild(Content.GetBitmap("levelSelector"));
			
			var txt:TextField = new TextField();
			txt.defaultTextFormat = new TextFormat("8bit", 18);
			txt.text = (levelId + 1) + "";
			txt.autoSize = TextFieldAutoSize.LEFT;
			txt.embedFonts = true;
			addChild(txt);
			txt.x = width / 2 - txt.width / 2 - 4;
			txt.y = 80 / 2 - txt.height / 2;
			
			var s1:Bitmap;
			var s2:Bitmap;
			var s3:Bitmap;

			switch(status) {
				case SaveData.LEVEL_3_STAR:
					s1 = Content.GetBitmap("starYes");
					s2 = Content.GetBitmap("starYes");
					s3 = Content.GetBitmap("starYes");
					break;
				case SaveData.LEVEL_2_STAR:
					s1 = Content.GetBitmap("starYes");
					s2 = Content.GetBitmap("starYes");
					s3 = Content.GetBitmap("starNo");
					break;
				case SaveData.LEVEL_1_STAR:
					s1 = Content.GetBitmap("starYes");
					s2 = Content.GetBitmap("starNo");
					s3 = Content.GetBitmap("starNo");
					break;
				case SaveData.LEVEL_NOT_COMPLETED:
					s1 = new Bitmap();
					s2 = new Bitmap();
					s3 = new Bitmap();
					break;
			}
			
			addChild(s1);
			addChild(s2);
			addChild(s3);
						
			s1.y = 71;
			s2.y = 71;
			s3.y = 71;
			
			s1.x = 5;
			s2.x = s1.width + s1.x;
			s3.x = s2.width + s2.x;
		}
		
		private function onSelected(e:Event):void {
			removeEventListener(MouseEvent.CLICK, onSelected);
			AppFacade.GetInstance().sendNotification(Events.MENU_LEVEL_SELECTED, stage, levelId.toString());
		}
	}

}