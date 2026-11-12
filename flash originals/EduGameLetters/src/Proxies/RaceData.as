package Proxies 
{
	import org.puremvc.as3.interfaces.IProxy;
	import org.puremvc.as3.patterns.proxy.Proxy;
	import Proxies.Data.VehicleData;
	
	/**
	 * ...
	 * @author Perzka Michalowy
	 */
	public class RaceData extends Proxy implements IProxy
	{
		public static const NAME:String = "RaceData";
		
		public var racers:Vector.<VehicleData>;
		public var trackType:int;
		
		public function RaceData() 
		{	
			super(NAME);
			racers = new Vector.<VehicleData>();
		}
		
		/**
		 * Adds a new vehicle to the race data.
		 * @param	vehicle
		 * @return returns amount of vehicles signed for race
		 */
		public function AddVehicle(vehicle:VehicleData):int {
			return racers.push(vehicle);
		}
		
		public function ClearRacers():void {
			racers = new Vector.<VehicleData>();
		}
		
		public function HasPlayer():Boolean {
			for each(var veh:VehicleData in racers) {
				if (veh.isPlayer) {
					return true;
				}
			}
			return false;
		}
		
		public function GetPlayerIndex():int {
			for (var i:int = 0; i < racers.length; ++i) {
				if ( racers[i].isPlayer) {
					return i;
				}
			}
			return -1;
		}
	}
}