package Visuals {
	import com.greensock.easing.Back;
	import com.greensock.easing.Linear;
	import com.greensock.loading.display.FlexContentDisplay;
	import com.greensock.TweenLite;
	import flash.display.Bitmap;
	import flash.display.Sprite;
	import flash.events.MouseEvent;
	import flash.geom.Matrix;
	import flash.text.TextField;
	import Proxies.Data.VehicleData;
	import Proxies.RaceData;
	
	/**
	 * ...
	 * @author Perz
	 */
	public class RaceScreen extends Sprite {
		public var track:Bitmap;
		public var clouds:Sprite;
		public var background:Bitmap;
		public var foreground:Bitmap;
		public var raceData:RaceData;
		
		public var gameContents:Sprite;
		
		public var desiredWidth:int;
		public var desiredHeight:int;
		public var displayedText:SplitTextField;
		public var currentLetter:int;
		
		public var vehicles:Vector.<AnimatedRacer>;
		public var raceLength:int;
		public var butterfly:Butterfly;
		
		public function RaceScreen(raceData:RaceData, w:int, h:int) {
			this.raceData = raceData;
			clouds = new Sprite();
			track = Content.GetBitmap("GameTrack"+raceData.trackType);
			background = Content.GetBitmap("GameBackground"+raceData.trackType);
			foreground = Content.GetBitmap("GameForeground");
			butterfly = new Butterfly();
			
			desiredHeight = h;
			desiredWidth = w;
			raceLength = track.width;
			foreground.y = h - foreground.height;
			track.y = 40;
			butterfly.y = 20;
			butterfly.x = -100;

			clouds.addChild(Content.GetBitmap("GameClouds"));
			var tmpC:Bitmap = Content.GetBitmap("GameClouds");
			tmpC.x = tmpC.width;
			clouds.addChild(tmpC);
			
			gameContents = new Sprite();
			
			gameContents.addChild(clouds);
			gameContents.addChild(background);
			gameContents.addChild(track);
	
			LoadVehicles();
			PrepareRace();
			
			addChild(gameContents);
			addChild(foreground);
			addChild(butterfly);
		}
		
		private function PrepareRace():void {			
			for (var i:int = 0; i < raceData.racers.length; ++i) {
				var bmp:AnimatedRacer = vehicles[i];
				gameContents.addChild(bmp);
				bmp.x = raceData.racers[i].rt_position;
				bmp.y = 90 + i * 75;
			}
		}
		
		public function SetText(text:String):void {
			text = text.toUpperCase();
			var txt:TextField = TextStyles.CreateGameText(text);
			displayedText = new SplitTextField(txt);
			addChild(displayedText);
			
			displayedText.x = stage.stageWidth / 2 - displayedText.width / 2;
			displayedText.y = 520;
			currentLetter = 0;
		}
		
		public function LetterDone():void {
			TweenLite.to(displayedText.textFields[currentLetter], 0.3, { tint:0x799f1c } );
			currentLetter++;
			if (!butterfly.isFlying) {
				butterfly.Fly();
			}
		}
		
		public function Update():void {
			for (var i:int = 0; i < raceData.racers.length; ++i) {
				vehicles[i].x = raceData.racers[i].rt_position;
			}
			
			clouds.transform.matrix = new Matrix(1,0,0,1, clouds.transform.matrix.tx - 1,0);
			if (clouds.transform.matrix.tx < -clouds.width / 2) {
				clouds.transform.matrix = new Matrix(1,0,0,1, clouds.transform.matrix.tx + clouds.width/2,0)
			}
			
			var pidx:int = raceData.GetPlayerIndex();
			var offset:Number = (vehicles[pidx].x + vehicles[pidx].width) / raceLength - 0.3;
			var maxMove:Number = raceLength - stage.stageWidth;
			
			if (offset > 0) {
				offset *= 2;
			}
			gameContents.x = -maxMove * Math.min(Math.max(offset, 0), 1);
			background.x = gameContents.x * 0.2; // move grass;
		}
		
		private function LoadVehicles():void {
			vehicles = new Vector.<AnimatedRacer>();
			for each(var veh:VehicleData in raceData.racers) {
				vehicles.push(new AnimatedRacer(veh));
			}
		}
		
		public function ShowRaceEnd(position:int):void {
			var posScreen:Sprite = new Sprite();
			var bmp:Bitmap = Content.GetBitmap("place" + (position + 1));
			bmp.x = -bmp.width / 2;
			bmp.y = -bmp.height / 2;
			posScreen.addChild(bmp);
			posScreen.buttonMode = true;
			posScreen.addEventListener(MouseEvent.CLICK, function():void{
				AppFacade.GetInstance().sendNotification(Events.GAME_END_VISUAL_RACE);
			});

			addChild(posScreen);
			posScreen.x = stage.stageWidth / 2;
			posScreen.y = stage.stageHeight / 2;
			posScreen.alpha = 0;
			posScreen.scaleX = 0.1;
			posScreen.scaleY = 0.1;
			
			TweenLite.to(posScreen, 1, { scaleX:1, scaleY:1, alpha:1, ease: Back.easeOut } );
		}
	}

}