package Visuals.Parts {
	import com.greensock.TweenMax;
	import flash.display.Sprite;
	import flash.text.TextField;
	import Proxies.Data.RacerData;
	
	/**
	 * ...
	 * @author Perz
	 */
	public class ScoreBoardEntry extends Sprite {
		// sizes of each element [MOD-RANK-NAME-SCORE-MOD]
		public static const WIDTH_RANK_MOD:int = 30;
		public static const WIDTH_RANK:int = 20;
		public static const WIDTH_NAME:int = 120;
		public static const WIDTH_SCORE:int = 50;
		public static const WIDTH_SCORE_MOD:int = 30;
		public static const PADDING:int = 5;
		public static const WIDTH_LEFT:int = 	(PADDING + WIDTH_RANK_MOD + PADDING);
		public static const WIDTH_MID:int = 	(PADDING + WIDTH_RANK + PADDING + WIDTH_NAME + PADDING + WIDTH_SCORE + PADDING);
		public static const WIDTH_RIGHT:int = 	(PADDING + WIDTH_SCORE_MOD + PADDING);
		
		public var txtRankPos:TextField;
		public var txtName:TextField;
		public var txtScore:TextField;
		
		public var txtScoreMod:TextField;
		public var txtRankMod:TextField;
		
		public var leftContainer:Sprite;
		public var midContainer:Sprite;
		public var rightContainer:Sprite;
		
		public var currentRank:int;
		public var currentScore:int;
		public var boundRacer:RacerData;
		
		public function ScoreBoardEntry(racer:RacerData) {
			boundRacer = racer;
			
			InitializeComponent();
			leftContainer.alpha = 0;
			rightContainer.alpha = 0;
			
			currentRank = racer.rankingPosition;
			currentScore = racer.rankingScore;
		}
		
		public function Update():void {
			if (currentRank != boundRacer.rankingPosition) {
				// only display additive rank changes
				var rankDif:int = boundRacer.rankingPosition - currentRank;
				if (rankDif < 0) {
					txtRankMod.text = "+" + Math.abs(rankDif);
					TweenMax.to(leftContainer, 0.3, { alpha: 1 } );
				}
			}
			if (currentScore != boundRacer.rankingScore) {
				// display all dif scores
				var scoreDif:int = boundRacer.rankingScore - currentScore;
				if (scoreDif > 0) {
					txtScoreMod.text = "+" + scoreDif;
				} else if(scoreDif < 0) {
					txtScoreMod.text = scoreDif.toString();
				}
				
				TweenMax.to(rightContainer, 0.3, { alpha:1 } );
			}
		}
		
		public function HideMods():void {
			TweenMax.allTo([leftContainer, rightContainer], 0.3, { alpha: 0 }, 0, function():void {
				currentScore = boundRacer.rankingScore;
				currentRank = boundRacer.rankingPosition;
				RefreshValues();
			} );
		}
		
		private function RefreshValues():void {
			txtRankPos.text = boundRacer.rankingPosition.toString();
			txtScore.text = boundRacer.rankingScore.toString();
			
			currentRank = boundRacer.rankingPosition;
			currentScore = boundRacer.rankingScore;
		}
		
		private function InitializeComponent():void {
			txtName = TextStyles.CreateBookingEntry(boundRacer.name);
			txtRankMod = TextStyles.CreateBookingEntry("0");
			txtRankPos = TextStyles.CreateBookingEntry(boundRacer.rankingPosition.toString());
			txtScore = TextStyles.CreateBookingEntry(boundRacer.rankingScore.toString());
			txtScoreMod = TextStyles.CreateBookingEntry("0");
			
			txtName.width = WIDTH_NAME;
			txtRankMod.width = WIDTH_RANK_MOD;
			txtRankPos.width = WIDTH_RANK;
			txtScore.width = WIDTH_SCORE;
			txtScoreMod.width = WIDTH_SCORE_MOD;
			
			leftContainer = new Sprite();
			midContainer = new Sprite();
			rightContainer = new Sprite();
			
			leftContainer.addChild(txtRankMod);
			midContainer.addChild(txtRankPos);
			midContainer.addChild(txtName);
			midContainer.addChild(txtScore);
			rightContainer.addChild(txtScoreMod);
			
			addChild(leftContainer);
			addChild(midContainer);
			addChild(rightContainer);
		
			// align items and generate backgrounds
			leftContainer.x = 0;
			txtRankMod.x = PADDING;
			leftContainer.graphics.beginFill(0xaa4444);
			leftContainer.graphics.drawRoundRect(0, 0, WIDTH_LEFT, height + 4, 5, 5);
			txtRankMod.y = 2;
			
			midContainer.x = leftContainer.x + leftContainer.width;
			txtRankPos.x = PADDING;
			txtName.x = txtRankPos.x + WIDTH_RANK + PADDING;
			txtScore.x = txtName.x + WIDTH_NAME + PADDING;
			midContainer.graphics.beginFill(0xaaaaaa);
			midContainer.graphics.drawRoundRect(0, 0, WIDTH_MID, txtName.height + 4, 2, 2);
			txtRankPos.y = 2;
			txtName.y = 2;
			txtScore.y = 2;
			
			rightContainer.x = midContainer.x + midContainer.width;
			txtScoreMod.x = PADDING;
			rightContainer.graphics.beginFill(0x4444aa);
			rightContainer.graphics.drawRoundRect(0, 0, WIDTH_RIGHT, txtScoreMod.height + 4, 5, 5);
			txtScoreMod.y = 2;
		}
	}
}