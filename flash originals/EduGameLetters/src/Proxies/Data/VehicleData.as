package Proxies.Data {
	import com.greensock.TweenLite;
	import com.greensock.easing.*;
	import Mediators.RaceLogic;
	import Proxies.Sounds;
	
	/**
	 * ...
	 * @author Perzka Michalowy
	 */
	public class VehicleData {
		public var racer:RacerData;
		public var isPlayer:Boolean;
		public var lane:int;
		
		public var rt_position:Number;
		public var rt_velocity:Number;
		
		public var tween:TweenLite;
		public var boostMultiply:Number;
		public var nextBoostAt:Date;
		
		public var result:int;
		
		public function VehicleData() {
			rt_position = 0;
			rt_velocity = 0;
			boostMultiply = 1;
			
			ResetAI();
		}
		
		public function SetVelocity(val:Number):void {
			rt_velocity = val * boostMultiply;
		}
		
		public function Boost():void {
			if (tween) {
				tween.kill();
			}
			
			//(AppFacade.GetInstance().retrieveProxy(Sounds.NAME) as Sounds).EffectBoost();

			var inst:VehicleData = this;
			var timeSpread:Number = Math.random() * RaceLogic.BOOST_TIME_SPREAD + RaceLogic.BOOST_TIME;
			tween = TweenLite.to(inst, timeSpread / 2, { boostMultiply: RaceLogic.BOOST_VALUE + RaceLogic.BOOST_VALUE_SPREAD * Math.random(), ease: Quad.easeOut, onComplete: function():void { 
				Logger.Log("Speed up done " + inst.boostMultiply)
				tween = TweenLite.to(inst, timeSpread / 2, { boostMultiply: 1, ease: Quad.easeIn, onComplete: function():void {
					Logger.Log("Speed down done " + inst.boostMultiply); }})
			}} );
		}		
		
		public function ProcessAI():void {
			if (isPlayer) return;
			
			if (nextBoostAt.time < new Date().time) {
				Boost();
				nextBoostAt.setTime(new Date().time + RaceLogic.AI_BOOST_MIN_INTERVAL + Math.random() * RaceLogic.AI_BOOST_SPREAD);
			}
		}
		
		public function ResetAI():void {
			nextBoostAt = new Date();
			nextBoostAt.setTime(nextBoostAt.getTime() + RaceLogic.AI_FIRST_BOOST + Math.random() * RaceLogic.BOOST_TIME_SPREAD * 1000);
		}
	}

}