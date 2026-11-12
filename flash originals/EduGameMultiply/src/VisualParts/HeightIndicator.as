package VisualParts {
	import com.greensock.easing.Sine;
	import com.greensock.TweenLite;
	import flash.display.Bitmap;
	import flash.display.Sprite;
	import flash.text.TextField;
	import flash.text.TextFormat;
	import Mediators.GameMediator;
	import Proxies.GameProxy;
	
	/**
	 * ...
	 * @author Perzka Michalowy
	 */
	public class HeightIndicator extends Sprite {
		private var desiredHeight:int;
		
		[Embed(source="../../Assets/baloon.png")]
		private var balloonCl:Class;
		[Embed(source="../../Assets/balloonPerson1.png")]
		private var person1Cl:Class;
		[Embed(source="../../Assets/balloonPerson2.png")]
		private var person2Cl:Class;
		[Embed(source="../../Assets/balloonPerson3.png")]
		private var person3Cl:Class;
		[Embed(source="../../Assets/balloonPerson4.png")]
		private var person4Cl:Class;
		
		private static const markerPositions:Array = [50, 100, 150, 200, 300, 400, 500, 750, 1000, 1500, 2000, 3000];
		private var markers:Vector.<HeightMarker>;
		
		private var balloonContainer:Sprite;
		private var balloon:Bitmap;
		private var balloonText:TextButton;
		private var balloonTextStyle:TextFormat;
		private var person:Bitmap;
		private var balloonStartPos:Number;
		
		private var heightCounter:int;
		
		private var gameProxy:GameProxy;
		
		public function HeightIndicator(h:int) {
			desiredHeight = h;
			heightCounter = 0;
			mouseChildren = false;
			
			markers = new Vector.<HeightMarker>();
			for each (var pos:int in markerPositions) {
				var tmp:HeightMarker = new HeightMarker(pos);
				addChild(tmp);
				tmp.x = -50;
				tmp.y = -pos * 10 + desiredHeight - 25; // 25 is half block size. me lazy.
				
				markers.push(tmp);
			}
			
			balloonText = new TextButton(" ", null);
			balloonTextStyle = new TextFormat("MBold", 23);
			balloonText.textField.defaultTextFormat = balloonTextStyle;
			balloonText.textField.embedFonts = true;
			
			balloonContainer = new Sprite();
			balloon = new balloonCl();
			balloon.smoothing = true;
			balloonContainer.addChild(balloon);
			balloonContainer.y = desiredHeight - balloon.height - 30;
			balloonContainer.x = -balloon.width + 5;
			balloonStartPos = balloonContainer.y;
			balloonText.y = 50;
			balloonContainer.addChild(balloonText);
			addChild(balloonContainer);
			
			gameProxy = AppFacade.GetInstance().retrieveProxy(GameProxy.NAME) as GameProxy;
		}
		
		public function AddHeight(h:int, time:Number):void {
			Logger.Log("Move markers down " + h);
			
			for each (var mark:HeightMarker in markers) {
				TweenLite.to(mark, time, {y: mark.y + h});
			}
			
			if (balloon.y == balloonStartPos) {
				OnBalloonAnimationComplete();
			} else {
				TweenLite.to(balloonContainer, time, {y: balloonContainer.y + h, onComplete: OnBalloonAnimationComplete});
			}
		}
		
		public function UpdateHeightTxt(h:int):void {
			if (gameProxy.gameMode == GameMediator.GAME_MODE_ARCADE) {
				if (h > 0)
					balloonText.textField.text = h + " m";
			} else if(gameProxy.score > 0) {
				balloonText.textField.text = gameProxy.score + " pkt";
			} else {
				balloonText.textField.text = " ";
			}
			balloonText.x = balloonContainer.width / 2 - balloonText.width / 2;
		}
		
		public function OnBalloonAnimationComplete():void {
			TweenLite.to(balloonContainer, 2, {y: 100, ease: Sine.easeInOut});
		}
		
		public function SetPerson(blockType:int):void {
			if (person) {
				balloonContainer.removeChild(person);
				person = null;
			}
			switch (blockType) {
				case TowerBlock.TYPE_A: 
					person = new person1Cl();
					person.x = 5;
					person.y = 150;
					break;
				case TowerBlock.TYPE_B: 
					person = new person2Cl();
					person.x = 15;
					person.y = 155;
					break;
				case TowerBlock.TYPE_C: 
					person = new person3Cl();
					person.x = 25;
					person.y = 160;
					break;
				case TowerBlock.TYPE_D: 
					person = new person4Cl();
					person.x = 25;
					person.y = 170;
					break;
			}
			person.smoothing = true;
			balloonContainer.addChild(person);
		}
	}

}