package Game {
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.utils.ByteArray;
	
	/** 
	 * ...
	 * @author Michal Perzak
	 */
	public class GameLevel extends Sprite {
		[Embed(source = "../../Assets/Levels.txt", mimeType="application/octet-stream")] private static var levelData:Class;
		
		public var bricks:Vector.<Brick>;
		public var brickGrid:Array;
		public var startBrick:Brick;
		public var player:Sprite;
		
		public var movesFor3Stars:int;
		public var movesFor2Stars:int;		
		public var moveDir:int;
		
		public static const LEVEL_SIZE_X:int = 11;
		public static const LEVEL_SIZE_Y:int = 11;
		
		/**
		 * Builds a new level
		 * @param	levelId Id of the level to build
		 */
		public function GameLevel(levelId:int) {
			var data:Array = ReadLevelData(levelId);
			
			bricks = new Vector.<Brick>();
			brickGrid = new Array();
			for (var i:int = 0; i < LEVEL_SIZE_Y; ++i) {
				brickGrid[i] = new Array();
			}
			
			for (var lx:int = 0; lx < LEVEL_SIZE_X; ++lx) {
				for (var ly:int = 0; ly < LEVEL_SIZE_Y; ++ly) {
					var b:Brick = new Brick(data[lx][ly]);
					b.indexX = lx;
					b.indexY = ly;
					brickGrid[ly][lx] = b;
					bricks.push(b);
					addChild(b);
					
					if (data[lx][ly] == Brick.DATA_START_BRICK) {
						startBrick = b;
						moveDir = 0;
					}
					if (data[lx][ly] == Brick.DATA_START_BRICK_LEFT) {
						startBrick = b;
						moveDir = 2; //BL
					}
					if (data[lx][ly] == Brick.DATA_START_BRICK_RIGHT) {
						startBrick = b;
						moveDir = 0; // TR
					}
					if (data[lx][ly] == Brick.DATA_START_BRICK_UP) {
						startBrick = b;
						moveDir = 3; // TL
					}
					if (data[lx][ly] == Brick.DATA_START_BRICK_DOWN) {
						startBrick = b;
						moveDir = 1; // BR
					}
				}
			}
			
			var baseBrick:Brick = brickGrid[0][0];
			baseBrick.x = 25;
			baseBrick.y = 250;
			for (lx = 0; lx < LEVEL_SIZE_X; ++lx) {
				for (ly = 0; ly < LEVEL_SIZE_Y; ++ly) {
					var curBrick:Brick = brickGrid[lx][ly];
					if (ly > 0) curBrick.SetNorth(brickGrid[lx][ly - 1]);
					if (ly < LEVEL_SIZE_Y - 1) curBrick.SetSouth(brickGrid[lx][ly + 1]);
					if (lx > 0) curBrick.SetWest(brickGrid[lx - 1][ly]);
					if (lx < LEVEL_SIZE_X -1) curBrick.SetEast(brickGrid[lx + 1][ly]);
				}
			}
			
			for each(var animBrick:Brick in bricks) {
				animBrick.AnimateIn();
			}
			
			UpdateBrickDepths();
		}
		
		public function GetStartDirection():int {
			return moveDir;
		}
		
		public function AddBrick(b:Brick):void {
			addChild(b);
			bricks.push(b);
		}
		
		public function SetPlayer(player:Sprite):void {
			this.player = player;
			addChild(player);
			UpdateBrickDepths();
		}
		
		public function UpdateBrickDepths():void {
			var list:Vector.<Sprite> = new Vector.<Sprite>();
			list = list.concat(bricks);
			if(player){
				list.push(player);
			}
			
			list = list.sort(BrickComparer);
			var i:int = 0;
			for each (var b:Sprite in list) {
				setChildIndex(b, i++);
			}
		}
		
		private function BrickComparer(b1:Sprite, b2:Sprite):Number {
			var b1y:Number = b1.y;
			var b2y:Number = b2.y;
			if (b1 is Character) {
				b1y += 10;
			}
			if (b2 is Character) {
				b2y += 10;
			}
			
			if (b1y < b2y)
				return -1;
			if (b1y == b2y)
				return b1.x - b2.x;
			return 1;
		}
		
		/**
		 * Reads level data from file
		 * @param	levelId
		 * @return array[SIZE][SIZE] with literal data
		 */
		private function ReadLevelData(levelId:int):Array {
			var b:ByteArray = new levelData();
			var s:String = b.readUTFBytes(b.length);
			
			var pattern:String = "^" + levelId + "%.*%" + levelId;
			var exp:RegExp = new RegExp(pattern, "sm");
			
			var results:Array = s.match(exp);
			if (!results || results.length == 0) {
				throw new Error("No such level: " + levelId);
			}
			var lvlstring:String = results[0];
			lvlstring = lvlstring.replace(/\r\n/g, '');
			var datastart:int = lvlstring.indexOf("%") + 1;
			var movesstring:String = lvlstring.substr(datastart + LEVEL_SIZE_X * LEVEL_SIZE_Y, 4);
			lvlstring = lvlstring.substr(datastart, LEVEL_SIZE_X * LEVEL_SIZE_Y);

			var retval:Array = new Array();
			var idx:int = 0;
			for (var lx:int = 0; lx < LEVEL_SIZE_X; ++lx) {
				retval.push(new Array());
				for (var ly:int = 0; ly < LEVEL_SIZE_Y; ++ly) {
					retval[lx].push(lvlstring.charAt(idx));
					idx++;
				}
			}
			
			movesFor3Stars = int(movesstring.substr(0, 2));
			movesFor2Stars = int(movesstring.substr(2, 2));
			
			return retval;
		}
		
		public static function GetLevelsCount():int {
			var b:ByteArray = new levelData();
			var s:String = b.readUTFBytes(b.length);
			
			var pattern:String = "%[0-9]+";
			var exp:RegExp = new RegExp(pattern, "g");
			
			var results:Array = s.match(exp);
			return results.length;
		}
	}

}