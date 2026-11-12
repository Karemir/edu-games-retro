package Game {
	import com.greensock.TweenLite;
	import flash.display.Bitmap;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.filters.BlurFilter;
	import flash.filters.DropShadowFilter;
	import flash.text.TextField;
	import flash.text.TextFieldAutoSize;
	import flash.text.TextFormat;
	import Proxies.Sounds;
	
	/**
	 * ...
	 * @author Michal Perzak
	 */
	public class Screen extends Sprite {
		public var gameLayer:Sprite;
		public var uiLayer:Sprite;
		public var uiBgBmp:Bitmap;
		public var gameBgBmp:Bitmap;
		public var recDot:Sprite;
		public var comCount:TextField;
		public var lvlLabel:TextField;
		
		public var endPopup:Sprite;
		public var btnReplay:Sprite;
		public var btnMenu:Sprite;
		public var btnNext:Sprite;
		public var backBtn:Sprite;
		
		public var gameLevel:GameLevel;
		public var character:Character;
		
		private var btnExecute:Sprite;
		private var btnForward:Sprite;
		private var btnLeft:Sprite;
		private var btnRight:Sprite;
		private var btnUse:Sprite;
		public var commandList:CommandList;
		public var currentLevel:int;
		
		private var fanSprite:Sprite;
		public var fanSpeed:Number;
		private var sounds:Sounds;
		
		public function Screen(levelId:int) {
			currentLevel = levelId;
			gameLevel = new GameLevel(currentLevel);
			character = new Character(gameLevel.GetStartDirection());
			recDot = new Sprite();
			comCount = new TextField();
			
			addEventListener(Event.ADDED_TO_STAGE, onAdded);
			addEventListener(Event.ENTER_FRAME, UpdateFan);
		}
		
		private function onAdded(e:Event):void {
			removeEventListener(Event.ADDED_TO_STAGE, onAdded);
			gameLayer = new Sprite();
			uiLayer = new Sprite();
			
			uiBgBmp = Content.GetBitmap("gameUiBg");
			uiLayer.addChild(uiBgBmp);
			uiBgBmp.y = stage.stageHeight - uiBgBmp.height;
			
			gameBgBmp = Content.GetBitmap("ambientBg");
			addChild(gameBgBmp);
			CreateComCount();
			
			// create dot
			recDot.graphics.beginFill(0xFFA63D);
			recDot.graphics.drawCircle(13, 13, 13);
			recDot.x = 693;
			recDot.y = 34;
			
			addChild(gameLayer);
			addChild(uiLayer);
			uiLayer.addChild(recDot);
			CreateFan();
			
			character.gameLevel = gameLevel;
			
			gameLayer.addChild(gameLevel);
			character.SetPosition(gameLevel.startBrick);
			gameLevel.SetPlayer(character);
			
			btnExecute = new RoboCommand(RoboCommand.EXECUTE, true);
			btnForward = new RoboCommand(RoboCommand.FORWARD, true);
			btnLeft = new RoboCommand(RoboCommand.ROTATE_LEFT, true);
			btnRight = new RoboCommand(RoboCommand.ROTATE_RIGHT, true);
			btnUse = new RoboCommand(RoboCommand.USE, true);
			
			uiLayer.addChild(btnLeft);
			uiLayer.addChild(btnForward);
			uiLayer.addChild(btnRight);
			uiLayer.addChild(btnUse);
			uiLayer.addChild(btnExecute);
			
			btnLeft.x = 35;
			btnLeft.y = 408;
			btnForward.x = btnLeft.x + btnLeft.width + 5;
			btnForward.y = btnLeft.y;
			btnRight.x = btnForward.x + btnForward.width + 5;
			btnRight.y = btnLeft.y;
			btnUse.x = btnForward.x - 3;
			btnUse.y = btnForward.y - btnUse.height - 5;
			
			btnExecute.x = btnForward.x;
			btnExecute.y = btnForward.y + btnForward.height + 5;
			
			//uiLayer.graphics.beginFill(0xffffff, 0.7);
			//uiLayer.graphics.drawRect(0, 430, uiLayer.width + 10, uiLayer.height + 10);
			
			commandList = new CommandList();
			uiLayer.addChild(commandList);
			commandList.x = 73;
			commandList.y = stage.stageHeight - commandList.height - 18;
			
			backBtn = new Sprite();
			var bmp:Bitmap = Content.GetBitmap("endBtnNext");
			bmp.scaleX = -1;
			backBtn.addChild(bmp);
			addChild(backBtn);
			backBtn.addEventListener(MouseEvent.CLICK, onMenuClick);
			backBtn.buttonMode = true;
			
			backBtn.x = 10 + backBtn.width;
			backBtn.y = 10;
			
			sounds = AppFacade.GetInstance().retrieveProxy(Sounds.NAME) as Sounds;
		}
		
		public function CreateFan():void {
			fanSprite = new Sprite();
			var bmp:Bitmap = Content.GetBitmap("fan");
			fanSprite.addChild(bmp);
			bmp.x = -bmp.width / 2;
			bmp.y = -bmp.height / 2;
			
			addChild(fanSprite);
			fanSprite.x = 872;
			fanSprite.y = 78;
			
			fanSpeed = 0;
			StopFan();
		}
		
		public function CreateComCount():void {
			var tf:TextFormat = new TextFormat("8bit", 27, 0xFFA63D);
			comCount.defaultTextFormat = tf;
			comCount.autoSize = TextFieldAutoSize.LEFT;
			comCount.x = 727;
			comCount.y = 30;
			comCount.text = "0";
			comCount.embedFonts = true;
			comCount.selectable = false;
			
			uiLayer.addChild(comCount);

			lvlLabel = new TextField();
			tf.size = 20;
			lvlLabel.defaultTextFormat = tf;
			lvlLabel.autoSize = TextFieldAutoSize.LEFT;
			lvlLabel.x = 80;
			lvlLabel.y = 25;
			lvlLabel.text = "PLANSZA NR " + (currentLevel + 1);
			lvlLabel.embedFonts = true;
			lvlLabel.selectable = false;
			lvlLabel.filters = [new DropShadowFilter(0,0,0,1,6,6,2)];
			uiLayer.addChild(lvlLabel);
		}
		
		public function UpdateComCount(count:int):void {
			comCount.text = count.toString();
		}
		
		public function UpdateFan(e:Event):void {
			fanSprite.rotation += fanSpeed;
			//if (fanSpeed > 0.5 && fanSprite.filters.length == 0) {
			//fanSprite.filters = [new BlurFilter()];
			//} else if (fanSprite.filters.length > 0) {
			//fanSprite.filters = [];
			//}
		}
		
		public function StartFan():void {
			TweenLite.to(this, 3, {fanSpeed: 19});
			recDot.alpha = 0;
		}
		
		public function StopFan():void {
			TweenLite.to(this, 1, {fanSpeed: 0.4});
			recDot.alpha = 1;
		}
		
		public function ShowEndPopup(moves:int, stars:int, nextVisible:Boolean):void {
			var overlay:Sprite = new Sprite();
			overlay.graphics.beginFill(0xffffff, 0.3);
			overlay.graphics.drawRect(0, 0, stage.stageWidth, stage.stageHeight);
			addChild(overlay);
			overlay.alpha = 0;
			TweenLite.to(overlay, 1.5, { alpha:1 } );
			
			endPopup = new Sprite();
			endPopup.addChild(Content.GetBitmap("endPopup"));
			addChild(endPopup);
			endPopup.x = stage.stageWidth / 2 - endPopup.width / 2;
			endPopup.y = stage.stageHeight / 2 - endPopup.height / 2 - 50;
			
			btnMenu = new Sprite();
			btnMenu.addChild(Content.GetBitmap("endBtnMenu"));
			btnMenu.x = 278 - 70;
			btnMenu.y = 222 - 50;
			btnMenu.buttonMode = true;
			btnMenu.addEventListener(MouseEvent.CLICK, onMenuClick);
			endPopup.addChild(btnMenu);
			
			btnReplay = new Sprite();
			btnReplay.addChild(Content.GetBitmap("endBtnReplay"));
			btnReplay.x = 345 - 70;
			btnReplay.y = 222 - 50;
			btnReplay.buttonMode = true;
			btnReplay.addEventListener(MouseEvent.CLICK, onReplayClick);
			endPopup.addChild(btnReplay);
			
			var s1:Bitmap = Content.GetBitmap("star");
			s1.x = 210;
			s1.y = 75;
			endPopup.addChild(s1);
			if (stars >= 2) {
				var s2:Bitmap = Content.GetBitmap("star");
				s2.x = 270;
				s2.y = 75;
				endPopup.addChild(s2);
			}
			if (stars >= 3) {
				var s3:Bitmap = Content.GetBitmap("star");
				s3.x = 330;
				s3.y = 75;
				endPopup.addChild(s3);
			}
			
			var txt:TextField = new TextField();
			var tf:TextFormat = new TextFormat("8bit", 18, 0xFEF056);
			txt.defaultTextFormat = tf;
			txt.autoSize = TextFieldAutoSize.LEFT;
			txt.text = moves + " ";
			if (moves == 1) {
				txt.appendText("KOMENDA");
			} else if (moves > 1 && moves < 5) {
				txt.appendText("KOMENDY");
			} else {
				txt.appendText("KOMEND");
			}
			
			txt.embedFonts = true;
			txt.mouseEnabled = false;
			endPopup.addChild(txt);
			txt.x = 305 - txt.width / 2;
			txt.y = 130;
			
			if (nextVisible) {
				btnNext = new Sprite();
				btnNext.addChild(Content.GetBitmap("endBtnNext"));
				btnNext.x = 411 - 70;
				btnNext.y = 222 - 50;
				btnNext.buttonMode = true;
				btnNext.addEventListener(MouseEvent.CLICK, onNextClick);
				endPopup.addChild(btnNext);
			}
			endPopup.alpha = 0;
			TweenLite.to(endPopup, 0.5, { alpha:1, delay: 1.5 } );
		}
		
		public function Show():void {
			character.AnimateIn();
		}
		
		public function Hide(onHidden:Function):void {
			// create 2 black boxes on top and bot, and grow them. 
			var boxTop:Sprite = new Sprite();
			var boxBot:Sprite = new Sprite();
			
			boxTop.graphics.beginFill(0);
			boxBot.graphics.beginFill(0);
			boxTop.graphics.drawRect(0, 0, stage.stageWidth, 1);
			boxBot.graphics.drawRect(0, 0, stage.stageWidth, 1);
			
			addChild(boxTop);
			addChild(boxBot);
			boxTop.y = -1;
			boxBot.y = stage.stageHeight + 1;
			
			TweenLite.to(boxTop, 0.5, {height: stage.stageHeight / 2});
			TweenLite.to(boxBot, 0.5, {height: stage.stageHeight / 2, y: stage.stageHeight / 2, onComplete: onHidden});
		}
		
		public function onMenuClick(e:Event):void {
			sounds.EffectClick();
			AppFacade.GetInstance().sendNotification(Events.NAVIGATION_CHOOSE_LEVEL, stage, (currentLevel / 20 + 1).toString());
		}
		
		public function onNextClick(e:Event):void {
			sounds.EffectClick();
			AppFacade.GetInstance().sendNotification(Events.MENU_LEVEL_SELECTED, stage, (currentLevel+1).toString());
		}
		
		public function onReplayClick(e:Event):void {
			sounds.EffectClick();
			AppFacade.GetInstance().sendNotification(Events.GAME_RESET_LEVEL, stage);
		}
	}

}