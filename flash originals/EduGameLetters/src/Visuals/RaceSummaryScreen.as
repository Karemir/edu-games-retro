package Visuals {
	import com.greensock.easing.Circ;
	import com.greensock.TweenLite;
	import flash.desktop.ClipboardFormats;
	import flash.display.Bitmap;
	import flash.display.DisplayObject;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.events.TimerEvent;
	import flash.utils.Timer;
	import Mediators.RaceLogic;
	import Mediators.RaceSummaryLogic;
	import Proxies.GameData;
	import Proxies.RaceData;
	import Proxies.Sounds;
	
	/**
	 * ...
	 * @author Michal Perzak
	 */
	public class RaceSummaryScreen extends Sprite {
		public var bg:Bitmap;
		public var map:SummaryMap;
		public var gameData:GameData;
		
		public var backBtn:Sprite;
		
		public function RaceSummaryScreen(gameData:GameData) {
			this.gameData = gameData;
			
			addEventListener(Event.ADDED_TO_STAGE, onAdded);
		}
		
		private function onAdded(e:Event):void {
			bg = Content.GetBitmap("menuBg");
			addChild(bg);
			
			var overlay:Sprite = new Sprite();
			overlay.graphics.beginFill(0xffffff, 0.7);
			overlay.graphics.drawRect(0, 0, stage.stageWidth, stage.stageHeight);
			addChild(overlay);
			
			map = new SummaryMap();
			addChild(map);
			
			map.x = stage.stageWidth;
			map.y = 20;
			
			backBtn = new Sprite();
			backBtn.addChild(Content.GetBitmap("backBtn"));
			backBtn.addEventListener(MouseEvent.CLICK, onBack);
			backBtn.buttonMode = true;
			backBtn.x = 15;
			backBtn.y = stage.height - backBtn.height - 130;
			addChild(backBtn)
	
			TweenLite.to(map, 0.9, {x: stage.stageWidth / 2 - map.width / 2, ease: Circ.easeOut});
			InitRaceButtons();
		}
		
		private function onClick(e:MouseEvent):void {
			AppFacade.GetInstance().sendNotification(Events.GAME_SUMMARY_NEXT);
		}
		
		private function onBack(e:MouseEvent):void {
			AppFacade.GetInstance().sendNotification(Events.GAME_CYCLE_SCREENS, AppFacade.GetInstance().retrieveMediator(RaceSummaryLogic.NAME), "menu");
		}
		
		private function InitRaceButtons():void {
			var scores:Array = gameData.tournamentResults[gameData.currentTournament];
			map.SetScores(scores[0], scores[1], scores[2], scores[3]);
		}
		
		private function OnRaceSelected(e:MouseEvent):void {
			var btn:Sprite = e.currentTarget as Sprite;
			if (btn) {
				AppFacade.GetInstance().sendNotification(Events.MENU_RACE_SELECTED, int(btn.name));
			}
		}
	}

}