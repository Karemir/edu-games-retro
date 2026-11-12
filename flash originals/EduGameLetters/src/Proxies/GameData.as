package Proxies {
	import org.puremvc.as3.interfaces.IProxy;
	import org.puremvc.as3.patterns.proxy.Proxy;
	import Proxies.Data.RacerData;
	
	/**
	 * ...
	 * @author Perzka Michalowy
	 */
	public class GameData extends Proxy implements IProxy {
		public static const NAME:String = "GameData";
		public static const PLAYER_ID:int = 0;
		public static const RACER_COUNT:Number = 4;
		public static const MAX_ROUNDS:int = 5;
		public static const TOURNAMENTS_AMOUNT:int = 3;
		
		public static var NAMES:Array = 
		[	"Wiktor",
			"Adam",
			"Maciej",
			"Jan",
			"Igor", 
			"Mikołaj",
			"Patryk" ,
			"Paweł",
			"Dominik",
			"Oskar",
			"Nikola",
			"Zofia",
			"Martyna",
			"Weronika",
			"Anna",
			"Emilia",
			"Magdalena",
			"Hanna",
			"Karolina", 
			"Gabriela",
			"Alicja"];
		
		public static var SCORING:Array = [100, 80, 40, 20];
		
		public var racers:Array;
		
		/**
		 * This array is structured like this:
			 * [TOURNAMENT 1: [score,score,score,score], TOURNAMENT 2: [score,score,score,score]...]
		 */
		public var tournamentResults:Array;
		public var currentTournament:int;
		
		public static const TOURNAMENT_LOCKED:int = 0;
		public static const TOURNAMENT_AVAILABLE:int = 1;
		public static const TOURNAMENT_LOST:int = 2;
		public static const TOURNAMENT_WON:int = 3;
		/**
		 * list of statuses to tournaments. Values are TOURNAMENT_* consts
		 */
		public var tournamentStatuses:Array;
		
		public function GameData() {
			super(NAME);
		}
		
		/**
		 * Prepares a new game data with given name
		 */
		public function StartNewGame(playerName:String, vehicleId:uint):void {
			tournamentResults = [];
			for (var j:int = 0; j < TOURNAMENTS_AMOUNT; ++j) {
				tournamentResults[j] = new Array(0,0,0,0);
				if (j == 0) {
					tournamentResults[j] = new Array(0,0,0,0);
				}
			}
			
			tournamentStatuses = [];
			for (var i:int = 0; i < TOURNAMENTS_AMOUNT; ++i) {
				//if (i == 0) {
					tournamentStatuses[i] = TOURNAMENT_AVAILABLE;
				//}else {
					//tournamentStatuses[i] = TOURNAMENT_LOCKED;
				//}
			}
			
			racers = new Array();
			CreatePlayerRacer(playerName, vehicleId);
			GenerateRandomRacers();
		}
		
		public static function LoadGame():GameData {
			return null;
		}
		
		public static function HasSavedGame():Boolean {
			return true; // TODO
		}
		
		public function SaveGame():void {
		
		}
		
		public function GetPlayerRacer():RacerData {
			return racers[PLAYER_ID];
		}
		
		private function GenerateRandomRacers():void {
			var plVehId:int = GetPlayerRacer().vehicleImageId;
			
			//randomize names
			var rnd:Array = [];
			for each (var name:String in NAMES) {
				rnd.push([name, Math.random().toString()]);
			}

			rnd.sort(function(a:*, b:*):int { return a[1].localeCompare(b[1]); } );
			
			var tmpVehId:int = 0;
			for (var i:int = racers.length; i < RACER_COUNT; ++i) {
				var newRacer:RacerData = new RacerData();
				newRacer.id = i;
				newRacer.name = rnd[i][0];
				newRacer.rankingScore = 0;
				newRacer.rankingPosition = 1;
				newRacer.skillLevel = 0.7 + (i / RACER_COUNT) * 0.3;
				if (tmpVehId == plVehId) tmpVehId++;
				newRacer.vehicleImageId = tmpVehId++;
				
				racers[i] = newRacer;
			}
		}
		
		private function CreatePlayerRacer(playerName:String, vehicleId:uint):void {
			var racer:RacerData = new RacerData();
			racer.id = PLAYER_ID;
			racer.name = playerName;
			racer.rankingScore = 0;
			racer.rankingPosition = 1;
			racer.skillLevel = 1.0;
			racer.vehicleImageId = vehicleId;
			
			racers[PLAYER_ID] = racer;
		}
		
		public function GetTotalCompletion():int {
			var score:int = 0, races:int = 0;
			
			for (var tourId:int = 0; tourId < TOURNAMENTS_AMOUNT; ++tourId) {
				var tmp:Array = tournamentResults[tourId];
				score += tmp[0] + tmp[1] + tmp[2] + tmp[3];
				races += 4;
			}
			
			var total:Number = SCORING[0] * 4 * TOURNAMENTS_AMOUNT;
			
			return int((score / total) * 100);
		}

		public function GetScoreFromRace(tournamentId:int, raceId:int):int {
			return tournamentResults[tournamentId][raceId];
		}
	}
}