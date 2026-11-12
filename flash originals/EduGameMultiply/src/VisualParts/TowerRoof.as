package VisualParts {
	import adobe.utils.CustomActions;
	import flash.display.Bitmap;
	import flash.display.MovieClip;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.text.TextField;
	import flash.text.TextFieldAutoSize;
	import flash.text.TextFormat;
	import Proxies.Sounds;
	
	/**
	 * ...
	 * @author Perzka Michalowy
	 */
	public class TowerRoof extends Sprite {
		[Embed(source = "../../Assets/roof1.png")]private var roof1:Class;
		[Embed(source = "../../Assets/roof2.png")]private var roof2:Class;
		[Embed(source = "../../Assets/roof3.png")]private var roof3:Class;
		[Embed(source = "../../Assets/roof4.png")]private var roof4:Class;
		
		[Embed(source = "../../Assets/flag1_1.png")]private var flag11Cl:Class;
		[Embed(source = "../../Assets/flag1_2.png")]private var flag12Cl:Class;
		[Embed(source = "../../Assets/flag1_3.png")]private var flag13Cl:Class;
		[Embed(source = "../../Assets/flag1_4.png")]private var flag14Cl:Class;
		[Embed(source = "../../Assets/flag2_1.png")]private var flag21Cl:Class;
		[Embed(source = "../../Assets/flag2_2.png")]private var flag22Cl:Class;
		[Embed(source = "../../Assets/flag2_3.png")]private var flag23Cl:Class;
		[Embed(source = "../../Assets/flag2_4.png")]private var flag24Cl:Class;
		
		private var flagFrames:Vector.<Bitmap>;
		private var flag:Sprite;
		private var frameIdx:int;
		private var frameCounter:int;
		
		private var img:Bitmap;
		private var roofType:int;
		private var sounds:Sounds;
		
		public function TowerRoof(type:int) {
			sounds = AppFacade.GetInstance().retrieveProxy(Sounds.NAME) as Sounds;
			
			roofType = type;
			switch(type) {
				case TowerBlock.TYPE_A:
					img = new roof1();
					img.x = -11;
					img.y = 10;
					break;
				case TowerBlock.TYPE_B:
					img = new roof2();
					img.x = -10;
					img.y = 10;
					break;
				case TowerBlock.TYPE_C:
					img = new roof3();
					img.x = -13;
					img.y = 0;
					break;
				case TowerBlock.TYPE_D:
					img = new roof4();
					img.x = -7;
					img.y = 5;
					break;
			}
			addChild(img);
			img.x += -img.width / 2;
			img.y += -img.height + 20;
		
			var btnMenuSprite:Sprite = new Sprite();
			btnMenuSprite.x = 0 + img.x;
			btnMenuSprite.y = 71 + img.y;
			btnMenuSprite.buttonMode = true;
			btnMenuSprite.graphics.beginFill(0, 0);
			btnMenuSprite.graphics.drawRect(0, 0, 90, 80);
			
			var btnNewGameSprite:Sprite = new Sprite();
			btnNewGameSprite.x = 183 + img.x;
			btnNewGameSprite.y = 27 + img.y;
			btnNewGameSprite.buttonMode = true;
			btnNewGameSprite.graphics.beginFill(0, 0);
			btnNewGameSprite.graphics.drawRect(0, 0, 44, 111);
			
			addChild(btnMenuSprite);
			addChild(btnNewGameSprite);
			
			InitializeFlag();
			
			btnMenuSprite.addEventListener(MouseEvent.CLICK, OnMenuClick);
			btnNewGameSprite.addEventListener(MouseEvent.CLICK, OnNewGame);
			
			addEventListener(Event.ENTER_FRAME, OnFrame);
		}
		
		private function InitializeFlag():void {
			flag = new Sprite();
			flagFrames = new Vector.<Bitmap>();
			switch(roofType) {
				case TowerBlock.TYPE_A:
					flagFrames.push(new flag11Cl(), new flag12Cl(), new flag13Cl(), new flag14Cl());
					flag.x = -63;
					flag.y = -135;
					break;
				case TowerBlock.TYPE_B:
					flagFrames.push(new flag11Cl(), new flag12Cl(), new flag13Cl(), new flag14Cl());
					flag.x = -64;
					flag.y = -130;
					break;
				case TowerBlock.TYPE_C:
					flagFrames.push(new flag21Cl(), new flag22Cl(), new flag23Cl(), new flag24Cl(), new flag24Cl(), new flag23Cl(), new flag22Cl(), new flag21Cl()); 
					flag.x = -35;
					flag.y = -150;
					break;
				case TowerBlock.TYPE_D:
					flagFrames.push(new flag21Cl(), new flag22Cl(), new flag23Cl(), new flag24Cl(), new flag24Cl(), new flag23Cl(), new flag22Cl(), new flag21Cl()); 
					flag.x = -35;
					flag.y = -160;
					break;
			}
			addChild(flag);
			frameIdx = 0;
			frameCounter = 0;
			
			for each(var bmp:Bitmap in flagFrames) {
				bmp.x = -bmp.width / 2;
				bmp.y = -bmp.height / 2;
				bmp.smoothing = true;
			}
		}
		
		private function SetFlagFrame():void {
			if (flag.numChildren > 0) {
				flag.removeChildAt(0);
			}
			flag.addChild(flagFrames[frameIdx]);
		}
		
		private function OnFrame(e:Event):void {
			frameCounter++;
			if (frameCounter >= 6) {
				frameCounter = 0;
				frameIdx++;
				if (frameIdx == flagFrames.length) {
					frameIdx = 0;
				}
				
				SetFlagFrame();
			}
		}
		
		private function OnMenuClick(e:Event):void {
			sounds.EffectClick();
			AppFacade.GetInstance().sendNotification(Events.NAVIGATION_MENU, stage);
		}
		
		private function OnNewGame(e:Event):void {
			sounds.EffectClick();
			AppFacade.GetInstance().sendNotification(Events.NAVIGATION_GAME_ARCADE, stage);
		}
	
	}

}