import { embed } from "@edugames/common/AssetLoader.js";
import { Bounce } from "@edugames/common/com/greensock/easing/Bounce.js";
import { Linear } from "@edugames/common/com/greensock/easing/Linear.js";
import { VideoLoaderVars } from "@edugames/common/com/greensock/loading/data/VideoLoaderVars.js";
import { TweenLite } from "@edugames/common/com/greensock/TweenLite.js";
import { Bitmap } from "@edugames/common/flash/display/Bitmap.js";
import { Sprite } from "@edugames/common/flash/display/Sprite.js";
import { Point } from "@edugames/common/flash/geom/Point.js";
import type { Class } from "@edugames/common/flash/utils/Class.js";
import { AppFacade } from "../AppFacade.js";
import { Events } from "../Events.js";
import { GameLevel } from "./GameLevel.js";

/**
 * ...
 * @author Michal Perzak
 */
export class Brick extends Sprite {
	// PORT: instance embeds hoisted to static
	private static blockedCl: Class = embed("Assets/BrickBlock.png");
	private static endCl: Class = embed("Assets/BrickEnd.png");
	
	public static readonly BRICK_TYPE_NORMAL: number = 1;
	public static readonly BRICK_TYPE_NONE: number = 2;
	public static readonly BRICK_TYPE_END: number = 3;
	
	public static readonly DATA_STACKED_BRICK: string = "O";
	public static readonly DATA_NORMAL_BRICK: string = "o";
	public static readonly DATA_START_BRICK: string = "S";
	public static readonly DATA_START_BRICK_UP: string = "G";
	public static readonly DATA_START_BRICK_DOWN: string = "D";
	public static readonly DATA_START_BRICK_LEFT: string = "L";
	public static readonly DATA_START_BRICK_RIGHT: string = "P";
	public static readonly DATA_EMPTY_BRICK: string = "_";
	public static readonly DATA_END_BRICK: string = "E";
	
	private static readonly TOP_OFFSET: number = 14;
	
	public brickType: number;
	public bmp: Bitmap;
	
	// Datastructure
	public north: Brick;
	public south: Brick;
	public west: Brick; // left
	public east: Brick; // right
	public stack: Brick; // on top
	
	// indexing in the whole level
	public indexX: number;
	public indexY: number;
	
	constructor(dataType: string) {
		super();
		
		if (dataType == Brick.DATA_NORMAL_BRICK || dataType == Brick.DATA_START_BRICK || dataType == Brick.DATA_START_BRICK_DOWN || dataType == Brick.DATA_START_BRICK_LEFT || dataType == Brick.DATA_START_BRICK_RIGHT || dataType == Brick.DATA_START_BRICK_UP) {
			this.bmp = new Brick.blockedCl() as Bitmap;
			this.brickType = Brick.BRICK_TYPE_NORMAL;
		} else if (dataType == Brick.DATA_STACKED_BRICK) {
			this.bmp = new Brick.blockedCl() as Bitmap;
			this.brickType = Brick.BRICK_TYPE_NORMAL;
			this.stack = new Brick(Brick.DATA_NORMAL_BRICK);
			this.stack.y = -this.stack.height + Brick.TOP_OFFSET * 2;
		} else if (dataType == Brick.DATA_END_BRICK) {
			this.bmp = new Brick.endCl();
			this.brickType = Brick.BRICK_TYPE_END;
		} else if (dataType == Brick.DATA_EMPTY_BRICK) {
			this.bmp = new Brick.blockedCl() as Bitmap;
			this.brickType = Brick.BRICK_TYPE_NONE;
		} else {
			throw new Error("unknown block type");
		}
		this.bmp.smoothing = true;
		this.addChild(this.bmp);
		if (this.stack) {
			this.addChild(this.stack);
		}
		
		this.bmp.alpha = 0;
		this.bmp.x = -this.bmp.width / 2;
		this.bmp.y = -Brick.TOP_OFFSET;
	
		//graphics.beginFill(0xff0000);
		//graphics.drawCircle(0, 0, 5);
	}
	
	public Clear(): void {
		this.north = null;
		this.south = null;
		this.east = null;
		this.west = null;
		this.stack = null;
	}
	
	public IsNorthWalkable(): boolean {
		if (this.north && (this.north.brickType == Brick.BRICK_TYPE_NORMAL || this.north.brickType == Brick.BRICK_TYPE_END) && !this.north.stack) {
			return true;
		}
		return false;
	}
	
