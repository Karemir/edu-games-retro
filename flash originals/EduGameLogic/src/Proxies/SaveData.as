package Proxies
{	
	import Achievements.AchievementProxy;
	import flash.net.SharedObject;
	import org.puremvc.as3.interfaces.IProxy;
	import org.puremvc.as3.patterns.proxy.Proxy;
	
	/**
	 * ...
	 * @author ...
	 */
	public class SaveData extends Proxy implements IProxy
	{
		public static const NAME:String = "SaveData";
		
		public static const LEVEL_NOT_COMPLETED:int = 0;
		public static const LEVEL_1_STAR:int = 1;
		public static const LEVEL_2_STAR:int = 2;
		public static const LEVEL_3_STAR:int = 3;
		
		private var sharedObj:SharedObject;
		
		public function SaveData()
		{
			sharedObj = SharedObject.getLocal("robogame");
			if (!sharedObj.data.levels) {
				sharedObj.data.levels = [];
			}
		}
		
		public function GetLevelStatus(levelId:int):int
		{
			var dt:Array = sharedObj.data.levels;
			if(!dt){
				return LEVEL_NOT_COMPLETED;
			} else {
				return int(dt[levelId]);
			}
		}
		
		public function SetLevelStatus(levelId:int, status:int):void {
			sharedObj.data.levels[levelId] = status;
			sharedObj.flush();
		}
		
		override public function getProxyName():String
		{
			return NAME;
		}
	}

}