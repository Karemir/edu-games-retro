package Visuals {
	import com.greensock.TweenLite;
	import flash.display.Bitmap;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.text.TextField;
	import Proxies.GameData;
	import Proxies.Sounds;
	
	/**
	 * ...
	 * @author Michal Perzak
	 */
	public class SummaryMap extends Sprite {
		[Embed(source="../../Assets/raceTracksScreen.png")]
		private var mapCl:Class;
		
		public var map:Bitmap;
		
		public var race1Score:TextField;
		public var race2Score:TextField;
		public var race3Score:TextField;
		public var race4Score:TextField;
		
		public var race1Btn:Sprite;
		public var race2Btn:Sprite;
		public var race3Btn:Sprite;
		public var race4Btn:Sprite;
		public var nextRaceBtn:Sprite;
		public var popup:Sprite;
		
		public var selectedRace:String;
		
		public function SummaryMap() {
			map = new mapCl() as Bitmap;
			map.smoothing = true;
			addChild(map);
			
			race1Btn = new Sprite();
			race1Btn.addChild(Content.GetBitmap("tick"));
			race2Btn = new Sprite();
			race2Btn.addChild(Content.GetBitmap("tick"));
			race3Btn = new Sprite();
			race3Btn.addChild(Content.GetBitmap("tick"));
			race4Btn = new Sprite();
			race4Btn.addChild(Content.GetBitmap("tick"));
			
			race1Score = TextStyles.CreateSummaryRaceScore("100", 0x799f1c);
			race2Score = TextStyles.CreateSummaryRaceScore("100", 0x799f1c);
			race3Score = TextStyles.CreateSummaryRaceScore("100", 0x799f1c);
			race4Score = TextStyles.CreateSummaryRaceScore("100", 0x799f1c);
			
			nextRaceBtn = new Sprite();
			nextRaceBtn.addChild(Content.GetBitmap("raceStartBtn"));
			addChild(nextRaceBtn);
			nextRaceBtn.addEventListener(MouseEvent.CLICK, onNext);
			nextRaceBtn.buttonMode = true;
			
			nextRaceBtn.x = 100;
			nextRaceBtn.y = 290;
			
			addChild(race1Btn);
			addChild(race1Score);
			addChild(race2Btn);
			addChild(race2Score);
			addChild(race3Btn);
			addChild(race3Score);
			addChild(race4Btn);
			addChild(race4Score);
			
			race1Btn.x = 288;
			race1Btn.y = 118;
			race1Btn.name = "0";
			race2Btn.x = 308;
			race2Btn.y = 211;
			race2Btn.name = "1";
			race3Btn.x = 390;
			race3Btn.y = 278;
			race3Btn.name = "2";
			race4Btn.x = 470;
			race4Btn.y = 233;
			race4Btn.name = "3";
			
			race1Score.x = 631;
			race1Score.y = 175;
			race2Score.x = 631;
			race2Score.y = 232;
			race3Score.x = 631;
			race3Score.y = 289;
			race4Score.x = 631;
			race4Score.y = 346;
			
			race1Btn.buttonMode = true;
			race2Btn.buttonMode = true;
			race3Btn.buttonMode = true;
			race4Btn.buttonMode = true;
			
			race1Btn.addEventListener(MouseEvent.MOUSE_OVER, onHoverIn);
			race1Btn.addEventListener(MouseEvent.MOUSE_OUT, onHoverOut);
			race1Btn.addEventListener(MouseEvent.CLICK, onClick);
			race2Btn.addEventListener(MouseEvent.MOUSE_OVER, onHoverIn);
			race2Btn.addEventListener(MouseEvent.MOUSE_OUT, onHoverOut);
			race2Btn.addEventListener(MouseEvent.CLICK, onClick);
			race3Btn.addEventListener(MouseEvent.MOUSE_OVER, onHoverIn);
			race3Btn.addEventListener(MouseEvent.MOUSE_OUT, onHoverOut);
			race3Btn.addEventListener(MouseEvent.CLICK, onClick);
			race4Btn.addEventListener(MouseEvent.MOUSE_OVER, onHoverIn);
			race4Btn.addEventListener(MouseEvent.MOUSE_OUT, onHoverOut);
			race4Btn.addEventListener(MouseEvent.CLICK, onClick);
		}
		
		public function SetScores(r1:int, r2:int, r3:int, r4:int):void {
			race1Score.text = r1 + "";
			race2Score.text = r2 + "";
			race3Score.text = r3 + "";
			race4Score.text = r4 + "";
			selectedRace = race1Btn.name;
			
			if (r4 == GameData.SCORING[0]) {
				var p4:Bitmap = Content.GetBitmap("PrizeSmall");
				p4.x = race4Btn.width / 2;
				p4.y = race4Btn.height / 2;
				p4.width = 36;
				p4.height = 42;
				race4Btn.addChild(p4);
				race4Btn.tabIndex = 4; // .mouseEnabled = false;
			} else {
				selectedRace = race4Btn.name;
			}
			if (r3 == GameData.SCORING[0]) {
				var p3:Bitmap = Content.GetBitmap("PrizeSmall");
				p3.x = race3Btn.width / 2;
				p3.y = race3Btn.height / 2;
				p3.width = 36;
				p3.height = 42;
				race3Btn.addChild(p3);
				race3Btn.tabIndex = 3; // .mouseEnabled = false;
			} else {
				selectedRace = race3Btn.name;
			}
			if (r2 == GameData.SCORING[0]) {
				var p2:Bitmap = Content.GetBitmap("PrizeSmall");
				p2.x = race2Btn.width / 2;
				p2.y = race2Btn.height / 2;
				p2.width = 36;
				p2.height = 42;
				race2Btn.addChild(p2);
				race2Btn.tabIndex = 2; // .mouseEnabled = false;
			} else {
				selectedRace = race2Btn.name;
			}
			
			if (r1 == GameData.SCORING[0]) {
				var p1:Bitmap = Content.GetBitmap("PrizeSmall");
				p1.x = race1Btn.width / 2;
				p1.y = race1Btn.height / 2;
				p1.width = 36;
				p1.height = 42;
				race1Btn.addChild(p1);
				race1Btn.tabIndex = 1;// .mouseEnabled = false;
			} else {
				selectedRace = race1Btn.name;
			}
			
			selectTrack(selectedRace);
		}
		
		private function onHoverIn(e:Event):void {
			var img:Sprite = e.currentTarget as Sprite;
			img.getChildAt(0).alpha = 0.7;
			Logger.Log(img.name);
		}
		
		private function onHoverOut(e:Event):void {
			var img:Sprite = e.currentTarget as Sprite;
			if(selectedRace != img.name){
				img.getChildAt(0).alpha = 0;
			}
		}
		
		private function onClick(e:Event):void {
			Sounds.MenuClickSound();
			var img:Sprite = e.currentTarget as Sprite;
			selectTrack(img.name);
			//AppFacade.GetInstance().sendNotification(Events.MENU_RACE_SELECTED, img.name);
		}
		
		private function selectTrack(trackId:String):void {
			race1Btn.getChildAt(0).alpha = 0;
			race2Btn.getChildAt(0).alpha = 0;
			race3Btn.getChildAt(0).alpha = 0;
			race4Btn.getChildAt(0).alpha = 0;
			selectedRace = trackId;
			var img:Sprite = getChildByName(trackId) as Sprite;
			img.getChildAt(0).alpha = 1;
			
			if (img.name == "2") {
				ShowPopup(img.x + 10, img.y + 60);
			} else {
				ShowPopup(img.x + 10, img.y - 30);
			}
		}
		
		private function onNext(e:Event):void {
			Sounds.MenuClickSound();
			if (!selectedRace || selectedRace.length == 0) return;
			AppFacade.GetInstance().sendNotification(Events.MENU_RACE_SELECTED, selectedRace);
		}
		
		private function ShowPopup(x:int,y:int):void {
			if (popup) {
				var tmp:Sprite = popup;
				TweenLite.to(tmp, 0.3, { alpha:0, onComplete: function():void { removeChild(tmp); }} );
				popup = null;
			}
			var popbmp:Bitmap = Content.GetBitmap("race" + selectedRace + "Name");
			popup = new Sprite();
			popup.addChild(popbmp);
			popup.alpha = 0;
			popup.x = x - popup.width / 2;
			popup.y = y - popup.height / 2;
			addChild(popup);
			TweenLite.to(popup, 0.4, { alpha:1 } );
		}
	}

}