	public IsSouthWalkable(): boolean {
		if (this.south && (this.south.brickType == Brick.BRICK_TYPE_NORMAL || this.south.brickType == Brick.BRICK_TYPE_END) && !this.south.stack) {
			return true;
		}
		return false;
	}
	
	public IsWestWalkable(): boolean {
		if (this.west && (this.west.brickType == Brick.BRICK_TYPE_NORMAL || this.west.brickType == Brick.BRICK_TYPE_END) && !this.west.stack) {
			return true;
		}
		return false;
	}
	
	public IsEastWalkable(): boolean {
		if (this.east && (this.east.brickType == Brick.BRICK_TYPE_NORMAL || this.east.brickType == Brick.BRICK_TYPE_END) && !this.east.stack) {
			return true;
		}
		return false;
	}
	
	public IsSouthReplaceable(): boolean {
		if (!this.south || this.south.brickType == Brick.BRICK_TYPE_NONE) {
			return true;
		}
		return false;
	}
	
	public ReplaceSouth(newBrick: Brick): void {
		if (this.south) {
			var tmp: Brick = this.south;
			this.south.copyStructure(newBrick);				
			tmp.Clear();
		} else {
			newBrick.north = this;
		}
		var globPt: Point = newBrick.parent.localToGlobal(new Point(newBrick.x, newBrick.y));
		var locPt: Point = this.parent.globalToLocal(globPt);
		newBrick.scaleX = newBrick.scaleY = 1;
		newBrick.x = locPt.x;
		newBrick.y = locPt.y;

		(this.parent as GameLevel).AddBrick(newBrick);
		this.SetSouth(newBrick, true);
	}
	
	public IsNorthReplaceable(): boolean {
		if (!this.north || this.north.brickType == Brick.BRICK_TYPE_NONE) {
			return true;
		}
		return false;
	}

	public ReplaceNorth(newBrick: Brick): void {
		if (this.north) {
			var tmp: Brick = this.north;
			this.north.copyStructure(newBrick);				
			tmp.Clear();
		} else {
			newBrick.south = this;
		}
		var globPt: Point = newBrick.parent.localToGlobal(new Point(newBrick.x, newBrick.y));
		var locPt: Point = this.parent.globalToLocal(globPt);
		newBrick.scaleX = newBrick.scaleY = 1;
		
		newBrick.x = locPt.x;
		newBrick.y = locPt.y;
		(this.parent as GameLevel).AddBrick(newBrick);
		this.SetNorth(newBrick, true);
	}
	
	public IsEastReplaceable(): boolean {
		if (!this.east || this.east.brickType == Brick.BRICK_TYPE_NONE) {
			return true;
		}
		return false;
	}
	
	public ReplaceEast(newBrick: Brick): void {
		if (this.east) {
			var tmp: Brick = this.east;
			this.east.copyStructure(newBrick);				
			tmp.Clear();
		} else {
			newBrick.west = this;
		}
		var globPt: Point = newBrick.parent.localToGlobal(new Point(newBrick.x, newBrick.y));
		var locPt: Point = this.parent.globalToLocal(globPt);
		newBrick.scaleX = newBrick.scaleY = 1;
		newBrick.x = locPt.x;
		newBrick.y = locPt.y;

		(this.parent as GameLevel).AddBrick(newBrick);
		this.SetEast(newBrick, true);
	}
	
	public IsWestReplaceable(): boolean {
		if (!this.west || this.west.brickType == Brick.BRICK_TYPE_NONE) {
			return true;
		}
		return false;
	}
	
	public ReplaceWest(newBrick: Brick): void {
		if (this.west) {
			var tmp: Brick = this.west;
			this.west.copyStructure(newBrick);				
			tmp.Clear();
		} else {
			newBrick.east = this;
		}
		var globPt: Point = newBrick.parent.localToGlobal(new Point(newBrick.x, newBrick.y));
		var locPt: Point = this.parent.globalToLocal(globPt);
		newBrick.scaleX = newBrick.scaleY = 1;
		newBrick.x = locPt.x;
		newBrick.y = locPt.y;

		(this.parent as GameLevel).AddBrick(newBrick);
		this.SetWest(newBrick, true);
	}

	public CanBeUnstacked(): boolean {
		if (this.stack && this.stack.brickType == Brick.BRICK_TYPE_NORMAL) {
			return true;
		}
		return false;
	}
	
	public Unstack(): void {
		this.stack = null;
	}
	
	public CanBeStacked(): boolean {
		if (this.brickType == Brick.BRICK_TYPE_NORMAL && !this.stack) {
			return true;
		}
		return false;
	}
	
