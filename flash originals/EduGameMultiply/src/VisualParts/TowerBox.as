package VisualParts {
	import com.greensock.easing.Bounce;
	import com.greensock.easing.Circ;
	import com.greensock.easing.Cubic;
	import com.greensock.easing.Expo;
	import com.greensock.easing.Quad;
	import com.greensock.TweenLite;
	import Data.MathQuestion;
	import flash.display.Sprite;
	import flash.geom.Point;
	import flash.utils.setTimeout;
	import Proxies.Sounds;
	
	/**
	 * ...
	 * @author Perz
	 */
	public class TowerBox extends Sprite {
		public static const ADDON_PROBABILITY:Number = 0.4;
		
		public var currentBlock:TowerBlock;
		public var currentAddon:TowerBlockAddon;
		private var blockPanel:Sprite;
		private var towerVisibleHeight:int;
		
		private var maskingSprite:Sprite;
		private var desiredWidth:int;
		private var desiredHeight:int;
		
		public var background:TowerBackground;
		public var indicator:HeightIndicator;
		public var soundProxy:Sounds;
		
		private var lastBlockType:int;
		private var blockTypeCount:int;
		
		public function TowerBox(w:int, h:int) {
			desiredHeight = h;
			desiredWidth = w;
			
			currentBlock = null;
			blockTypeCount = 0;
			
			graphics.beginFill(0xff0000, 0.1);
			graphics.drawRect(0, 0, w, h);
			graphics.endFill();
			
			maskingSprite = new Sprite();
			maskingSprite.graphics.beginFill(0xff00, 0.3);
			maskingSprite.graphics.drawRect(0, 0, w, h);
			
			background = new TowerBackground(w, h);
			addChild(background);
			
			addChild(maskingSprite);
			mask = maskingSprite;
			
			blockPanel = new Sprite();
			addChild(blockPanel);
			blockPanel.x = w / 2 - 5;
			blockPanel.y = h; // tower base height
			towerVisibleHeight = 0;
			
			indicator = new HeightIndicator(h);
			indicator.SetPerson(TowerBlock.TYPE_A);
			indicator.UpdateHeightTxt(0);
			addChild(indicator);
			indicator.x = w;
			indicator.y = 0;
			lastBlockType = TowerBlock.TYPE_A;
			
			soundProxy = AppFacade.GetInstance().retrieveProxy(Sounds.NAME) as Sounds;
		}
		
		public function HandleQuestionAnswer():void {
			if (!currentBlock)
				return;
			
			currentBlock.QuestionUpdate();
			
			if (currentBlock.question.answerType == MathQuestion.ANSWER_CORRECT) {
				PlaceBlockOnTower();
			} else if (currentBlock.question.answerType == MathQuestion.ANSWER_BAD) {
				DestroyBlock(true);
			} else {
				Logger.Log("Something wrong: handle waiting answer");
			}
		}
		
		public function NextQuestion(q:MathQuestion):void {
			if (currentBlock) {
				DestroyBlock(true);
			}
			
			var blockType:int = TowerBlock.TYPE_FLOOR;
			if (blockPanel.numChildren > 0) {
				switch (q.difficultyLevel) {
					case 1: 
						blockType = TowerBlock.TYPE_A;
						break;
					case 2: 
						blockType = TowerBlock.TYPE_B;
						break;
					case 3: 
						blockType = TowerBlock.TYPE_C;
						break;
					case 4: 
						blockType = TowerBlock.TYPE_D;
						break;
				}
			}
			
			if (lastBlockType != blockType) {
				blockTypeCount = 0;
			} else {
				blockTypeCount += 1;
			}
			
			currentBlock = new TowerBlock(blockType, blockTypeCount);
			currentBlock.SetQuestion(q);
			addChild(currentBlock);
			currentBlock.y = 100;
			currentBlock.x = blockPanel.x; //desiredWidth / 2 - currentBlock.width/2;
			currentBlock.alpha = 0;
			TweenLite.to(currentBlock, 0.3, {alpha: 1});
		}
		
		public function EndGame():void {
			if (currentBlock) {
				DestroyBlock(false);
			}
			var roof:TowerRoof = new TowerRoof(lastBlockType);
			addChild(roof);
			roof.y = 0;
			roof.x = blockPanel.x; // alignments
			
			setTimeout(soundProxy.EffectBrick, 300);
			setTimeout(soundProxy.EffectBrick, 700);
			setTimeout(soundProxy.EffectBrick, 900);
			TweenLite.to(roof, 1, {y: desiredHeight - towerVisibleHeight - 50, motionBlur: true, ease: Bounce.easeOut});
		}
		
		private function PlaceBlockOnTower():void {
			var bounceAt:int = desiredHeight - towerVisibleHeight - 100;
			if (currentAddon) { currentAddon.Hide(); currentAddon = null; }
			
			AppFacade.GetInstance().sendNotification(Events.GAME_SEGMENT_FALLING);
			
			setTimeout(soundProxy.EffectBrick, 300);
			setTimeout(soundProxy.EffectBrick, 700);
			setTimeout(soundProxy.EffectBrick, 900);
			
			TweenLite.to(currentBlock, 1, {y: bounceAt, motionBlur: true, ease: Bounce.easeOut, onComplete: function():void {
					var blockHeight:int = currentBlock.GetSegmentHeight();
					
					for (var i:int = 0; i < blockPanel.numChildren; ++i) {
						blockPanel.getChildAt(i).y += blockHeight;
					}
					
					blockPanel.y -= blockHeight;
					var panelLocal:Point = blockPanel.globalToLocal(currentBlock.localToGlobal(new Point(0, 0)));
					currentBlock.x = panelLocal.x;
					currentBlock.y = panelLocal.y;
					
					blockPanel.addChild(currentBlock);
					
					if (blockPanel.y < desiredHeight / 2) {
						TweenLite.to(blockPanel, 0.5, {y: desiredHeight / 2});
						towerVisibleHeight = desiredHeight / 2;
						
						var growAmount:Number = desiredHeight / 2 - blockPanel.y;
						indicator.AddHeight(growAmount, 0.5);
						background.AddHeight(growAmount * 1.2, 0.5);
					} else {
						towerVisibleHeight += currentBlock.GetSegmentHeight();
					}
					
					if(lastBlockType != currentBlock.blockType && currentBlock.blockType != TowerBlock.TYPE_FLOOR){
						lastBlockType = currentBlock.blockType;
						indicator.SetPerson(lastBlockType);
					}
					ShowAddon();
					currentBlock = null;
					
					AppFacade.GetInstance().sendNotification(Events.GAME_SEGMENT_PLACED);
					AppFacade.GetInstance().sendNotification(Events.GAME_TOWER_GROWS, blockHeight);
					AppFacade.GetInstance().sendNotification(Events.CREATE_NEW_QUESTION);
				}});
		}
		
		private function ShowAddon():void {
			if (Math.random() > ADDON_PROBABILITY || currentBlock.blockType == TowerBlock.TYPE_FLOOR) {
				return;
			}
			
			currentAddon = new TowerBlockAddon(currentBlock);
			currentAddon.Show();
		}
		
		private function DestroyBlock(isBadAnswer:Boolean):void {
			if (!currentBlock) return;
			
			if (isBadAnswer) {
				var tmpBlock:TowerBlock = currentBlock;
				currentBlock.QuestionUpdate();
				currentBlock = null;
				TweenLite.to(tmpBlock, 0.4, { ease:Bounce.easeOut, scaleX:1.5, scaleY:1.5 , 
					onUpdate: function():void { setChildIndex(tmpBlock, numChildren-1);},
					onComplete: function():void{ setTimeout( removeChild, 3000, tmpBlock); } } );
			} else {
				TweenLite.killTweensOf(currentBlock);
				removeChild(currentBlock);
				currentBlock = null;
			}
		}
	}

}