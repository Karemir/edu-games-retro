package Menu {
	import Achievements.GardenMediator;
	import flash.display.Bitmap;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import Menu.SoundPanel;
	/**
	 * ...
	 * @author Perz
	 */
	public class MenuView extends Sprite{
		[Embed(source = "../../Assets/Logo_GwK.png")]private var projectLogoBmp:Class;
		[Embed(source = "../../Assets/Logo_eu.png")]private var euLogoBmp:Class;
		
		[Embed(source = "../../Assets/btnArcade.png")]private var btnArcadeImg:Class;
		[Embed(source = "../../Assets/btnGarden.png")]private var btnGardenImg:Class;
		
		
		public var euLogo:Bitmap;
		public var projectLogo:Sprite;
		public var bg:Bitmap;
		
		public var btnArcade:Sprite;
		public var btnGarden:Sprite;
		public var soundPanel:SoundPanel;
		
		public function MenuView() {
			euLogo = new euLogoBmp();
			
			projectLogo = new Sprite();
			//var projLogo:Bitmap = new projectLogoBmp();
			//projLogo.smoothing = true;
			//projectLogo.addChild(projLogo);
			projectLogo.graphics.beginFill(0, 0);
			projectLogo.graphics.drawRect(0, 0, 110, 110);
			
			bg = Content.GetBitmap("bgBmp");
			soundPanel = new SoundPanel();
			
			euLogo.smoothing = true;
			bg.smoothing = true;
			var bmp:Bitmap = new btnArcadeImg();
			bmp.smoothing = true;
			btnArcade = new Sprite();
			btnArcade.addChild(bmp);
			btnGarden = new Sprite();
			bmp = new btnGardenImg();
			bmp.smoothing = true;
			btnGarden.addChild(bmp);
			
			btnArcade.buttonMode = true;
			btnGarden.buttonMode = true;
			
			addChild(bg);
			addChild(projectLogo);

			addChild(btnArcade);
			addChild(btnGarden);
			
			soundPanel.x = 10;
			soundPanel.y = 450;
			addChild(soundPanel);
			
			addEventListener(Event.ADDED_TO_STAGE, OnAdded);
		}
		
		private function OnAdded(e:Event):void {
			euLogo.width = stage.stageWidth;
			euLogo.height = euLogo.scaleX * euLogo.height;
			euLogo.x = 0;
			euLogo.y = stage.stageHeight - euLogo.height;
			euLogo.alpha = 0.8;
			
			projectLogo.x = stage.stageWidth - projectLogo.width; //10;
			projectLogo.y = 0;//euLogo.y - 10 - projectLogo.height;
			projectLogo.buttonMode = true;
			
			bg.width = stage.stageWidth;
			bg.height = stage.stageHeight;
			
			btnArcade.x = 725;
			btnArcade.y = 325;
			
			btnGarden.x = 856;
			btnGarden.y = 382;
			
			btnArcade.addEventListener(MouseEvent.CLICK, OnArcade);
			btnGarden.addEventListener(MouseEvent.CLICK, OnGarden);
			
			projectLogo.addEventListener(MouseEvent.CLICK, OnProjectLogo);
			//Debug();
		}
		
		private function OnArcade(e:Event):void {
			soundPanel.soundProxy.EffectClick();
			AppFacade.GetInstance().sendNotification(Events.NAVIGATION_CHOOSE_DIF, stage);
		}
		
		private function OnGarden(e:Event):void {
			soundPanel.soundProxy.EffectClick();
			//AppFacade.GetInstance().registerMediator(new GardenMediator(stage));
			//AppFacade.GetInstance().sendNotification(Events.NAVIGATION_GAME_ARCADE, stage);
			AppFacade.GetInstance().registerMediator(new GardenMediator(stage));
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