	public Stack(brickToStack: Brick): void {
		var globPt: Point = brickToStack.parent.localToGlobal(new Point(brickToStack.x, brickToStack.y));
		var locPt: Point = this.globalToLocal(globPt);
		
		this.addChild(brickToStack);
		brickToStack.x = locPt.x;
		brickToStack.y = locPt.y;
		brickToStack.scaleX = 1 / this.scaleX;
		brickToStack.scaleY = 1 / this.scaleY;
		
		this.stack = brickToStack;
		
		TweenLite.to(brickToStack, 0.1, {y: -this.stack.height + Brick.TOP_OFFSET * 2, x: 0, ease: Linear.easeNone, onComplete: function(): void {
				AppFacade.GetInstance().sendNotification(Events.GAME_COMMAND_DONE);
			}});
	
	}
	
	public SetNorth(brick: Brick, isAction: boolean = false): void {
		this.north = brick;
		if(!isAction){
			this.north.x = this.x - this.bmp.width / 2;
			this.north.y = this.y - Brick.TOP_OFFSET;
		} else {
			// PORT: arrow function, the closure uses the instance's `parent`
			TweenLite.to(this.north, 0.2, { x: this.x - this.bmp.width / 2, y: this.y - Brick.TOP_OFFSET, onComplete: (): void => {
				AppFacade.GetInstance().sendNotification(Events.GAME_COMMAND_DONE);
				(this.parent as GameLevel).UpdateBrickDepths();
			}});
		}
	}
	
	public SetSouth(brick: Brick, isAction: boolean = false): void {
		this.south = brick;
		if(!isAction){
			this.south.x = this.x + this.bmp.width / 2;
			this.south.y = this.y + Brick.TOP_OFFSET;
		} else {
			// PORT: arrow function, the closure uses the instance's `parent`
			TweenLite.to(this.south, 0.2, { x: this.x + this.bmp.width / 2, y: this.y + Brick.TOP_OFFSET, onComplete: (): void => {
				AppFacade.GetInstance().sendNotification(Events.GAME_COMMAND_DONE);
				(this.parent as GameLevel).UpdateBrickDepths();
			}});
		}
	}
	
	public SetWest(brick: Brick, isAction: boolean = false): void {
		this.west = brick;
		if(!isAction){
			this.west.x = this.x - this.bmp.width / 2;
			this.west.y = this.y + Brick.TOP_OFFSET;
		} else {
			// PORT: arrow function, the closure uses the instance's `parent`
			TweenLite.to(this.west, 0.2, { x: this.x - this.bmp.width / 2, y: this.y + Brick.TOP_OFFSET, onComplete: (): void => {
				AppFacade.GetInstance().sendNotification(Events.GAME_COMMAND_DONE);
				(this.parent as GameLevel).UpdateBrickDepths();
			}});
		}
	}
	
	public SetEast(brick: Brick, isAction: boolean = false): void {
		this.east = brick;
		if(!isAction){
			this.east.x = this.x + this.bmp.width / 2;
			this.east.y = this.y - Brick.TOP_OFFSET;
		} else {
			// PORT: arrow function, the closure uses the instance's `parent`
			TweenLite.to(this.east, 0.2, { x: this.x + this.bmp.width / 2, y: this.y - Brick.TOP_OFFSET, onComplete: (): void => {
				AppFacade.GetInstance().sendNotification(Events.GAME_COMMAND_DONE);
				(this.parent as GameLevel).UpdateBrickDepths();
			}});
		}
	}
	
	public AnimateIn(): void {
		if (this.brickType != Brick.BRICK_TYPE_NONE) {
			var diff: number = Math.abs(this.indexX - (GameLevel.LEVEL_SIZE_X - 1) / 2.0) + Math.abs(this.indexY - (GameLevel.LEVEL_SIZE_Y - 1) / 2.0);
			this.bmp.y = 100;
			TweenLite.to(this.bmp, 1.8, {delay: diff / 11, y: -Brick.TOP_OFFSET, alpha: 1, ease: Bounce.easeOut});
			
			if (this.stack) {
				this.stack.bmp.y -= 100;
				TweenLite.to(this.stack.bmp, 1.8, {delay: diff / 11, y: this.stack.bmp.y + 100, alpha: 1, ease: Bounce.easeOut});
			}
		}
	}
	
	public AnimateOut(): void {
		TweenLite.to(this, 0.5, {alpha: 0});
	}
	
	private copyStructure(other: Brick): void {
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
