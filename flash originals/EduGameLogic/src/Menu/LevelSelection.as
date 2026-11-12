package Menu 
{
	import flash.display.Bitmap;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import Proxies.SaveData;
	import Proxies.Sounds;
	
	/**
	 * ...
	 * @author ...
	 */
	public class LevelSelection extends Sprite 
	{
		private var lvlIcons:Array;
		private var levelsIdFrom:int;
		private var numLevels:int;
		private var iconContainer:Sprite;
		private var saveData:SaveData;
		
		private var bg:Bitmap;
		private var backBtn:Sprite;
		
		public function LevelSelection(levelsFrom:int, numLevels:int) 
		{
			this.numLevels = numLevels;
			this.levelsIdFrom = levelsFrom;
			addEventListener(Event.ADDED_TO_STAGE, onAdded);
			lvlIcons = new Array();
		}
		
		private function onAdded(e:Event):void {
			removeEventListener(Event.ADDED_TO_STAGE, onAdded);
			
			bg = Content.GetBitmap("ambientBg");
			bg.width = stage.stageWidth;
			bg.height = stage.stageHeight;
			addChild(bg);
			bg.alpha = 0.7;
			
			var margin:int = 10;
			
			saveData = AppFacade.GetInstance().retrieveProxy(SaveData.NAME) as SaveData;
			iconContainer = new Sprite();
			addChild(iconContainer);
			
			var row:int = 0;
			
			for (var i:int = 0; i < numLevels; ++i) {
				var status:int = saveData.GetLevelStatus(i+levelsIdFrom);
				var icon:LevelIcon = new LevelIcon(i+levelsIdFrom, status);
				iconContainer.addChild(icon);
				lvlIcons.push(icon);
				
				var nextX:Number = margin + i * (icon.width + margin);
				row = i / 10;	
				
				icon.x = margin + (i%10) * (icon.width + margin) + 10;
				icon.y = margin + 200 + row * (icon.height + 5);
			}
			
			backBtn = new Sprite();
			var bmp:Bitmap = Content.GetBitmap("endBtnNext");
			bmp.scaleX = -1;
			backBtn.addChild(bmp);
			addChild(backBtn);
			backBtn.addEventListener(MouseEvent.CLICK, onBack);
			backBtn.buttonMode = true;
			
			backBtn.x = 10 + backBtn.width;
			backBtn.y = stage.stageHeight - backBtn.height - 10;
		}
		
		private function onBack(e:Event):void {
			(AppFacade.GetInstance().retrieveProxy(Sounds.NAME) as Sounds).EffectClick();
			AppFacade.GetInstance().sendNotification(Events.NAVIGATION_CHOOSE_DIF, stage);
		}
		
	}

}