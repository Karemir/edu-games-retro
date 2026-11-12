package Visuals {
	import com.greensock.TweenMax;
	import flash.display.Sprite;
	import Proxies.Data.RacerData;
	import Proxies.GameData;
	import Visuals.Parts.ScoreBoardEntry;
	
	/**
	 * ...
	 * @author Perzka Michalowy
	 */
	public class ScoreBoard extends Sprite {
		public var entries:Vector.<ScoreBoardEntry>;
		
		public function ScoreBoard(gameData:GameData) {
			entries = new Vector.<ScoreBoardEntry>();
			
			for each (var racer:RacerData in gameData.racers) {
				var entry:ScoreBoardEntry = new ScoreBoardEntry(racer);
				entries.push(entry);
				addChild(entry);
			}
			
			LayoutEntries(false);
		}
		
		public function LayoutEntries(makeTween:Boolean):void {
			var timeToTween:Number = makeTween ? 1.0 : 0;
			var timeDelay:Number = makeTween ? 2.0 : 0;
			
			SortEntries();
			
			var h:Number = entries[0].height;
			var lastIdx:int = 0;
			var itemCount:int = 0;
			for (var i:int = 0; i < entries.length; ++i) {
				var entry:ScoreBoardEntry = entries[i];
				
				var targetY:Number = i * h;
				TweenMax.to(entry, timeToTween, { y:targetY, delay: timeDelay, onComplete: entry.HideMods } );
			}
		}
		
		/**
		 * simple bubble sort of the entries, basing on their boardIndex property
		 */
		public function SortEntries():void {
			var sortedIdx:int = entries.length;
			var swapped:Boolean = false;
			do {
				swapped = false;
				for (var i:int = 1; i < sortedIdx; ++i) {
					if (entries[i - 1].boundRacer.rankingPosition > entries[i].boundRacer.rankingPosition) {
						var tmp:ScoreBoardEntry = entries[i - 1];
						entries[i - 1] = entries[i];
						entries[i] = tmp;
						swapped = true;
					}
				}
				sortedIdx -= 1;
			} while (swapped);
		}
		
		public function UpdateEntries():void {
			for each (var entry:ScoreBoardEntry in entries) {
				entry.Update();
			}
		}
	}

}