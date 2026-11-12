package Proxies.Data 
{
	/**
	 * ...
	 * @author Perzka Michalowy
	 */
	public class BookingPossibility 
	{
		/**
		 * To which track this possibility belongs
		 */
		public var trackLevel:int;
		
		/**
		 * Which racer this possibility reflects
		 */
		public var racer:RacerData;
		
		public var enable:Boolean;
		public var linkedPossibilities:Array;
		
		public function BookingPossibility(track:int, racer:RacerData) 
		{
			this.trackLevel = track;
			this.racer = racer;
			enable = true;
			
			linkedPossibilities = [];
		}
		
		public function Disable():void {
			enable = false;
			for each(var p:BookingPossibility in linkedPossibilities) {
				p.enable = false;
			}
		}
	}

}