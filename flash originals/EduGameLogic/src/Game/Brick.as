package Game {
	import com.greensock.easing.Bounce;
	import com.greensock.easing.Linear;
	import com.greensock.loading.data.VideoLoaderVars;
	import com.greensock.TweenLite;
	import flash.display.Bitmap;
	import flash.display.Sprite;
	import flash.geom.Point;
	
	/**
	 * ...
	 * @author Michal Perzak
	 */
	public class Brick extends Sprite {
		[Embed(source="../../Assets/BrickBlock.png")]
		private var blockedCl:Class;
		[Embed(source="../../Assets/BrickEnd.png")]
		private var endCl:Class;
		
		public static const BRICK_TYPE_NORMAL:int = 1;
		public static const BRICK_TYPE_NONE:int = 2;
		public static const BRICK_TYPE_END:int = 3;
		
		public static const DATA_STACKED_BRICK:String = "O";
		public static const DATA_NORMAL_BRICK:String = "o";
		public static const DATA_START_BRICK:String = "S";
		public static const DATA_START_BRICK_UP:String = "G";
		public static const DATA_START_BRICK_DOWN:String = "D";
		public static const DATA_START_BRICK_LEFT:String = "L";
		public static const DATA_START_BRICK_RIGHT:String = "P";
		public static const DATA_EMPTY_BRICK:String = "_";
		public static const DATA_END_BRICK:String = "E";
		
		private static const TOP_OFFSET:int = 14;
		
		public var brickType:int;
		public var bmp:Bitmap;
		
		// Datastructure
		public var north:Brick;
		public var south:Brick;
		public var west:Brick; // left
		public var east:Brick; // right
		public var stack:Brick; // on top
		
		// indexing in the whole level
		public var indexX:int;
		public var indexY:int;
		
		public function Brick(dataType:String) {
			
			if (dataType == DATA_NORMAL_BRICK || dataType == DATA_START_BRICK || dataType == DATA_START_BRICK_DOWN || dataType == DATA_START_BRICK_LEFT || dataType == DATA_START_BRICK_RIGHT || dataType == DATA_START_BRICK_UP) {
				bmp = new blockedCl() as Bitmap;
				brickType = BRICK_TYPE_NORMAL;
			} else if (dataType == DATA_STACKED_BRICK) {
				bmp = new blockedCl() as Bitmap;
				brickType = BRICK_TYPE_NORMAL;
				stack = new Brick(DATA_NORMAL_BRICK);
				stack.y = -stack.height + TOP_OFFSET * 2;
			} else if (dataType == DATA_END_BRICK) {
				bmp = new endCl();
				brickType = BRICK_TYPE_END;
			} else if (dataType == DATA_EMPTY_BRICK) {
				bmp = new blockedCl() as Bitmap;
				brickType = BRICK_TYPE_NONE;
			} else {
				throw new Error("unknown block type");
			}
			bmp.smoothing = true;
			addChild(bmp);
			if (stack) {
				addChild(stack);
			}
			
			bmp.alpha = 0;
			bmp.x = -bmp.width / 2;
			bmp.y = -TOP_OFFSET;
		
			//graphics.beginFill(0xff0000);
			//graphics.drawCircle(0, 0, 5);
		}
		
		public function Clear():void {
			north = null;
			south = null;
			east = null;
			west = null;
			stack = null;
		}
		
		public function IsNorthWalkable():Boolean {
			if (north && (north.brickType == BRICK_TYPE_NORMAL || north.brickType == BRICK_TYPE_END) && !north.stack) {
				return true;
			}
			return false;
		}
		
		public function IsSouthWalkable():Boolean {
			if (south && (south.brickType == BRICK_TYPE_NORMAL || south.brickType == BRICK_TYPE_END) && !south.stack) {
				return true;
			}
			return false;
		}
		
		public function IsWestWalkable():Boolean {
			if (west && (west.brickType == BRICK_TYPE_NORMAL || west.brickType == BRICK_TYPE_END) && !west.stack) {
				return true;
			}
			return false;
		}
		
		public function IsEastWalkable():Boolean {
			if (east && (east.brickType == BRICK_TYPE_NORMAL || east.brickType == BRICK_TYPE_END) && !east.stack) {
				return true;
			}
			return false;
		}
		
		public function IsSouthReplaceable():Boolean {
			if (!south || south.brickType == BRICK_TYPE_NONE) {
				return true;
			}
			return false;
		}
		
		public function ReplaceSouth(newBrick:Brick):void {
			if (south) {
				var tmp:Brick = south;
				south.copyStructure(newBrick);				
				tmp.Clear();
			} else {
				newBrick.north = this;
			}
			var globPt:Point = newBrick.parent.localToGlobal(new Point(newBrick.x, newBrick.y));
			var locPt:Point = parent.globalToLocal(globPt);
			newBrick.scaleX = newBrick.scaleY = 1;
			newBrick.x = locPt.x;
			newBrick.y = locPt.y;

			(parent as GameLevel).AddBrick(newBrick);
			SetSouth(newBrick, true);
		}
		
		public function IsNorthReplaceable():Boolean {
			if (!north || north.brickType == BRICK_TYPE_NONE) {
				return true;
			}
			return false;
		}

		public function ReplaceNorth(newBrick:Brick):void {
			if (north) {
				var tmp:Brick = north;
				north.copyStructure(newBrick);				
				tmp.Clear();
			} else {
				newBrick.south = this;
			}
			var globPt:Point = newBrick.parent.localToGlobal(new Point(newBrick.x, newBrick.y));
			var locPt:Point = parent.globalToLocal(globPt);
			newBrick.scaleX = newBrick.scaleY = 1;
			
			newBrick.x = locPt.x;
			newBrick.y = locPt.y;
			(parent as GameLevel).AddBrick(newBrick);
			SetNorth(newBrick, true);
		}
		
		public function IsEastReplaceable():Boolean {
			if (!east || east.brickType == BRICK_TYPE_NONE) {
				return true;
			}
			return false;
		}
		
		public function ReplaceEast(newBrick:Brick):void {
			if (east) {
				var tmp:Brick = east;
				east.copyStructure(newBrick);				
				tmp.Clear();
			} else {
				newBrick.west = this;
			}
			var globPt:Point = newBrick.parent.localToGlobal(new Point(newBrick.x, newBrick.y));
			var locPt:Point = parent.globalToLocal(globPt);
			newBrick.scaleX = newBrick.scaleY = 1;
			newBrick.x = locPt.x;
			newBrick.y = locPt.y;

			(parent as GameLevel).AddBrick(newBrick);
			SetEast(newBrick, true);
		}
		
		public function IsWestReplaceable():Boolean {
			if (!west || west.brickType == BRICK_TYPE_NONE) {
				return true;
			}
			return false;
		}
		
		public function ReplaceWest(newBrick:Brick):void {
			if (west) {
				var tmp:Brick = west;
				west.copyStructure(newBrick);				
				tmp.Clear();
			} else {
				newBrick.east = this;
			}
			var globPt:Point = newBrick.parent.localToGlobal(new Point(newBrick.x, newBrick.y));
			var locPt:Point = parent.globalToLocal(globPt);
			newBrick.scaleX = newBrick.scaleY = 1;
			newBrick.x = locPt.x;
			newBrick.y = locPt.y;

			(parent as GameLevel).AddBrick(newBrick);
			SetWest(newBrick, true);
		}

		public function CanBeUnstacked():Boolean {
			if (stack && stack.brickType == BRICK_TYPE_NORMAL) {
				return true;
			}
			return false;
		}
		
		public function Unstack():void {
			stack = null;
		}
		
		public function CanBeStacked():Boolean {
			if (brickType == BRICK_TYPE_NORMAL && !stack) {
				return true;
			}
			return false;
		}
		
		public function Stack(brickToStack:Brick):void {
			var globPt:Point = brickToStack.parent.localToGlobal(new Point(brickToStack.x, brickToStack.y));
			var locPt:Point = this.globalToLocal(globPt);
			
			addChild(brickToStack);
			brickToStack.x = locPt.x;
			brickToStack.y = locPt.y;
			brickToStack.scaleX = 1 / scaleX;
			brickToStack.scaleY = 1 / scaleY;
			
			stack = brickToStack;
			
			TweenLite.to(brickToStack, 0.1, {y: -stack.height + TOP_OFFSET * 2, x: 0, ease: Linear.easeNone, onComplete: function():void {
					AppFacade.GetInstance().sendNotification(Events.GAME_COMMAND_DONE);
				}});
		
		}
		
		public function SetNorth(brick:Brick, isAction:Boolean = false):void {
			north = brick;
			if(!isAction){
				north.x = this.x - bmp.width / 2;
				north.y = this.y - TOP_OFFSET;
			} else {
				TweenLite.to(north, 0.2, { x: this.x - bmp.width / 2, y: this.y - TOP_OFFSET, onComplete: function ():void {
					AppFacade.GetInstance().sendNotification(Events.GAME_COMMAND_DONE);
					(parent as GameLevel).UpdateBrickDepths();
				}});
			}
		}
		
		public function SetSouth(brick:Brick, isAction:Boolean = false):void {
			south = brick;
			if(!isAction){
				south.x = this.x + bmp.width / 2;
				south.y = this.y + TOP_OFFSET;
			} else {
				TweenLite.to(south, 0.2, { x: this.x + bmp.width / 2, y: this.y + TOP_OFFSET, onComplete: function ():void {
					AppFacade.GetInstance().sendNotification(Events.GAME_COMMAND_DONE);
					(parent as GameLevel).UpdateBrickDepths();
				}});
			}
		}
		
		public function SetWest(brick:Brick, isAction:Boolean = false):void {
			west = brick;
			if(!isAction){
				west.x = this.x - bmp.width / 2;
				west.y = this.y + TOP_OFFSET;
			} else {
				TweenLite.to(west, 0.2, { x: this.x - bmp.width / 2, y: this.y + TOP_OFFSET, onComplete: function ():void {
					AppFacade.GetInstance().sendNotification(Events.GAME_COMMAND_DONE);
					(parent as GameLevel).UpdateBrickDepths();
				}});
			}
		}
		
		public function SetEast(brick:Brick, isAction:Boolean = false):void {
			east = brick;
			if(!isAction){
				east.x = this.x + bmp.width / 2;
				east.y = this.y - TOP_OFFSET;
			} else {
				TweenLite.to(east, 0.2, { x: this.x + bmp.width / 2, y: this.y - TOP_OFFSET, onComplete: function ():void {
					AppFacade.GetInstance().sendNotification(Events.GAME_COMMAND_DONE);
					(parent as GameLevel).UpdateBrickDepths();
				}});
			}
		}
		
		public function AnimateIn():void {
			if (brickType != BRICK_TYPE_NONE) {
				var diff:Number = Math.abs(indexX - (GameLevel.LEVEL_SIZE_X - 1) / 2.0) + Math.abs(indexY - (GameLevel.LEVEL_SIZE_Y - 1) / 2.0);
				bmp.y = 100;
				TweenLite.to(bmp, 1.8, {delay: diff / 11, y: -TOP_OFFSET, alpha: 1, ease: Bounce.easeOut});
				
				if (stack) {
					stack.bmp.y -= 100;
					TweenLite.to(stack.bmp, 1.8, {delay: diff / 11, y: stack.bmp.y + 100, alpha: 1, ease: Bounce.easeOut});
				}
			}
		}
		
		public function AnimateOut():void {
			TweenLite.to(this, 0.5, {alpha: 0});
		}
		
		private function copyStructure(other:Brick):void {
			other.north = this.north;
			other.south = this.south;
			other.east = this.east;
			other.west = this.west;
			
			if(other.north)
				other.north.south = other;
			if(other.south)
				other.south.north = other;
			if(other.east)
				other.east.west = other;
			if(other.west)
				other.west.east = other;
		}
	}

}