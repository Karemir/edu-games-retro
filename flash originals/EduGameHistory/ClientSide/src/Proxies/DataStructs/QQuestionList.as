package Proxies.DataStructs {
	
	/**
	 * ...
	 * @author Perzak
	 */
	public class QQuestionList {
		private var questions:Vector.<QQuestion>;
		
		public function QQuestionList(jsonObj:Object) {
			questions = new Vector.<QQuestion>();
			for each(var q:Object in jsonObj) {
				questions.push(new QQuestion(q));
			}
		}
	
		public function Length():int { return questions.length; }
		public function At(i:int):QQuestion { return questions[i]; }
		public function Shuffle():void { shuffleVector(questions as Vector.<*>); }
		
		public static function shuffleVector(vec:Vector.<*>):void{
			var i:int = vec.length - 1;
			while (i > 0) {
				var s:int = int(Math.random() * vec.length);
				var temp:* = vec[s];
				vec[s] = vec[i];
				vec[i] = temp;
				i--;
			}
		}

	}

}