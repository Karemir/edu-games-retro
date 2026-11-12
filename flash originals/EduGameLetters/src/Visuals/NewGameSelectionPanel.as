package Visuals {
	import adobe.utils.CustomActions;
	import com.greensock.TweenLite;
	import com.greensock.TweenMax;
	import flash.display.Bitmap;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.text.TextField;
	import flash.ui.Keyboard;
	import Proxies.Sounds;
	import Visuals.Parts.VehicleSelection;
	
	/**
	 *
	 * @author Perzka Michalowy
	 */
	public class NewGameSelectionPanel extends Sprite {
		[Embed(source = "../../Assets/startGameBg.png")] private var imgBg:Class;
		[Embed(source = "../../Assets/chooseVehicleBtn.png")] private var imgChoose:Class;
		[Embed(source = "../../Assets/tickRed.png")] private var imgTick:Class;
		
		public var btnAccept:TextButton;
		public var txtInputName:TextField;
		public var inputCaret:Sprite;
		public var sounds:Sounds;
			
		public var playerName:String;
		public var nameTyped:Boolean;
		public var currentVehicleId:int;
		
		private var bg:Bitmap;
		private var tick:Bitmap;
		private var selectVeh0:Sprite;
		private var selectVeh1:Sprite;
		private var selectVeh2:Sprite;
		private var selectVeh3:Sprite;

		private var clickVeh0:Sprite;
		private var clickVeh1:Sprite;
		private var clickVeh2:Sprite;
		private var clickVeh3:Sprite;
		
		private var rdyCallback:Function;
		
		public function NewGameSelectionPanel(onClick:Function) {
			rdyCallback = onClick;
			bg = new imgBg();
			bg.smoothing = true;
			btnAccept = new TextButton("", new imgChoose());
			tick = new imgTick();
			sounds = AppFacade.GetInstance().retrieveProxy(Sounds.NAME) as Sounds;
			
			playerName = "Twoje Imię";
			nameTyped = false;
			txtInputName = TextStyles.CreateBoldText("", 0); //0x449977);
			currentVehicleId = 0;
			
			addChild(bg);
			addChild(btnAccept);
			//addChild(txtInputName);
			
			txtInputName.y = 175;
			txtInputName.x = 100;
			txtInputName.width = 160;
			inputCaret = new Sprite();
			inputCaret.y = txtInputName.y;
			inputCaret.addEventListener(Event.ENTER_FRAME, function():void { 
				inputCaret.graphics.clear();
				inputCaret.graphics.beginFill(0);
				inputCaret.graphics.drawRect(0, 4, 2, 23);
				inputCaret.x = txtInputName.x + txtInputName.width; 
				inputCaret.alpha = int(new Date().milliseconds / 250) % 2;
			} );
			//addChild(inputCaret);
			
			btnAccept.y = 270;
			btnAccept.x = 110;
			
			selectVeh0 = new Sprite();
			selectVeh1 = new Sprite();
			selectVeh2 = new Sprite();
			selectVeh3 = new Sprite();
			clickVeh0 = new Sprite();
			clickVeh1 = new Sprite();
			clickVeh2 = new Sprite();
			clickVeh3 = new Sprite();
			
			selectVeh0.graphics.beginFill(0, 0);
			selectVeh0.graphics.drawRect(0, 0, 30, 30);
			selectVeh1.graphics.beginFill(0, 0);
			selectVeh1.graphics.drawRect(0, 0, 30, 30);
			selectVeh2.graphics.beginFill(0, 0);
			selectVeh2.graphics.drawRect(0, 0, 30, 30);
			selectVeh3.graphics.beginFill(0, 0);
			selectVeh3.graphics.drawRect(0, 0, 30, 30);
			
			selectVeh0.x = 476;
			selectVeh0.y = 189;
			selectVeh1.x = 461;
			selectVeh1.y = 346;
			selectVeh2.x = 703;
			selectVeh2.y = 200;
			selectVeh3.x = 669;
			selectVeh3.y = 345;
			
			clickVeh0.graphics.beginFill(0, 0);
			clickVeh0.graphics.drawRect(0, 0, 200, 170);
			clickVeh1.graphics.beginFill(0, 0);
			clickVeh1.graphics.drawRect(0, 0, 230, 160);
			clickVeh2.graphics.beginFill(0, 0);
			clickVeh2.graphics.drawRect(0, 0, 200, 180);
			clickVeh3.graphics.beginFill(0, 0);
			clickVeh3.graphics.drawRect(0, 0, 200, 170);

			clickVeh0.x = 355;
			clickVeh0.y = 60;
			clickVeh1.x = 275;
			clickVeh1.y = 233;
			clickVeh2.x = 574;
			clickVeh2.y = 56;
			clickVeh3.x = 504;
			clickVeh3.y = 230;
			
			addChild(selectVeh0);
			addChild(selectVeh1);
			addChild(selectVeh2);
			addChild(selectVeh3);
			addChild(clickVeh0);
			addChild(clickVeh1);
			addChild(clickVeh2);
			addChild(clickVeh3);
			selectVeh0.addChild(tick);
			
			selectVeh0.addEventListener(MouseEvent.CLICK, OnSelectClick);
			selectVeh1.addEventListener(MouseEvent.CLICK, OnSelectClick);
			selectVeh2.addEventListener(MouseEvent.CLICK, OnSelectClick);
			selectVeh3.addEventListener(MouseEvent.CLICK, OnSelectClick);
			clickVeh0.addEventListener(MouseEvent.CLICK, OnSelectClick);
			clickVeh1.addEventListener(MouseEvent.CLICK, OnSelectClick);
			clickVeh2.addEventListener(MouseEvent.CLICK, OnSelectClick);
			clickVeh3.addEventListener(MouseEvent.CLICK, OnSelectClick);
			
			selectVeh0.buttonMode = selectVeh1.buttonMode = selectVeh2.buttonMode = selectVeh3.buttonMode = true;
			clickVeh0.buttonMode = clickVeh1.buttonMode = clickVeh2.buttonMode = clickVeh3.buttonMode = true;
			
			UpdatePlayerName();
			
			// attach events
			btnAccept.addEventListener(MouseEvent.CLICK, OnAcceptClicked);
		}
		
		public function HandleNameKey(keyCode:uint):void {
			return;
			
			if (keyCode == Keyboard.ENTER) {
				sounds.EffectKeypress();
				OnAcceptClicked(null);
			} else if (keyCode == Keyboard.BACKSPACE) {
				sounds.EffectKeypress();
				if (nameTyped) {
					playerName = playerName.slice(0, playerName.length - 1);
				} else {
					playerName = "";
					nameTyped = true;
				}
			} else if (((keyCode >= Keyboard.A && keyCode <= Keyboard.Z) || (keyCode >= Keyboard.NUMBER_0 && keyCode <= Keyboard.NUMBER_9)) && playerName.length < 15) {
				sounds.EffectKeypress();
				if (!nameTyped) {
					playerName = "";
					nameTyped = true;
				}
				if(playerName.length < 11){
					playerName += String.fromCharCode(keyCode).toUpperCase();
				}
			} else if ( keyCode == Keyboard.ESCAPE) {
				sounds.EffectKeypress();
				OnBackClicked(null);
			}
			
			UpdatePlayerName();
		}
		
		private function UpdatePlayerName():void {
			txtInputName.text = playerName;
			txtInputName.x = 190 -txtInputName.width / 2;
		}
		
		public function OnBackClicked(e:Event):void {
			sounds.EffectClick();;
			AppFacade.GetInstance().sendNotification(Events.MAIN_MENU_PANEL_BACK);
		}
		
		public function OnSelectClick(e:MouseEvent):void {
			sounds.EffectClick();
			if (e.currentTarget == selectVeh0 || e.currentTarget == clickVeh0) {
				selectVeh0.addChild(tick);
				currentVehicleId = 0;
			} else if (e.currentTarget == selectVeh1 || e.currentTarget == clickVeh1) {
				selectVeh1.addChild(tick);
				currentVehicleId = 1;
			} else if (e.currentTarget == selectVeh2 || e.currentTarget == clickVeh2) {
				selectVeh2.addChild(tick);
				currentVehicleId = 3;
			} else if (e.currentTarget == selectVeh3 || e.currentTarget == clickVeh3) {
				selectVeh3.addChild(tick);
				currentVehicleId = 2; // swap vehicles as there is a bug ;P
			}
		}
		
		public function SelectVehicle(id:int):void {
			switch(id) {
				case 0: selectVeh0.addChild(tick); break;
				case 1: selectVeh1.addChild(tick); break;
				case 2: selectVeh2.addChild(tick); break;
				case 3: selectVeh3.addChild(tick); break;
			}
		}
		
		public function OnAcceptClicked(e:Event):void {
			sounds.EffectClick();
			/*if (playerName.length == 0 || !nameTyped) {
				// Blink bad name - cant accept
				TweenLite.to(btnAccept, 0.1, {tint: 0xff0000, onComplete: function():void {
						TweenLite.to(btnAccept, 0.1, {removeTint: true});
					}});
			} else {*/
				AppFacade.GetInstance().sendNotification(Events.MAIN_MENU_GAME_READY);
				rdyCallback.call();
			//}
		}
	}
}