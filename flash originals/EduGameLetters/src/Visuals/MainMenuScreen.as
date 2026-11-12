package Visuals {
	import Achievements.GardenMediator;
	import com.greensock.easing.Bounce;
	import com.greensock.easing.Circ;
	import com.greensock.loading.BinaryDataLoader;
	import com.greensock.TweenLite;
	import flash.display.Bitmap;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import Proxies.Data.RacerData;
	import Proxies.Data.VehicleData;
	import Proxies.GameData;
	import Proxies.Sounds;
	
	/**
	 * ...
	 * @author Perzka Michalowy
	 */
	public class MainMenuScreen extends Sprite {
		
		[Embed(source="../../Assets/newGameBtn.png")]
		private var bmpNewGame:Class;
		[Embed(source="../../Assets/resumeGameBtn.png")]
		private var bmpResumeGame:Class;
		[Embed(source="../../Assets/achievementsBtn.png")]
		private var bmpAchievements:Class;
		[Embed(source="../../Assets/gardenBtn.png")]
		private var bmpGarden:Class;
		
		public var bgImg:Bitmap;
		public var newGame:TextButton;
		public var resume:TextButton;
		public var achievements:TextButton;
		public var garden:TextButton;
		public var projectLogo:Sprite;
		
		public var overlay:Sprite;
		public var newGamePanel:NewGameSelectionPanel;
		public var tournamentPanel:TournamentSelectPanel;
		
		public var currentPanel:Sprite;
		public var soundPanel:SoundPanel;
		
		public function MainMenuScreen() {
			bgImg = Content.GetBitmap("menuBg");
			addChild(bgImg);
			
			resume = new TextButton("", new bmpResumeGame());
			newGame = new TextButton("", new bmpNewGame());
			garden = new TextButton("", new bmpGarden());
			achievements = new TextButton("", new bmpAchievements());

			projectLogo = new Sprite();
			projectLogo.graphics.beginFill(0, 0);
			projectLogo.graphics.drawRect(0, 0, 110, 110);
			
			//addChild(resume);
			addChild(newGame);
			addChild(garden);
			addChild(projectLogo);
			//addChild(achievements);
			
			resume.addEventListener(MouseEvent.CLICK, OnLoadGamePress);
			newGame.addEventListener(MouseEvent.CLICK, OnNewGamePress);
			garden.addEventListener(MouseEvent.CLICK, OnGarden);
			
			addEventListener(Event.ADDED_TO_STAGE, OnAdded);
		}
		
		private function OnAdded(e:Event):void {
			garden.x = 852;
			garden.y = 378;
			
			achievements.x = garden.x - achievements.width - 8;
			achievements.y = garden.y;
			newGame.y = resume.y;
			
			overlay = new Sprite();
			
			resume.x = 621;
			resume.y = 326;
			
			newGame.x = 721;
			newGame.y = 340;
			overlay.alpha = 0;
			overlay.graphics.beginFill(0xffffff);
			overlay.graphics.drawRect(0, 0, stage.stageWidth, stage.stageHeight);
			
			soundPanel = new SoundPanel();
			soundPanel.x = 10;
			soundPanel.y = 450;
			addChild(soundPanel);
						
			projectLogo.x = stage.stageWidth - projectLogo.width;
			projectLogo.y = 0;
			projectLogo.buttonMode = true;

			newGamePanel = new NewGameSelectionPanel(ShowSelectTournament);	
			SetLoadButtonVisible();
						
			projectLogo.addEventListener(MouseEvent.CLICK, OnProjectLogo);
			//debug();
		}
		
		public function SetLoadButtonVisible():void {
			resume.visible = GameData.HasSavedGame();
		}
		
		public function HandleKeypress(keycode:uint):void {
			if (newGamePanel) {
				newGamePanel.HandleNameKey(keycode);
			}
		}
		
		private function OnNewGamePress(e:Event):void {
			Sounds.MenuClickSound();
			if (!currentPanel) {
				currentPanel = newGamePanel;
				addChild(overlay);
				addChild(newGamePanel);
				
				newGamePanel.x = stage.stageWidth;
				newGamePanel.y = 20;
				TweenLite.to(newGamePanel, 0.9, {x: stage.stageWidth / 2 - newGamePanel.width / 2, ease: Circ.easeOut});
				
				TweenLite.to(overlay, 0.7, {alpha: 0.7});
			}
		}
		
		public function ShowSelectTournament():void {
			tournamentPanel = new TournamentSelectPanel(HideAndCycleScreens);
			addChild(tournamentPanel);
			if (currentPanel) {
				TweenLite.to(currentPanel, 0.5, {x: -currentPanel.width, onComplete: function():void {
						currentPanel = tournamentPanel;
					}});
			} else {
				overlay.alpha = 0.7;
				currentPanel = tournamentPanel;
			}
			if(!overlay.parent){
				addChildAt(overlay, 4);
			}
			tournamentPanel.x = stage.stageWidth;
			tournamentPanel.y = 20;
			TweenLite.to(tournamentPanel, 0.7, {delay: 0.5, x: stage.stageWidth / 2 - tournamentPanel.width / 2, ease: Circ.easeOut } );
		}
		
		public function HideNewGamePanel():void {
			if (newGamePanel) {
				TweenLite.to(newGamePanel, 0.7, {y: -newGamePanel.height, onComplete: function():void {
						removeChild(newGamePanel);
						newGamePanel = null;
					}});
				TweenLite.to(overlay, 0.7, {alpha: 0, onComplete: function():void {
						removeChild(overlay);
					}});
			}
		}
		
		public function HideAndCycleScreens(raceId:String):void {
			TweenLite.to(currentPanel, 0.5, {x: -currentPanel.width, onComplete: function():void {
				AppFacade.GetInstance().sendNotification(Events.MENU_TOURNAMENT_SELECTED, raceId);
			}});
		}
		
		private function OnLoadGamePress(e:MouseEvent):void {
			Sounds.MenuClickSound();
			if (newGamePanel)
				return;
		}

		private function OnGarden(e:MouseEvent):void {
			Sounds.MenuClickSound();
			AppFacade.GetInstance().registerMediator(new GardenMediator(stage));
		}
		
		private function OnProjectLogo(e:Event):void {
			soundPanel.soundProxy.EffectClick();
			AppFacade.GetInstance().sendNotification(Events.NAVIGATE_URL, "http://www.grawklasy.edu.pl/");
		}
		
		private function debug():void {
			var veh:VehicleData = new VehicleData();
			veh.racer = new RacerData();
			veh.racer.vehicleImageId = 3;
			
			var r:AnimatedRacer = new AnimatedRacer(veh);
			r.x = 300;
			r.y = 300;
			stage.addChild(r);
		}

	}

}