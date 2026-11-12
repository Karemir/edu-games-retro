package Visuals 
{
	import flash.display.Sprite;
	import flash.events.MouseEvent;
	import flash.utils.Timer;
	import Proxies.GameData;
	
	/**
	 * ...
	 * @author Perzka Michalowy
	 */
	public class BookingScreen extends Sprite 
	{
		public var track1:BookingBoard;
		public var track2:BookingBoard;
		public var track3:BookingBoard;
		public var scores:ScoreBoard;
		
		public var desiredWidth:int;
		public var desiredHeight:int;
		
		public var gameData:GameData;
		private var timer:Timer;
		
		public function BookingScreen(w:int, h:int, gameData:GameData) 
		{
			desiredWidth = w;
			desiredHeight = h;
			this.gameData = gameData;
			
			scores = new ScoreBoard(gameData);
			scores.LayoutEntries(false);

			var trackContainer:Sprite = new Sprite();
			trackContainer.addChild(track1); 
			trackContainer.addChild(track2);
			trackContainer.addChild(track3);
			trackContainer.addChild(scores);
			
			track1.x = 0;
			track2.x = track1.x + track1.width + 30;
			track3.x = track2.x + track2.width + 30;
			scores.x = track3.x + track3.width + 50;
			
			track1.y = trackContainer.height / 2 - track1.height / 2;
			track2.y = trackContainer.height / 2 - track2.height / 2;
			track3.y = trackContainer.height / 2 - track3.height / 2;
			
			addChild(trackContainer);
			trackContainer.x = desiredWidth / 2 - trackContainer.width / 2;
			trackContainer.y = desiredHeight / 2 - trackContainer.height / 2;
			
			EnableSelecting();
		}
		
		private function OnBoardClicked(e:MouseEvent):void {
			var trg:BookingBoard = e.currentTarget as BookingBoard;
			if (trg == track1 && !track1.IsFull()) {
				AppFacade.GetInstance().sendNotification(Events.MENU_TRACK_SELECTED, 1);
				DisableSelecting();
			} else if (trg == track2 && !track2.IsFull()) {
				AppFacade.GetInstance().sendNotification(Events.MENU_TRACK_SELECTED, 2);
				DisableSelecting();
			} else if (trg == track3 && !track3.IsFull()) {
				AppFacade.GetInstance().sendNotification(Events.MENU_TRACK_SELECTED, 3);
				DisableSelecting();
			}
		}
		
		private function EnableSelecting():void {
			track1.addEventListener(MouseEvent.CLICK, OnBoardClicked);
			track2.addEventListener(MouseEvent.CLICK, OnBoardClicked);
			track3.addEventListener(MouseEvent.CLICK, OnBoardClicked);
		}
		
		private function DisableSelecting():void {
			track1.removeEventListener(MouseEvent.CLICK, OnBoardClicked);
			track2.removeEventListener(MouseEvent.CLICK, OnBoardClicked);
			track3.removeEventListener(MouseEvent.CLICK, OnBoardClicked);
		}
	}
}