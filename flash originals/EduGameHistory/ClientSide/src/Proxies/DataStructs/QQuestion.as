package Proxies.DataStructs {
	
	/**
	 * ...
	 * @author Perzak
	 */
	public class QQuestion {
		public var id:String;
		public var text:String;
		public var epochId:int;
		
		public function QQuestion(jsonObj:Object) {
			id = jsonObj.QuestionId;
			text = jsonObj.QuestionText;
			epochId = int(jsonObj.EpochId);
		}
	
	}

}