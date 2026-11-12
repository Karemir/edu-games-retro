import type { IProxy } from "@edugames/common/org/puremvc/as3/interfaces/IProxy.js";
import { Proxy } from "@edugames/common/org/puremvc/as3/patterns/proxy/Proxy.js";
import { SharedObject } from "@edugames/common/flash/net/SharedObject.js";
import { RacerData } from "./Data/RacerData.js";

/**
 * ...
 * @author Perzka Michalowy
 */
export class GameData extends Proxy implements IProxy {
	public static readonly NAME: string = "GameData";
	public static readonly PLAYER_ID: number = 0;
	public static readonly RACER_COUNT: number = 4;
	public static readonly MAX_ROUNDS: number = 5;
	public static readonly TOURNAMENTS_AMOUNT: number = 3;
	
	public static NAMES: any[] = 
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
	
	public static SCORING: any[] = [100, 80, 40, 20];
	
	public racers: any[];
	
	/**
	 * This array is structured like this:
		 * [TOURNAMENT 1: [score,score,score,score], TOURNAMENT 2: [score,score,score,score]...]
	 */
	public tournamentResults: any[];
	public currentTournament: number = 0; // PORT: int default
	
	public static readonly TOURNAMENT_LOCKED: number = 0;
	public static readonly TOURNAMENT_AVAILABLE: number = 1;
	public static readonly TOURNAMENT_LOST: number = 2;
	public static readonly TOURNAMENT_WON: number = 3;
	/**
	 * list of statuses to tournaments. Values are TOURNAMENT_* consts
	 */
	public tournamentStatuses: any[];
	
	constructor() {
		super(GameData.NAME);
	}
	
	/**
	 * Prepares a new game data with given name
	 */
	public StartNewGame(playerName: string, vehicleId: number): void {
		this.tournamentResults = [];
		for (var j: number = 0; j < GameData.TOURNAMENTS_AMOUNT; ++j) {
			this.tournamentResults[j] = new Array(0,0,0,0);
			if (j == 0) {
				this.tournamentResults[j] = new Array(0,0,0,0);
			}
		}
		
		this.tournamentStatuses = [];
		for (var i: number = 0; i < GameData.TOURNAMENTS_AMOUNT; ++i) {
			//if (i == 0) {
				this.tournamentStatuses[i] = GameData.TOURNAMENT_AVAILABLE;
			//}else {
				//tournamentStatuses[i] = TOURNAMENT_LOCKED;
			//}
		}
		
		this.racers = new Array();
		this.CreatePlayerRacer(playerName, vehicleId);
		this.GenerateRandomRacers();
		this.SaveGame(); // PORT: progress is kept in localStorage (the original never saved)
	}
	
	// PORT: LoadGame, HasSavedGame and SaveGame were stubs in the original (null, `true // TODO` and empty).
	// The game is stored in localStorage through a SharedObject, so progress carries on after a reload.
	private static readonly SAVE_NAME: string = "eduLetters";
	
	public static LoadGame(): GameData {
		var loaded: GameData = new GameData();
		return loaded.LoadSavedGame() ? loaded : null;
	}
	
	public static HasSavedGame(): boolean {
		var saved: any = SharedObject.getLocal(GameData.SAVE_NAME).data.game;
		return !!saved && Array.isArray(saved.racers) && saved.racers.length > 0 && Array.isArray(saved.tournamentResults) && Array.isArray(saved.tournamentStatuses);
	}
	
	public SaveGame(): void {
		var so: SharedObject = SharedObject.getLocal(GameData.SAVE_NAME);
		so.data.game = {
			racers: this.racers.map(function(r: RacerData): any {
				return { id: r.id, name: r.name, vehicleImageId: r.vehicleImageId, skillLevel: r.skillLevel, rankingScore: r.rankingScore, rankingPosition: r.rankingPosition };
			}),
			tournamentResults: this.tournamentResults,
			tournamentStatuses: this.tournamentStatuses,
			currentTournament: this.currentTournament
		};
		so.flush();
	}
	
	/** Fills this game data from the saved game. Returns false when there is none. */
	public LoadSavedGame(): boolean {
		if (!GameData.HasSavedGame()) {
			return false;
		}
		var saved: any = SharedObject.getLocal(GameData.SAVE_NAME).data.game;
		this.racers = saved.racers.map(function(s: any): RacerData {
			var r: RacerData = new RacerData();
			r.id = s.id | 0;
			r.name = s.name;
			r.vehicleImageId = s.vehicleImageId | 0;
			r.skillLevel = s.skillLevel == null ? NaN : Number(s.skillLevel);
			r.rankingScore = s.rankingScore | 0;
			r.rankingPosition = s.rankingPosition | 0;
			return r;
		});
		this.tournamentResults = saved.tournamentResults;
		this.tournamentStatuses = saved.tournamentStatuses;
		this.currentTournament = saved.currentTournament | 0;
		return true;
	}
	
	public GetPlayerRacer(): RacerData {
		return this.racers[GameData.PLAYER_ID];
	}
	
	private GenerateRandomRacers(): void {
		var plVehId: number = this.GetPlayerRacer().vehicleImageId;
		
		//randomize names
		var rnd: any[] = [];
		for (var name of GameData.NAMES) {
			rnd.push([name, Math.random().toString()]);
		}

		rnd.sort(function(a: any, b: any): number { return a[1].localeCompare(b[1]); } );
		
		var tmpVehId: number = 0;
		for (var i: number = this.racers.length; i < GameData.RACER_COUNT; ++i) {
			var newRacer: RacerData = new RacerData();
			newRacer.id = i;
			newRacer.name = rnd[i][0];
			newRacer.rankingScore = 0;
			newRacer.rankingPosition = 1;
			newRacer.skillLevel = 0.7 + (i / GameData.RACER_COUNT) * 0.3;
			if (tmpVehId == plVehId) tmpVehId++;
			newRacer.vehicleImageId = tmpVehId++;
			
			this.racers[i] = newRacer;
		}
	}
	
	private CreatePlayerRacer(playerName: string, vehicleId: number): void {
		var racer: RacerData = new RacerData();
		racer.id = GameData.PLAYER_ID;
		racer.name = playerName;
		racer.rankingScore = 0;
		racer.rankingPosition = 1;
		racer.skillLevel = 1.0;
		racer.vehicleImageId = vehicleId;
		
		this.racers[GameData.PLAYER_ID] = racer;
	}
	
	public GetTotalCompletion(): number {
		var score: number = 0, races: number = 0;
		
		for (var tourId: number = 0; tourId < GameData.TOURNAMENTS_AMOUNT; ++tourId) {
			var tmp: any[] = this.tournamentResults[tourId];
			score += tmp[0] + tmp[1] + tmp[2] + tmp[3];
			races += 4;
		}
		
		var total: number = GameData.SCORING[0] * 4 * GameData.TOURNAMENTS_AMOUNT;
		
		return ((score / total) * 100) | 0; // PORT: int()
	}

	public GetScoreFromRace(tournamentId: number, raceId: number): number {
		return this.tournamentResults[tournamentId][raceId];
	}
}
