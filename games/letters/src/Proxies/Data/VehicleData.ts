import { TweenLite } from "@edugames/common/com/greensock/TweenLite.js";
import { Quad } from "@edugames/common/com/greensock/easing/Quad.js";
import { RaceLogic } from "../../Mediators/RaceLogic.js";
import { Logger } from "../../Logger.js";
import type { RacerData } from "./RacerData.js";

/**
 * ...
 * @author Perzka Michalowy
 */
export class VehicleData {
	public racer: RacerData;
	public isPlayer: boolean = false; // PORT: Boolean default
	public lane: number = 0; // PORT: int default
	
	public rt_position: number;
	public rt_velocity: number;
	
	public tween: TweenLite;
	public boostMultiply: number;
	public nextBoostAt: Date;
	
	public result: number = 0; // PORT: int default
	
	constructor() {
		this.rt_position = 0;
		this.rt_velocity = 0;
		this.boostMultiply = 1;
		
		this.ResetAI();
	}
	
	public SetVelocity(val: number): void {
		this.rt_velocity = val * this.boostMultiply;
	}
	
	public Boost(): void {
		if (this.tween) {
			this.tween.kill();
		}
		
		//(AppFacade.GetInstance().retrieveProxy(Sounds.NAME) as Sounds).EffectBoost();

		var inst: VehicleData = this;
		var timeSpread: number = Math.random() * RaceLogic.BOOST_TIME_SPREAD + RaceLogic.BOOST_TIME;
		// PORT: closures that use the member `tween` are arrow functions
		this.tween = TweenLite.to(inst, timeSpread / 2, { boostMultiply: RaceLogic.BOOST_VALUE + RaceLogic.BOOST_VALUE_SPREAD * Math.random(), ease: Quad.easeOut, onComplete: (): void => { 
			Logger.Log("Speed up done " + inst.boostMultiply);
			this.tween = TweenLite.to(inst, timeSpread / 2, { boostMultiply: 1, ease: Quad.easeIn, onComplete: (): void => {
				Logger.Log("Speed down done " + inst.boostMultiply); }});
		}} );
	}		
	
	public ProcessAI(): void {
		if (this.isPlayer) return;
		
		// PORT: AS3 Date.time is getTime() in JS
		if (this.nextBoostAt.getTime() < new Date().getTime()) {
			this.Boost();
			this.nextBoostAt.setTime(new Date().getTime() + RaceLogic.AI_BOOST_MIN_INTERVAL + Math.random() * RaceLogic.AI_BOOST_SPREAD);
		}
	}
	
	public ResetAI(): void {
		this.nextBoostAt = new Date();
		this.nextBoostAt.setTime(this.nextBoostAt.getTime() + RaceLogic.AI_FIRST_BOOST + Math.random() * RaceLogic.BOOST_TIME_SPREAD * 1000);
	}
}
