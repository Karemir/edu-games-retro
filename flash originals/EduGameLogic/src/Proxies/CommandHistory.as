package Proxies {
	import Game.RoboCommand;
	import org.puremvc.as3.interfaces.IProxy;
	import org.puremvc.as3.patterns.proxy.Proxy;
	
	/**
	 * ...
	 * @author Michal Perzak
	 */
	public class CommandHistory extends Proxy implements IProxy {
		public static const NAME:String = "CommandHistoryProxy";
		
		public var storedLevel:int;
		public var commands:Vector.<RoboCommand>;
		
		public function CommandHistory() {
			commands = new Vector.<RoboCommand>();
		}
		
		public function StoreCommands(coms:Vector.<RoboCommand>, level:int):void {
			commands = coms.concat();
			storedLevel = level;
		}
		
		public function GetCommands(level:int):Vector.<RoboCommand> {
			if (storedLevel == level) {
				return commands;
			} else {
				return new Vector.<RoboCommand>();
			}
		}
		
		override public function getProxyName():String {
			return NAME;
		}
		
		
	}

}