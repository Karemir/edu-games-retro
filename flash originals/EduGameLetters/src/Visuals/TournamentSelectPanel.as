package Visuals {
	import com.greensock.TweenLite;
	import flash.display.Bitmap;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.text.TextField;
	import Mediators.MenuMediator;
	import Proxies.GameData;
	import Proxies.Sounds;
	
	/**
	 * ...
	 * @author Michal Perzak
	 */
	public class TournamentSelectPanel extends Sprite {
		[Embed(source = "../../Assets/raceBg.png")] private var bgBmp:Class;
		[Embed(source = "../../Assets/race1Btn.png")] private var race1Bmp:Class;
		[Embed(source = "../../Assets/race2Btn.png")] private var race2Bmp:Class;
		[Embed(source = "../../Assets/race3Btn.png")] private var race3Bmp:Class;
		
		public var bg:Bitmap;
		public var race1Btn:Sprite;
		public var race2Btn:Sprite;
		public var race3Btn:Sprite;
		public var backBtn:Sprite;
		
		public var txtProgress:TextField;
		public var gameData:GameData;
		
		public var onTournamentSelect:Function;
		
		public function TournamentSelectPanel(onSelect:Function) {
			gameData = AppFacade.GetInstance().retrieveProxy(GameData.NAME) as GameData;
			onTournamentSelect = onSelect;
			bg = new bgBmp();
			bg.smoothing = true;
			race1Btn = new TextButton("", new race1Bmp());
			race2Btn = new TextButton("", new race2Bmp());
			race3Btn = new TextButton("", new race3Bmp());
			
			addChild(bg);
		
			txtProgress = TextStyles.CreateBoldText(gameData.GetTotalCompletion() + "%", 0x799f1c);
			txtProgress.x = 236;
			txtProgress.y = 315;
			addChild(txtProgress);
			
			race1Btn.x = 320;
			race1Btn.y = 33;
			race1Btn.name = "0";
			race2Btn.x = 455;
			race2Btn.y = 33;
			race2Btn.name = "1";
			race3Btn.x = 590;
			race3Btn.y = 25;
			race3Btn.name = "2";
			
			race1Btn.addEventListener(MouseEvent.CLICK, OnSelected);
			race2Btn.addEventListener(MouseEvent.CLICK, OnSelected);
			race3Btn.addEventListener(MouseEvent.CLICK, OnSelected);

			addEventListener(Event.ADDED_TO_STAGE, onAdded);
		}
			
		public function onAdded(e:Event):void {			
			backBtn = new Sprite();
			backBtn.addChild(Content.GetBitmap("backBtn"));
			backBtn.addEventListener(MouseEvent.CLICK, OnBack);
			backBtn.buttonMode = true;
			backBtn.x = -25;
			backBtn.y = stage.height - backBtn.height - 140;
			backBtn.alpha = 0;
			TweenLite.to(backBtn, 0.5, { alpha: 1, delay:1 } );
			addChild(backBtn)
			
			ShowTournaments();
			ShowPrizes();
		}
		
		private function ShowTournaments():void {
			if (gameData.tournamentStatuses[2] >= GameData.TOURNAMENT_AVAILABLE) {
				addChild(race3Btn);
			}
			if (gameData.tournamentStatuses[1] >= GameData.TOURNAMENT_AVAILABLE) {
				addChild(race2Btn);
			}
			if (gameData.tournamentStatuses[0] >= GameData.TOURNAMENT_AVAILABLE) {
				addChild(race1Btn);
			}
		}
		
		private function ShowPrizes():void {
			if (gameData.tournamentStatuses[0] == GameData.TOURNAMENT_WON) {
				var p1:Bitmap = Content.GetBitmap("PrizeBig");
				p1.x = 61;
				p1.y = 255;
				race1Btn.addChild(p1);
			}

			if (gameData.tournamentStatuses[1] == GameData.TOURNAMENT_WON) {
				var p2:Bitmap = Content.GetBitmap("PrizeBig");
				p2.x = 61;
				p2.y = 255;
				race2Btn.addChild(p2);
			}
			
			if (gameData.tournamentStatuses[2] == GameData.TOURNAMENT_WON) {
				var p3:Bitmap = Content.GetBitmap("PrizeBig");
				p3.x = 61;
				p3.y = 255;
				race3Btn.addChild(p3);
			}
		}
		
		private function OnSelected(e:Event):void {
			Sounds.MenuClickSound();
			var trg:Sprite = e.currentTarget as Sprite;
			onTournamentSelect(trg.name);
		}
		
		private function OnBack(e:Event):void {
			Sounds.MenuClickSound();
			AppFacade.GetInstance().sendNotification(Events.NAVIGATE_MAIN_MENU, stage, MenuMediator.NAME);
		}
	}

}