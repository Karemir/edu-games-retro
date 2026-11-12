package  {
	import Achievements.GardenMediator;
	import flash.display.Bitmap;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import VisualParts.SoundPanel;
	import VisualParts.TextButton;
	import VisualParts.TowerBlock;
	import VisualParts.TowerBlockAddon;
	import VisualParts.TowerRoof;
	/**
	 * ...
	 * @author Perz
	 */
	public class MenuView extends Sprite{
		
		[Embed(source = "../Assets/btnArcade.png")]private var btnArcadeImg:Class;
		[Embed(source = "../Assets/btnFreeplay.png")]private var btnFreeplayImg:Class;
		[Embed(source = "../Assets/btnGarden.png")]private var btnGardenImg:Class;
		
		public var projectLogo:Sprite;
		public var bg:Bitmap;
		
		public var btnArcade:TextButton;
		public var btnFreeplay:TextButton;
		public var btnGarden:TextButton;
		public var soundPanel:SoundPanel;
		
		public function MenuView() {
			
			projectLogo = new Sprite();
			projectLogo.graphics.beginFill(0, 0);
			projectLogo.graphics.drawRect(0, 0, 110, 110);
			
			bg = Content.GetBmp("bgBmp");
			soundPanel = new SoundPanel();
			
			var bmp:Bitmap = new btnArcadeImg();
			bmp.smoothing = true;
			btnArcade = new TextButton(null, bmp);

			bmp = new btnFreeplayImg();
			bmp.smoothing = true;
			btnFreeplay = new TextButton(null, bmp);
			var gardenBmp:Bitmap =  new btnGardenImg();
			gardenBmp.smoothing = true;
			btnGarden = new TextButton(null, gardenBmp);
			
			addChild(bg);
			addChild(projectLogo);

			addChild(btnArcade);
			addChild(btnFreeplay);
			addChild(btnGarden);
			
			soundPanel.x = 10;
			soundPanel.y = 450;
			addChild(soundPanel);
			
			addEventListener(Event.ADDED_TO_STAGE, OnAdded);
		}
		
		private function OnAdded(e:Event):void {
			projectLogo.x = stage.stageWidth - projectLogo.width; //10;
			projectLogo.y = 0;//euLogo.y - 10 - projectLogo.height;
			projectLogo.buttonMode = true;
			
			bg.width = stage.stageWidth;
			bg.height = stage.stageHeight;
			
			btnArcade.x = 495;
			btnArcade.y = 330;
			btnFreeplay.x = 626;
			btnFreeplay.y = 330;
			
			btnGarden.x = 856;
			btnGarden.y = 382;

			btnArcade.addEventListener(MouseEvent.CLICK, OnArcade);
			btnFreeplay.addEventListener(MouseEvent.CLICK, OnFreeplay);
			btnGarden.addEventListener(MouseEvent.CLICK, OnGarden);
			
			projectLogo.addEventListener(MouseEvent.CLICK, OnProjectLogo);
			
			//Debug();
		}
		
		private function Debug():void {
			for (var i:int = TowerBlock.TYPE_A; i <= TowerBlock.TYPE_D; ++i) {
				for (var j:int = 0; j < TowerBlockAddon.GetAddonCount(i); ++j) {
					var t:TowerBlock = new TowerBlock(i, 0);
					t.x = 200 * i;
					t.y = 100 * j + 90;
					addChild(t);
					
					var ad:TowerBlockAddon = new TowerBlockAddon(t, j);
					ad.Show();
				}
			}
		}
		
		private function OnArcade(e:Event):void {
			soundPanel.soundProxy.EffectClick();
			AppFacade.GetInstance().sendNotification(Events.NAVIGATION_GAME_ARCADE, stage);
		}
		
		private function OnFreeplay(e:Event):void {
			soundPanel.soundProxy.EffectClick();
			AppFacade.GetInstance().sendNotification(Events.NAVIGATION_GAME_FREEPLAY, stage);
		}
		
		private function OnGarden(e:Event):void {
			soundPanel.soundProxy.EffectClick();
			AppFacade.GetInstance().registerMediator(new GardenMediator(stage));
			//AppFacade.GetInstance().sendNotification(Events.NAVIGATION_GAME_ARCADE, stage);
		}

		private function OnAchievement(e:Event):void {
			soundPanel.soundProxy.EffectClick();
			//AppFacade.GetInstance().sendNotification(Events.NAVIGATION_GAME_ARCADE, stage);
		}
		
		private function OnProjectLogo(e:Event):void {
			soundPanel.soundProxy.EffectClick();
			AppFacade.GetInstance().sendNotification(Events.NAVIGATION_URL, "http://www.grawklasy.edu.pl/");
		}
	}

}