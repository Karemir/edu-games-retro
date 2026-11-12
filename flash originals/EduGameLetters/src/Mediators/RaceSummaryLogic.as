package Mediators {
	import flash.display.Stage;
	import flash.events.Event;
	import flash.events.TimerEvent;
	import flash.utils.Timer;
	import org.puremvc.as3.interfaces.IMediator;
	import org.puremvc.as3.interfaces.INotification;
	import org.puremvc.as3.patterns.mediator.Mediator;
	import Proxies.Data.RacerData;
	import Proxies.Data.VehicleData;
	import Proxies.RaceData;
	import Proxies.GameData;
	import Proxies.RaceData;
	import Visuals.BookingBoard;
	import Visuals.RaceSummaryScreen;
	
	/**
	 * ...
	 * @author Perzka Michalowy
	 */
	public class RaceSummaryLogic extends Mediator implements IMediator {
		public static const NAME:String = "RaceSummaryLogic";
		
		public var raceSummaryScreen:RaceSummaryScreen;
		public var gameData:GameData;
		public var raceData:RaceData;
		
		private var handledTrack:int = 1;
		private var timer:Timer;
		
		public function RaceSummaryLogic(stageItem:Object) {
			super(NAME, stageItem);
		}
		
		override public function onRegister():void {
			gameData = facade.retrieveProxy(GameData.NAME) as GameData;
			raceData = facade.retrieveProxy(RaceData.NAME) as RaceData;
						
			// prepare raceData for the next race
			raceData.racers = new Vector.<VehicleData>();
			for each(var racer:RacerData in gameData.racers) {
				var veh:VehicleData = new VehicleData();
				veh.racer = racer;
				veh.isPlayer = racer.id == GameData.PLAYER_ID;
				raceData.racers.push(veh);
			}
			
			raceSummaryScreen = new RaceSummaryScreen(gameData);
			stage.addChild(raceSummaryScreen);
			stage.focus = raceSummaryScreen;
			
			timer = new Timer(1000, 1);
			//timer.addEventListener(TimerEvent.TIMER, function(e:Event):void { facade.sendNotification(Events.GAME_SUMMARY_NEXT);} );
			//timer.start();
		}
		
		override public function onRemove():void {
			stage.removeChild(raceSummaryScreen);
		}
		
		override public function listNotificationInterests():Array {
			return [
				Events.MENU_RACE_SELECTED,
				];
		}
		
		override public function handleNotification(notification:INotification):void {
			var name:String = notification.getName();
			var body:Object = notification.getBody();
			
			switch (name) {
				case Events.MENU_RACE_SELECTED:
					raceData.trackType = int(body);
					sendNotification(Events.GAME_CYCLE_SCREENS, this);
					break;
			}
		}
						
		public function get stage():Stage {
			return viewComponent as Stage;
		}
	}
}