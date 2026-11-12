package  
{
	import flash.display.Bitmap;
	import flash.display.DisplayObject;
	import flash.display.Loader;
	import flash.display.Stage;
	import flash.events.Event;
	import flash.utils.ByteArray;
	/**
	 * ...
	 * @author Perzka Michalowy
	 */
	public class Content
	{
		[Embed(source = "../Assets/race1Btn.png", mimeType = "application/octet-stream")] private static var race1Icon:Class;
		[Embed(source = "../Assets/race2Btn.png", mimeType = "application/octet-stream")] private static var race2Icon:Class;
		[Embed(source = "../Assets/race3Btn.png", mimeType = "application/octet-stream")] private static var race3Icon:Class;
		
		[Embed(source = "../Assets/veh1Selection.png", mimeType = "application/octet-stream")] private static var Vehicle1Selection:Class;
		[Embed(source = "../Assets/vehicle1f1.png", mimeType = "application/octet-stream")] private static var Vehicle1f1Bmp:Class;
		[Embed(source = "../Assets/vehicle1f2.png", mimeType = "application/octet-stream")] private static var Vehicle1f2Bmp:Class;
		[Embed(source = "../Assets/vehicle1f3.png", mimeType = "application/octet-stream")] private static var Vehicle1f3Bmp:Class;

		[Embed(source = "../Assets/veh2Selection.png", mimeType = "application/octet-stream")] private static var Vehicle2Selection:Class;
		[Embed(source = "../Assets/vehicle2f1.png", mimeType = "application/octet-stream")] private static var Vehicle2f1Bmp:Class;
		[Embed(source = "../Assets/vehicle2f2.png", mimeType = "application/octet-stream")] private static var Vehicle2f2Bmp:Class;
		[Embed(source = "../Assets/vehicle2f3.png", mimeType = "application/octet-stream")] private static var Vehicle2f3Bmp:Class;
		
		[Embed(source = "../Assets/veh3Selection.png", mimeType = "application/octet-stream")] private static var Vehicle3Selection:Class;
		[Embed(source = "../Assets/vehicle3f1.png", mimeType = "application/octet-stream")] private static var Vehicle3f1Bmp:Class;
		[Embed(source = "../Assets/vehicle3f2.png", mimeType = "application/octet-stream")] private static var Vehicle3f2Bmp:Class;
		[Embed(source = "../Assets/vehicle3f3.png", mimeType = "application/octet-stream")] private static var Vehicle3f3Bmp:Class;
		
		[Embed(source = "../Assets/veh4Selection.png", mimeType = "application/octet-stream")] private static var Vehicle4Selection:Class;
		[Embed(source = "../Assets/vehicle4f1.png", mimeType = "application/octet-stream")] private static var Vehicle4f1Bmp:Class;
		[Embed(source = "../Assets/vehicle4f2.png", mimeType = "application/octet-stream")] private static var Vehicle4f2Bmp:Class;
		[Embed(source = "../Assets/vehicle4f3.png", mimeType = "application/octet-stream")] private static var Vehicle4f3Bmp:Class;
		
		[Embed(source = "../Assets/veh1Finish.png", mimeType = "application/octet-stream")] private static var veh1Finish:Class;
		[Embed(source = "../Assets/veh2Finish.png", mimeType = "application/octet-stream")] private static var veh2Finish:Class;
		[Embed(source = "../Assets/veh3Finish.png", mimeType = "application/octet-stream")] private static var veh3Finish:Class;
		[Embed(source = "../Assets/veh4Finish.png", mimeType = "application/octet-stream")] private static var veh4Finish:Class;
		
		[Embed(source = "../Assets/race1Name.png", mimeType = "application/octet-stream")] private static var race1NameCl:Class;
		[Embed(source = "../Assets/race2Name.png", mimeType = "application/octet-stream")] private static var race2NameCl:Class;
		[Embed(source = "../Assets/race3Name.png", mimeType = "application/octet-stream")] private static var race3NameCl:Class;
		[Embed(source = "../Assets/race4Name.png", mimeType = "application/octet-stream")] private static var race4NameCl:Class;
		
		[Embed(source = "../Assets/raceBg.png", mimeType = "application/octet-stream")] private static var RaceBgBmp:Class;
		[Embed(source = "../Assets/prizeSmall.png", mimeType = "application/octet-stream")] private static var PrizeSmallBmp:Class;
		[Embed(source = "../Assets/prizeBig.png", mimeType = "application/octet-stream")] private static var PrizeBigBmp:Class;
		[Embed(source="../Assets/menuBg.png", mimeType = "application/octet-stream")]private static var bgBmp:Class;
		
		[Embed(source = "../Assets/completedForest.png", mimeType = "application/octet-stream")] 	private static var compForestBmp:Class;
		[Embed(source = "../Assets/completedLakes.png", mimeType = "application/octet-stream")] 	private static var compLakesBmp:Class;
		[Embed(source = "../Assets/completedMountains.png", mimeType = "application/octet-stream")] private static var compMountBmp:Class;
		[Embed(source = "../Assets/completedSea.png", mimeType = "application/octet-stream")] 		private static var compSeaBmp:Class;
		
		[Embed(source = "../Assets/gameTrack1.png", mimeType = "application/octet-stream")] 		private static var gameTrack1Bmp:Class;
		[Embed(source = "../Assets/gameTrack2.png", mimeType = "application/octet-stream")] 		private static var gameTrack2Bmp:Class;
		[Embed(source = "../Assets/gameTrack3.png", mimeType = "application/octet-stream")] 		private static var gameTrack3Bmp:Class;
		[Embed(source = "../Assets/gameTrack4.png", mimeType = "application/octet-stream")] 		private static var gameTrack4Bmp:Class;
		[Embed(source = "../Assets/gameForeground.png", mimeType = "application/octet-stream")]		private static var gameForeground:Class;
		[Embed(source = "../Assets/gameClouds.jpg", mimeType = "application/octet-stream")]			private static var gameClouds:Class;
		[Embed(source = "../Assets/gameBackground1.png", mimeType = "application/octet-stream")]	private static var gameBackground1:Class;
		[Embed(source = "../Assets/gameBackground2.png", mimeType = "application/octet-stream")]	private static var gameBackground2:Class;
		[Embed(source = "../Assets/gameBackground3.png", mimeType = "application/octet-stream")]	private static var gameBackground3:Class;
		[Embed(source = "../Assets/gameBackground4.png", mimeType = "application/octet-stream")]	private static var gameBackground4:Class;
		
		[Embed(source = "../Assets/backBtn.png", mimeType = "application/octet-stream")] private static var backBtnCl:Class;
		[Embed(source = "../Assets/place1.png", mimeType = "application/octet-stream")]	private static var place1Cl:Class
		[Embed(source = "../Assets/place2.png", mimeType = "application/octet-stream")]	private static var place2Cl:Class;
		[Embed(source = "../Assets/place3.png", mimeType = "application/octet-stream")]	private static var place3Cl:Class;
		[Embed(source = "../Assets/place4.png", mimeType = "application/octet-stream")]	private static var place4Cl:Class;
		
		[Embed(source = "../Assets/raceStartBtn.png", mimeType = "application/octet-stream")] private static var raceStartBtnCl:Class;
		
		[Embed(source = "../Assets/tick.png", mimeType = "application/octet-stream")] private static var tickCl:Class;
		[Embed(source = "../Assets/butterfly1.png", mimeType = "application/octet-stream")] private static var butterfly1:Class;
		[Embed(source = "../Assets/butterfly2.png", mimeType = "application/octet-stream")] private static var butterfly2:Class;
		
		private static var classes:Array;
		private static var loadCounter:int;
		private static var initStage:Stage;
		
		public static function Init(stage:Stage):void {
			classes = [];
			loadCounter = 0;
			initStage = stage;
			classes["Vehicle1f1"] = LoadImage(Vehicle1f1Bmp);
			classes["Vehicle1f2"] = LoadImage(Vehicle1f2Bmp);
			classes["Vehicle1f3"] = LoadImage(Vehicle1f3Bmp);
			classes["Vehicle2f1"] = LoadImage(Vehicle2f1Bmp);
			classes["Vehicle2f2"] = LoadImage(Vehicle2f2Bmp);
			classes["Vehicle2f3"] = LoadImage(Vehicle2f3Bmp);
			classes["Vehicle3f1"] = LoadImage(Vehicle3f1Bmp);
			classes["Vehicle3f2"] = LoadImage(Vehicle3f2Bmp);
			classes["Vehicle3f3"] = LoadImage(Vehicle3f3Bmp);
			classes["Vehicle4f1"] = LoadImage(Vehicle4f1Bmp);
			classes["Vehicle4f2"] = LoadImage(Vehicle4f2Bmp);
			classes["Vehicle4f3"] = LoadImage(Vehicle4f3Bmp);
			classes["Vehicle1Selection"] = LoadImage(Vehicle1Selection);
			classes["Vehicle2Selection"] = LoadImage(Vehicle2Selection);
			classes["Vehicle3Selection"] = LoadImage(Vehicle3Selection);
			classes["Vehicle4Selection"] = LoadImage(Vehicle4Selection);
			classes["veh1Finish"] = LoadImage(veh1Finish);
			classes["veh2Finish"] = LoadImage(veh2Finish);
			classes["veh3Finish"] = LoadImage(veh3Finish);
			classes["veh4Finish"] = LoadImage(veh4Finish);
			classes["Race1Icon"] = LoadImage(race1Icon);
			classes["Race2Icon"] = LoadImage(race2Icon);
			classes["Race3Icon"] = LoadImage(race3Icon);
			classes["RaceBg"] = LoadImage(RaceBgBmp);
			classes["PrizeSmall"] = LoadImage(PrizeSmallBmp);
			classes["PrizeBig"] = LoadImage(PrizeBigBmp);
			classes["menuBg"] = LoadImage(bgBmp);
			classes["CompletedForest"] = LoadImage(compForestBmp);
			classes["CompletedLakes"] = LoadImage(compLakesBmp);
			classes["CompletedMountains"] = LoadImage(compMountBmp);
			classes["CompletedSea"] = LoadImage(compSeaBmp);
			classes["GameTrack0"] = LoadImage(gameTrack1Bmp);
			classes["GameTrack1"] = LoadImage(gameTrack2Bmp);
			classes["GameTrack2"] = LoadImage(gameTrack3Bmp);
			classes["GameTrack3"] = LoadImage(gameTrack4Bmp);
			classes["GameForeground"] = LoadImage(gameForeground);
			classes["GameClouds"] = LoadImage(gameClouds);
			classes["GameBackground0"] = LoadImage(gameBackground1);
			classes["GameBackground1"] = LoadImage(gameBackground2);
			classes["GameBackground2"] = LoadImage(gameBackground3);
			classes["GameBackground3"] = LoadImage(gameBackground4);
			classes["backBtn"] = LoadImage(backBtnCl);
			classes["place1"] = LoadImage(place1Cl);
			classes["place2"] = LoadImage(place2Cl);
			classes["place3"] = LoadImage(place3Cl);
			classes["place4"] = LoadImage(place4Cl);
			classes["race0Name"] = LoadImage(race1NameCl);
			classes["race1Name"] = LoadImage(race2NameCl);
			classes["race2Name"] = LoadImage(race3NameCl);
			classes["race3Name"] = LoadImage(race4NameCl);
			classes["tick"] = LoadImage(tickCl);
			classes["butterfly1"] = LoadImage(butterfly1);
			classes["butterfly2"] = LoadImage(butterfly2);
			classes["raceStartBtn"] = LoadImage(raceStartBtnCl);
		}

		private static function LoadImage(src:Class):Loader {
			var bg:Loader = new Loader();
			loadCounter++;
			bg.loadBytes(new src() as ByteArray);
			bg.contentLoaderInfo.addEventListener(Event.COMPLETE, function(e:Event):void { 
				//(bg.content as Bitmap).smoothing = true; 
				loadCounter--;
				if(loadCounter == 0){
					AppFacade.GetInstance().sendNotification(AppFacade.STARTUP, initStage);
				}
			} );
			return bg;
		}
		
		public static function GetBitmap(name:String):Bitmap {
			var cl:Loader = classes[name];
			if (cl == null || !cl.content is Bitmap) {
				throw new Error("Bitmap not found: " + name);
			}
			
			var bmp:Bitmap = new Bitmap((cl.content as Bitmap).bitmapData);
			bmp.smoothing = true;
			return bmp;
		}
	}
}