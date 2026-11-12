package Proxies {
	import flash.events.TimerEvent;
	import flash.utils.Timer;
	import org.puremvc.as3.interfaces.IProxy;
	import org.puremvc.as3.patterns.proxy.Proxy;
	
	/**
	 * ...
	 * @author Perzka Michalowy
	 */
	public class GameTimer extends Proxy implements IProxy {
		public static const NAME:String = "GameTimer";
		public static const GAME_ARCADE_TIME:Number = 40.0;
		public static const GAME_FREEPLAY_TIME:Number = 99.0;
		private static const TIMER_TICK:int = 333;

		private var internalTimer:Timer;
		
		public var secondsLeft:Number;
		public var isRunning:Boolean;
		
		public function GameTimer() {
			secondsLeft = 0;
			isRunning = false;

			// start internal timer
			internalTimer = new Timer(TIMER_TICK);
			internalTimer.addEventListener(TimerEvent.TIMER, OnTimer);
			internalTimer.start();
		}
		
		public function Start():void {
			isRunning = true;
		}
		
		public function Pause():void {
			isRunning = false;
		}
		
		public function Reset(newAmount:Number):void {
			isRunning = false;
			secondsLeft = newAmount;
			
			facade.sendNotification(Events.GAME_TIMER_UPDATE, GetTimeString());
		}
		
		public function AddTime(seconds:Number):void {
			secondsLeft += seconds;
			secondsLeft = Math.min(999, secondsLeft);
		}
		
		private function Update(elapsedSeconds:Number):void {
			if (!isRunning) return;
			
			var valBefore:Number = secondsLeft;
			var valAfter:Number = secondsLeft -= elapsedSeconds;

			var timeAsString:String = GetTimeString();
			
			facade.sendNotification(Events.GAME_TIMER_UPDATE, timeAsString);
			
			if (valBefore > 0 && valAfter < 0) {
				secondsLeft = 0;
				
				Pause();
				Logger.Log("Timer: Game ended");
				sendNotification(Events.GAME_TIMER_TIME_ENDED);
			}
		}
		
		public function GetTimeString():String {
			var intSecs:int = int(secondsLeft);
			if (intSecs < 0) intSecs = 0;
			
			var timeAsString:String = intSecs.toString();
			if (timeAsString.length == 1) { timeAsString = "00" + timeAsString; }
			if (timeAsString.length == 2) { timeAsString = "0" + timeAsString; }
			
			return timeAsString;
		}
		
		private function OnTimer(e:TimerEvent):void {
			Update(TIMER_TICK / 1000.0);
		}

		override public function getProxyName():String {
			return NAME;
		}

	}
}