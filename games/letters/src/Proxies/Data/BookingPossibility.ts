import type { RacerData } from "./RacerData.js";

/**
 * ...
 * @author Perzka Michalowy
 */
export class BookingPossibility 
{
	/**
	 * To which track this possibility belongs
	 */
	public trackLevel: number;
	
	/**
	 * Which racer this possibility reflects
	 */
	public racer: RacerData;
	
	public enable: boolean;
	public linkedPossibilities: any[];
	
	constructor(track: number, racer: RacerData) 
	{
		this.trackLevel = track;
		this.racer = racer;
		this.enable = true;
		
		this.linkedPossibilities = [];
	}
	
	public Disable(): void {
		this.enable = false;
		for (var p of this.linkedPossibilities) {
			p.enable = false;
		}
	}
}
