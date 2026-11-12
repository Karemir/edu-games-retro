package Proxies.DataStructs {
	
	/**
	 * ...
	 * @author Perzak
	 */
	public class DisplayQuestion {
		public var id:String;
		public var epochId:int;
		public var dif:int;
		public var text:String;
		public var correctImages:Vector.<String>;
		public var badImages:Vector.<String>;
		
		public function DisplayQuestion(jsonObj:Object) {
			id = jsonObj.QuestionId;
			epochId = int(jsonObj.EpochId);
			dif = int(jsonObj.Difficulty);
			text = jsonObj.QuestionText;
			
			correctImages = new Vector.<String>();
			for each(var cor:Object in jsonObj.CorrectImages) {
				correctImages.push(cor as String);
			}
			
			badImages = new Vector.<String>();
			for each(var bad:Object in jsonObj.BadImages) {
				badImages.push(bad as String);
			}
		}
	
	}

}