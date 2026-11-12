package Achievements {
	/**
	 * ...
	 * @author Michal Perzak
	 */
	public class Achievement {
		public var achId:int;
		public var title:String;
		public var description:String;
		public var prizeName:String;
		public var date:String;
		public var unlocked:Boolean;
		public var contentClass:Class;
		
		function Achievement(achId:int, contentClass:Class, title:String = null, description:String = null, prizeName:String = null, date:String = null):void {
			unlocked = false;
			this.achId = achId;
			this.title = title;
			this.description = description;
			this.date = date;
			this.contentClass = contentClass;
			this.prizeName = prizeName;
		}
	}

}