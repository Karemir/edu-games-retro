package Game {
	import adobe.utils.CustomActions;
	import com.greensock.data.TweenLiteVars;
	import com.greensock.easing.Circ;
	import com.greensock.easing.Linear;
	import com.greensock.TweenLite;
	import flash.display.Bitmap;
	import flash.display.Sprite;
	import flash.geom.Point;
	import flash.geom.Rectangle;
	import flash.text.engine.TextBlock;
	import flash.utils.setTimeout;
	
	/**
	 * ...
	 * @author Michal Perzak
	 */
	public class Character extends Sprite {
		[Embed(source = "../../Assets/robo/BL_1.png")] private static const BL_1:Class;
		[Embed(source = "../../Assets/robo/BL_2.png")] private static const BL_2:Class;
		[Embed(source = "../../Assets/robo/BL_3.png")] private static const BL_3:Class;
		[Embed(source = "../../Assets/robo/BL_on_1.png")] private static const BL_on_1:Class;
		[Embed(source = "../../Assets/robo/BL_on_2.png")] private static const BL_on_2:Class;
		[Embed(source = "../../Assets/robo/BR_1.png")] private static const BR_1:Class;
		[Embed(source = "../../Assets/robo/BR_2.png")] private static const BR_2:Class;
		[Embed(source = "../../Assets/robo/BR_3.png")] private static const BR_3:Class;
		[Embed(source = "../../Assets/robo/BR_on_1.png")] private static const BR_on_1:Class;
		[Embed(source = "../../Assets/robo/BR_on_2.png")] private static const BR_on_2:Class;
		[Embed(source = "../../Assets/robo/TL_1.png")] private static const TL_1:Class;
		[Embed(source = "../../Assets/robo/TL_2.png")] private static const TL_2:Class;
		[Embed(source = "../../Assets/robo/TL_3.png")] private static const TL_3:Class;
		[Embed(source = "../../Assets/robo/TL_4.png")] private static const TL_4:Class;
		[Embed(source = "../../Assets/robo/TL_on_1.png")] private static const TL_on_1:Class;
		[Embed(source = "../../Assets/robo/TL_on_2.png")] private static const TL_on_2:Class;
		[Embed(source = "../../Assets/robo/TR_1.png")] private static const TR_1:Class;
		[Embed(source = "../../Assets/robo/TR_2.png")] private static const TR_2:Class;
		[Embed(source = "../../Assets/robo/TR_3.png")] private static const TR_3:Class;
		[Embed(source = "../../Assets/robo/TR_4.png")] private static const TR_4:Class;
		[Embed(source = "../../Assets/robo/TR_on_1.png")] private static const TR_on_1:Class;
		[Embed(source = "../../Assets/robo/TR_on_2.png")] private static const TR_on_2:Class;
		
		
		public static const ANIM_FRAME_TIME:int = 5;
		public static const BLOCK_MOVE_TIME:Number = 0.7;
		public static const FRAME_WIDTH:int = 65;
		public static const FRAME_HEIGHT:int = 85;
		private static var internal_frame_count:int = 0;
		private static const MOVE_ANIMATION_FRAMES:int = 4;
		
		public static const ANIMATION_FRAMES:Array = [
			//top-right
			//[new Point(0, 0), new Point(23, 0), new Point(46, 0)], 
			[ new TR_1(), new TR_2(), new TR_3(), new TR_4(), new TR_on_1(), new TR_on_2()],
			//bot right
			//[new Point(0, 48), new Point(23, 48), new Point(46, 48)], 
			[ new BR_1(), new BR_2(), new BR_1(), new BR_3(), new BR_on_1(), new BR_on_2()],
			//bot left
			//[new Point(0, 96), new Point(23, 96), new Point(46, 96)], 
			[ new BL_1(), new BL_2(), new BL_1(), new BL_3(), new BL_on_1(), new BL_on_2()],
			//top left
			//[new Point(0, 144), new Point(23, 144), new Point(46, 144)]
			[ new TL_1(), new TL_2(), new TL_3(), new TL_4(), new TL_on_1(), new TL_on_2()]
		];
		
		//private var sheetMask:Sprite;
		//private var sheetBmp:Bitmap;
		private var sheet:Sprite;
		
		public var gameLevel:GameLevel;
		public var liftedBrick:Brick;
		public var position:Brick;
		public var currentDirection:int;
		public var currentFrameId:int;
		
		private var animation:TweenLite;
		
		public function Character(initialDirection:int) {
			//sheetBmp = Content.GetBitmap("charSheet");
			sheet = new Sprite();
			//sheet.addChild(sheetBmp);
			
			addChild(sheet);
			
			//sheetMask = new Sprite();
			//sheetMask.graphics.beginFill(0);
			//sheetMask.graphics.drawRect(0, 0, FRAME_WIDTH, FRAME_HEIGHT);
			//sheet.addChild(sheetMask);
			//sheet.mask = sheetMask;
			
			SetFrame(initialDirection, 4);
			
			sheet.x = -FRAME_WIDTH / 2;
			sheet.y = -FRAME_HEIGHT;
			
			//scaleX = 2;
			//scaleY = 2;
			liftedBrick = null;
		}
		
		private function SetFrame(direction:int, frameId:int):void {
			var frame:Bitmap = ANIMATION_FRAMES[direction][frameId];
			frame.smoothing = true;
			if (sheet.numChildren > 0) {
				sheet.removeChildAt(0);
			}
			sheet.addChild(frame);
			//sheetBmp.x = -pos.x;
			//sheetBmp.y = -pos.y;
			currentDirection = direction;
			currentFrameId = frameId;
		}
		
		private function SetNextFrame():void {
			if (currentFrameId == MOVE_ANIMATION_FRAMES - 1) {
				SetFrame(currentDirection, 0);
			} else {
				SetFrame(currentDirection, currentFrameId + 1);
			}
		}
		
		public function AnimateIn():void {
			sheet.y = -100;
			sheet.alpha = 0;
			TweenLite.to(sheet, 0.7, {y: -FRAME_HEIGHT + 14, alpha: 1, delay: 2, ease: Circ.easeOut, motionBlur: true});
		}
		
		public function AnimateOut(sendLvlComplete:Boolean):void {
			TweenLite.to(this, 0.5, { alpha:0, height: height*3, y: y - 20, onComplete: function():void {
				if (sendLvlComplete) { AppFacade.GetInstance().sendNotification(Events.GAME_COMPLETE_LEVEL);}
			}});
		}
		
		public function PowerUp(firstCommand:int):void {
			setTimeout(function():void {
				SetFrame(currentDirection, 5);
				setTimeout(function():void {
					SetFrame(currentDirection, 0);
						setTimeout(function():void { AppFacade.GetInstance().sendNotification(Events.GAME_NEXT_COMMAND, firstCommand); }, 300);
					}, 300);
				}, 300);
		}
		
		public function RotateLeft():void {
			if (IsAnimating())
				return;
			if (currentDirection == 0)
				currentDirection = 4;
			currentDirection -= 1;
			
			setTimeout(function():void {
					SetFrame(currentDirection, 0);
					AppFacade.GetInstance().sendNotification(Events.GAME_COMMAND_DONE);
				}, 500);
		}
		
		public function RotateRight():void {
			if (IsAnimating())
				return;
			if (currentDirection == 3)
				currentDirection = -1;
			currentDirection += 1;
			
			setTimeout(function():void {
					SetFrame(currentDirection, 0);
					AppFacade.GetInstance().sendNotification(Events.GAME_COMMAND_DONE);
				}, 500);
		}
		
		public function Use():void {
			if (liftedBrick) {
				if (currentDirection == 0) {
					if (position.IsEastReplaceable()) {
						position.ReplaceEast(liftedBrick);
						liftedBrick = null;
					} else if (position.east.CanBeStacked()) {
						position.east.Stack(liftedBrick);
						liftedBrick = null;
					} else {AppFacade.GetInstance().sendNotification(Events.GAME_COMMAND_DONE);}
				} else if (currentDirection == 1) {
					if (position.IsSouthReplaceable()) {
						position.ReplaceSouth(liftedBrick);
						liftedBrick = null;
					} else if (position.south.CanBeStacked()) {
						position.south.Stack(liftedBrick);
						liftedBrick = null;
					} else {AppFacade.GetInstance().sendNotification(Events.GAME_COMMAND_DONE);}
				} else if (currentDirection == 2) {
					if (position.IsWestReplaceable()) {
						position.ReplaceWest(liftedBrick);
						liftedBrick = null;
					} else if (position.west.CanBeStacked()) {
						position.west.Stack(liftedBrick);
						liftedBrick = null;
					} else {AppFacade.GetInstance().sendNotification(Events.GAME_COMMAND_DONE);}
				} else if (currentDirection == 3) {
					if (position.IsNorthReplaceable()) {
						position.ReplaceNorth(liftedBrick);
						liftedBrick = null;
					} else if (position.north.CanBeStacked()) {
						position.north.Stack(liftedBrick);
						liftedBrick = null;
					} else {AppFacade.GetInstance().sendNotification(Events.GAME_COMMAND_DONE);}
				}
			} else {
				if (currentDirection == 0 && position.east && position.east.CanBeUnstacked()) {
					Unstack(position.east);
				} else if (currentDirection == 1 && position.south && position.south.CanBeUnstacked()) {
					Unstack(position.south);
				} else if (currentDirection == 2 && position.west && position.west.CanBeUnstacked()) {
					Unstack(position.west);
				} else if (currentDirection == 3 && position.north && position.north.CanBeUnstacked()) {
					Unstack(position.north);
				} else { AppFacade.GetInstance().sendNotification(Events.GAME_COMMAND_DONE);}
			}
		}
		
		public function GoForward():void {
			if (currentDirection == 0 && position.IsEastWalkable()) {
				SetPosition(position.east);
			} else if (currentDirection == 1 && position.IsSouthWalkable()) {
				SetPosition(position.south);
			} else if (currentDirection == 2 && position.IsWestWalkable()) {
				SetPosition(position.west);
			} else if (currentDirection == 3 && position.IsNorthWalkable()) {
				SetPosition(position.north);
			} else {
				SetFrame(currentDirection, 0);
				AppFacade.GetInstance().sendNotification(Events.GAME_COMMAND_DONE);
			}
		}
		
		public function SetPosition(brick:Brick):void {
			if (IsAnimating())
				return;
			
			if (!position) {
				SetPositionImpl(brick, false);
				return;
			}
			
			var thisinst:Character = this;
			
			animation = TweenLite.to(thisinst, BLOCK_MOVE_TIME, {x: brick.x, y: brick.y, ease: Linear.easeNone, onComplete: function():void {
					thisinst.SetPositionImpl(brick, true);
				}, onUpdate: function():void {
					thisinst.UpdateAnimation();
					(thisinst.parent as GameLevel).UpdateBrickDepths();
				}});
		}
		
		private function Unstack(brickToUnstack:Brick):void {
			var toLift:Brick = brickToUnstack.stack;
			brickToUnstack.Unstack();
			var globPt:Point = brickToUnstack.localToGlobal(new Point(toLift.x, toLift.y));
			var locPt:Point = this.globalToLocal(globPt);
			addChild(toLift);
			toLift.x = locPt.x;
			toLift.y = locPt.y;
			
			toLift.scaleX = 1 / scaleX;
			toLift.scaleY = 1 / scaleY;
			
			liftedBrick = toLift;
			TweenLite.to(toLift, 0.1, {x: 0, y: -FRAME_HEIGHT * 1.2, ease: Linear.easeNone, onComplete: function():void {
					AppFacade.GetInstance().sendNotification(Events.GAME_COMMAND_DONE);
				}});
		}
		
		private function UpdateAnimation():void {
			internal_frame_count++;
			if (internal_frame_count > ANIM_FRAME_TIME) {
				internal_frame_count = 0;
				
				SetNextFrame();
			}
		}
		
		private function SetPositionImpl(brick:Brick, isMoving:Boolean):void {
			position = brick;
			x = brick.x;
			y = brick.y;
			
			if (brick.brickType == Brick.BRICK_TYPE_END) {
				AppFacade.GetInstance().sendNotification(Events.GAME_STOP_EXECUTE);
				AnimateOut(true);
				SetFrame(currentDirection, 0);
				return;
			}
			
			if (isMoving) {
				GoForward();
			}
		}
		
		public function IsAnimating():Boolean {
			if (animation && animation.active)
				return true;
			else
				return false;
		}
	}

}