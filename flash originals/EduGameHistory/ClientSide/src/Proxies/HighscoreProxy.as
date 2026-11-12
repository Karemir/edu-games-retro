package Proxies {
	import flash.net.SharedObject;
	import org.puremvc.as3.interfaces.IProxy;
	import org.puremvc.as3.patterns.proxy.Proxy;
	
	/**
	 * ...
	 * @author Perzak
	 */
	public class HighscoreProxy extends Proxy implements IProxy {
		public static const NAME:String = "HighscoreProxy";
		
		private var sharedObj:SharedObject;
		
		public function HighscoreProxy() {
			sharedObj = SharedObject.getLocal("historyquiz");
			if (!sharedObj.data.scores) {
				sharedObj.data.scores = [];
				sharedObj.data.scores[QuestionProxy.EPOCH_STAROZYTNOSC] = [];
				sharedObj.data.scores[QuestionProxy.EPOCH_SREDNIOWIECZE] = [];
				sharedObj.data.scores[QuestionProxy.EPOCH_NOWOZYTNOSC] = [];
				sharedObj.data.scores[QuestionProxy.EPOCH_XIX] = [];
				sharedObj.data.scores[QuestionProxy.EPOCH_XX] = [];
			}
		}
		
		public function GetHighscore(epoch:int, dif:int):Number {
			var dt:Array = sharedObj.data.scores;
			if (!dt || !dt[epoch]) {
				return 0;
			} else {
				var res:Number = Number(dt[epoch][dif]);
				if (isNaN(res)) { return 0; }
				return res;
			}
		}
		
		public function PushHighscore(epoch:int, dif:int, score:Number):void {
			var ep:Array = sharedObj.data.scores[epoch];
			if (!ep || ep.length == 0) {
				ep = [];
				ep[QuestionProxy.DIF_EASY] = 0;
				ep[QuestionProxy.DIF_MEDIUM] = 0;
				ep[QuestionProxy.DIF_HARD] = 0;
				sharedObj.data.scores[epoch] = ep;
			}
			sharedObj.data.scores[epoch][dif] = score;
			sharedObj.flush();
		}
		
		override public function getProxyName():String {
			return NAME;
		}
	}

}