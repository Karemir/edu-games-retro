package  {
	import flash.system.Capabilities;
	
	/**
	 * ...
	 * @author Michal Perzak
	 */
	public class Logger {
		public function Logger(){
		}
		
		public static function Log(msg:Object):void {
			if (Capabilities.isDebugger){
				trace(typeof msg + " " + msg);
			}
		}
	}
}