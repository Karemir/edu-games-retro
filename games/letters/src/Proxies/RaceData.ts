import type { IProxy } from "@edugames/common/org/puremvc/as3/interfaces/IProxy.js";
import { Proxy } from "@edugames/common/org/puremvc/as3/patterns/proxy/Proxy.js";
import type { VehicleData } from "./Data/VehicleData.js";

/**
 * ...
 * @author Perzka Michalowy
 */
export class RaceData extends Proxy implements IProxy
{
	public static readonly NAME: string = "RaceData";
	
	public racers: VehicleData[]; // PORT: Vector.<VehicleData>
	public trackType: number = 0; // PORT: int default
	
	constructor() 
	{	
		super(RaceData.NAME);
		this.racers = [];
	}
	
	/**
	 * Adds a new vehicle to the race data.
	 * @param	vehicle
	 * @return returns amount of vehicles signed for race
	 */
	public AddVehicle(vehicle: VehicleData): number {
		return this.racers.push(vehicle);
	}
	
	public ClearRacers(): void {
		this.racers = [];
	}
	
	public HasPlayer(): boolean {
		for (var veh of this.racers) {
			if (veh.isPlayer) {
				return true;
			}
		}
		return false;
	}
	
	public GetPlayerIndex(): number {
		for (var i: number = 0; i < this.racers.length; ++i) {
			if ( this.racers[i].isPlayer) {
				return i;
			}
		}
		return -1;
	}
}
