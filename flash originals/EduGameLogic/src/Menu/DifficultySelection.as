package Menu {
	import flash.display.Bitmap;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.filters.DropShadowFilter;
	import flash.geom.ColorTransform;
	import flash.text.TextField;
	import flash.text.TextFieldAutoSize;
	import flash.text.TextFormat;
	import Mediators.GameLogic;
	import Proxies.Sounds;
	
	/**
	 * ...
	 * @author Michal Perzak
	 */
	public class DifficultySelection extends Sprite {
		
		public var btnEasy:Sprite;
		public var btnMedium:Sprite;
		public var btnHard:Sprite;
		
		private var bg:Bitmap;
		private var backBtn:Sprite;
		
		public function DifficultySelection() {
			addEventListener(Event.ADDED_TO_STAGE, onAdded);
		}
		
		private function onAdded(e:Event):void {
			removeEventListener(Event.ADDED_TO_STAGE, onAdded);
			
			bg = Content.GetBitmap("ambientBg");
			bg.width = stage.stageWidth;
			bg.height = stage.stageHeight;
			addChild(bg);
			bg.alpha = 0.7;
			
			btnEasy = new Sprite();
			btnMedium = new Sprite();
			btnHard = new Sprite();
			
			btnEasy.addChild(Content.GetBitmap("lvlSelectEasy"));
			btnMedium.addChild(Content.GetBitmap("lvlSelectMedium"));
			btnHard.addChild(Content.GetBitmap("lvlSelectHard"));
			
			//tintColor(btnEasy, 0x22, 0xFF, 0x33, 1);
			//tintColor(btnMedium, 0xFF, 0xEA, 0x68, 1);
			//tintColor(btnHard, 0xFF, 0x6B, 0x51, 1);
			
			addChild(btnEasy);
			addChild(btnMedium);
			addChild(btnHard);
			
			var tf:TextFormat = new TextFormat("8bit", 27, 0xFFA63D);
			var txtEasy:TextField = new TextField();
			txtEasy.defaultTextFormat = tf;
			txtEasy.autoSize = TextFieldAutoSize.LEFT;
			txtEasy.text = "PROSTY";
			txtEasy.embedFonts = true;
			txtEasy.filters = [new DropShadowFilter(0, 0, 0, 1, 4, 4, 4)];
			txtEasy.x = (btnEasy.width - txtEasy.width)/2;
			txtEasy.y = btnEasy.height + 10;
			var txtMed:TextField = new TextField();
			txtMed.defaultTextFormat = tf;
			txtMed.autoSize = TextFieldAutoSize.LEFT;
			txtMed.text = "NORMALNY";
			txtMed.embedFonts = true;
			txtMed.filters = [new DropShadowFilter(0, 0, 0, 1, 4, 4, 4)];
			txtMed.x = (btnMedium.width - txtMed.width) / 2;
			txtMed.y = btnMedium.height + 10;
			var txtHard:TextField = new TextField();
			txtHard.defaultTextFormat = tf;
			txtHard.autoSize = TextFieldAutoSize.LEFT;
			txtHard.text = "TRUDNY";
			txtHard.embedFonts = true;
			txtHard.x = (btnHard.width - txtHard.width)/2;
			txtHard.y = btnHard.height + 10;
			txtHard.filters = [new DropShadowFilter(0, 0, 0, 1, 4, 4, 4)];
			
			btnEasy.scaleX = btnEasy.scaleY = btnMedium.scaleX = btnMedium.scaleY = btnHard.scaleX = btnHard.scaleY = 1.3;
			btnEasy.x = stage.stageWidth / 2 - btnEasy.width / 2 - btnMedium.width - 90;
			btnMedium.x = stage.stageWidth / 2 - btnMedium.width / 2;
			btnHard.x = stage.stageWidth / 2 - btnHard.width / 2 + btnMedium.width + 90;
			
			btnEasy.y = stage.stageHeight / 2 - btnEasy.height / 1.5;
			btnMedium.y = stage.stageHeight / 2 - btnMedium.height / 1.5;
			btnHard.y = stage.stageHeight / 2 - btnHard.height / 1.5;
			
			btnEasy.addChild(txtEasy);
			btnMedium.addChild(txtMed);
			btnHard.addChild(txtHard);
			
			btnEasy.buttonMode = btnMedium.buttonMode = btnHard.buttonMode = true;
			btnEasy.mouseChildren = btnMedium.mouseChildren = btnHard.mouseChildren = false;
			btnEasy.addEventListener(MouseEvent.CLICK, onEasy);
			btnMedium.addEventListener(MouseEvent.CLICK, onMedium);
			btnHard.addEventListener(MouseEvent.CLICK, onHard);
			
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
		
		private function tintColor(mc:Sprite, r:int, g:int, b:int, alphaSet:Number):void {
			var cTint:ColorTransform = new ColorTransform(r / 255.0, g / 255.0, b / 255.0, alphaSet);
			mc.transform.colorTransform = cTint;
		}
		
		public function onEasy(e:Event):void {
			(AppFacade.GetInstance().retrieveProxy(Sounds.NAME) as Sounds).EffectClick();
			AppFacade.GetInstance().sendNotification(Events.NAVIGATION_CHOOSE_LEVEL, stage, GameLogic.GAME_DIF_EASY.toString());
		}
		
		public function onMedium(e:Event):void {
			(AppFacade.GetInstance().retrieveProxy(Sounds.NAME) as Sounds).EffectClick();
			AppFacade.GetInstance().sendNotification(Events.NAVIGATION_CHOOSE_LEVEL, stage, GameLogic.GAME_DIF_MEDIUM.toString());
		}
		
		public function onHard(e:Event):void {
			(AppFacade.GetInstance().retrieveProxy(Sounds.NAME) as Sounds).EffectClick();
			AppFacade.GetInstance().sendNotification(Events.NAVIGATION_CHOOSE_LEVEL, stage, GameLogic.GAME_DIF_HARD.toString());
		}
		
		public function onBack(e:Event):void {
			(AppFacade.GetInstance().retrieveProxy(Sounds.NAME) as Sounds).EffectClick();
			AppFacade.GetInstance().sendNotification(Events.NAVIGATION_MENU, stage);
		}
	}

}