import { embed } from "@edugames/common/AssetLoader.js";
import { Circ } from "@edugames/common/com/greensock/easing/Circ.js";
import { Linear } from "@edugames/common/com/greensock/easing/Linear.js";
import { TweenLite } from "@edugames/common/com/greensock/TweenLite.js";
import { Bitmap } from "@edugames/common/flash/display/Bitmap.js";
import { Sprite } from "@edugames/common/flash/display/Sprite.js";
import { Point } from "@edugames/common/flash/geom/Point.js";
import { Rectangle } from "@edugames/common/flash/geom/Rectangle.js";
import type { Class } from "@edugames/common/flash/utils/Class.js";
import { setTimeout } from "@edugames/common/flash/utils/setTimeout.js";
import { AppFacade } from "../AppFacade.js";
import { Events } from "../Events.js";
import { Brick } from "./Brick.js";
import { GameLevel } from "./GameLevel.js";

/**
 * ...
 * @author Michal Perzak
 */
export class Character extends Sprite {
	private static readonly BL_1: Class = embed("Assets/robo/BL_1.png");
	private static readonly BL_2: Class = embed("Assets/robo/BL_2.png");
	private static readonly BL_3: Class = embed("Assets/robo/BL_3.png");
	private static readonly BL_on_1: Class = embed("Assets/robo/BL_on_1.png");
	private static readonly BL_on_2: Class = embed("Assets/robo/BL_on_2.png");
	private static readonly BR_1: Class = embed("Assets/robo/BR_1.png");
	private static readonly BR_2: Class = embed("Assets/robo/BR_2.png");
	private static readonly BR_3: Class = embed("Assets/robo/BR_3.png");
	private static readonly BR_on_1: Class = embed("Assets/robo/BR_on_1.png");
	private static readonly BR_on_2: Class = embed("Assets/robo/BR_on_2.png");
	private static readonly TL_1: Class = embed("Assets/robo/TL_1.png");
	private static readonly TL_2: Class = embed("Assets/robo/TL_2.png");
	private static readonly TL_3: Class = embed("Assets/robo/TL_3.png");
	private static readonly TL_4: Class = embed("Assets/robo/TL_4.png");
	private static readonly TL_on_1: Class = embed("Assets/robo/TL_on_1.png");
	private static readonly TL_on_2: Class = embed("Assets/robo/TL_on_2.png");
	private static readonly TR_1: Class = embed("Assets/robo/TR_1.png");
	private static readonly TR_2: Class = embed("Assets/robo/TR_2.png");
	private static readonly TR_3: Class = embed("Assets/robo/TR_3.png");
	private static readonly TR_4: Class = embed("Assets/robo/TR_4.png");
	private static readonly TR_on_1: Class = embed("Assets/robo/TR_on_1.png");
	private static readonly TR_on_2: Class = embed("Assets/robo/TR_on_2.png");
	
	
	public static readonly ANIM_FRAME_TIME: number = 5;
	public static readonly BLOCK_MOVE_TIME: number = 0.7;
	public static readonly FRAME_WIDTH: number = 65;
	public static readonly FRAME_HEIGHT: number = 85;
	private static internal_frame_count: number = 0;
	private static readonly MOVE_ANIMATION_FRAMES: number = 4;
	
	public static readonly ANIMATION_FRAMES: any[] = [
		//top-right
		//[new Point(0, 0), new Point(23, 0), new Point(46, 0)], 
		[ new Character.TR_1(), new Character.TR_2(), new Character.TR_3(), new Character.TR_4(), new Character.TR_on_1(), new Character.TR_on_2()],
		//bot right
		//[new Point(0, 48), new Point(23, 48), new Point(46, 48)], 
		[ new Character.BR_1(), new Character.BR_2(), new Character.BR_1(), new Character.BR_3(), new Character.BR_on_1(), new Character.BR_on_2()],
		//bot left
		//[new Point(0, 96), new Point(23, 96), new Point(46, 96)], 
		[ new Character.BL_1(), new Character.BL_2(), new Character.BL_1(), new Character.BL_3(), new Character.BL_on_1(), new Character.BL_on_2()],
		//top left
		//[new Point(0, 144), new Point(23, 144), new Point(46, 144)]
		[ new Character.TL_1(), new Character.TL_2(), new Character.TL_3(), new Character.TL_4(), new Character.TL_on_1(), new Character.TL_on_2()]
	];
	
	//private var sheetMask:Sprite;
	//private var sheetBmp:Bitmap;
	private sheet: Sprite;
	
	public gameLevel: GameLevel;
	public liftedBrick: Brick;
	public position: Brick;
	public currentDirection: number;
	public currentFrameId: number;
	
	private animation: TweenLite;
	
	constructor(initialDirection: number) {
		super();
		//sheetBmp = Content.GetBitmap("charSheet");
		this.sheet = new Sprite();
		//sheet.addChild(sheetBmp);
		
		this.addChild(this.sheet);
		
		//sheetMask = new Sprite();
		//sheetMask.graphics.beginFill(0);
		//sheetMask.graphics.drawRect(0, 0, FRAME_WIDTH, FRAME_HEIGHT);
		//sheet.addChild(sheetMask);
		//sheet.mask = sheetMask;
		
		this.SetFrame(initialDirection, 4);
		
		this.sheet.x = -Character.FRAME_WIDTH / 2;
		this.sheet.y = -Character.FRAME_HEIGHT;
		
		//scaleX = 2;
		//scaleY = 2;
		this.liftedBrick = null;
	}
	
	private SetFrame(direction: number, frameId: number): void {
		var frame: Bitmap = Character.ANIMATION_FRAMES[direction][frameId];
		frame.smoothing = true;
		if (this.sheet.numChildren > 0) {
			this.sheet.removeChildAt(0);
		}
		this.sheet.addChild(frame);
		//sheetBmp.x = -pos.x;
		//sheetBmp.y = -pos.y;
		this.currentDirection = direction;
		this.currentFrameId = frameId;
	}
	
	private SetNextFrame(): void {
		if (this.currentFrameId == Character.MOVE_ANIMATION_FRAMES - 1) {
			this.SetFrame(this.currentDirection, 0);
		} else {
			this.SetFrame(this.currentDirection, this.currentFrameId + 1);
		}
	}
	
	public AnimateIn(): void {
		this.sheet.y = -100;
		this.sheet.alpha = 0;
		TweenLite.to(this.sheet, 0.7, {y: -Character.FRAME_HEIGHT + 14, alpha: 1, delay: 2, ease: Circ.easeOut, motionBlur: true});
	}
	
	public AnimateOut(sendLvlComplete: boolean): void {
		TweenLite.to(this, 0.5, { alpha:0, height: this.height*3, y: this.y - 20, onComplete: function(): void {
			if (sendLvlComplete) { AppFacade.GetInstance().sendNotification(Events.GAME_COMPLETE_LEVEL);}
		}});
	}
	
	public PowerUp(firstCommand: number): void {
		// PORT: arrow functions, the closures use instance members
		setTimeout((): void => {
			this.SetFrame(this.currentDirection, 5);
			setTimeout((): void => {
				this.SetFrame(this.currentDirection, 0);
					setTimeout(function(): void { AppFacade.GetInstance().sendNotification(Events.GAME_NEXT_COMMAND, firstCommand); }, 300);
				}, 300);
			}, 300);
	}
	
	public RotateLeft(): void {
		if (this.IsAnimating())
			return;
		if (this.currentDirection == 0)
			this.currentDirection = 4;
		this.currentDirection -= 1;
		
		// PORT: arrow function, the closure uses instance members
		setTimeout((): void => {
				this.SetFrame(this.currentDirection, 0);
				AppFacade.GetInstance().sendNotification(Events.GAME_COMMAND_DONE);
			}, 500);
	}
	
	public RotateRight(): void {
		if (this.IsAnimating())
			return;
		if (this.currentDirection == 3)
			this.currentDirection = -1;
		this.currentDirection += 1;
		
		// PORT: arrow function, the closure uses instance members
		setTimeout((): void => {
				this.SetFrame(this.currentDirection, 0);
				AppFacade.GetInstance().sendNotification(Events.GAME_COMMAND_DONE);
			}, 500);
	}
	
	public Use(): void {
		if (this.liftedBrick) {
			if (this.currentDirection == 0) {
				if (this.position.IsEastReplaceable()) {
					this.position.ReplaceEast(this.liftedBrick);
					this.liftedBrick = null;
				} else if (this.position.east.CanBeStacked()) {
					this.position.east.Stack(this.liftedBrick);
					this.liftedBrick = null;
				} else {AppFacade.GetInstance().sendNotification(Events.GAME_COMMAND_DONE);}
			} else if (this.currentDirection == 1) {
				if (this.position.IsSouthReplaceable()) {
					this.position.ReplaceSouth(this.liftedBrick);
					this.liftedBrick = null;
				} else if (this.position.south.CanBeStacked()) {
					this.position.south.Stack(this.liftedBrick);
					this.liftedBrick = null;
				} else {AppFacade.GetInstance().sendNotification(Events.GAME_COMMAND_DONE);}
			} else if (this.currentDirection == 2) {
				if (this.position.IsWestReplaceable()) {
					this.position.ReplaceWest(this.liftedBrick);
					this.liftedBrick = null;
				} else if (this.position.west.CanBeStacked()) {
					this.position.west.Stack(this.liftedBrick);
					this.liftedBrick = null;
				} else {AppFacade.GetInstance().sendNotification(Events.GAME_COMMAND_DONE);}
			} else if (this.currentDirection == 3) {
				if (this.position.IsNorthReplaceable()) {
					this.position.ReplaceNorth(this.liftedBrick);
					this.liftedBrick = null;
				} else if (this.position.north.CanBeStacked()) {
					this.position.north.Stack(this.liftedBrick);
					this.liftedBrick = null;
				} else {AppFacade.GetInstance().sendNotification(Events.GAME_COMMAND_DONE);}
			}
		} else {
			if (this.currentDirection == 0 && this.position.east && this.position.east.CanBeUnstacked()) {
				this.Unstack(this.position.east);
			} else if (this.currentDirection == 1 && this.position.south && this.position.south.CanBeUnstacked()) {
				this.Unstack(this.position.south);
			} else if (this.currentDirection == 2 && this.position.west && this.position.west.CanBeUnstacked()) {
				this.Unstack(this.position.west);
			} else if (this.currentDirection == 3 && this.position.north && this.position.north.CanBeUnstacked()) {
				this.Unstack(this.position.north);
			} else { AppFacade.GetInstance().sendNotification(Events.GAME_COMMAND_DONE);}
		}
	}
	
	public GoForward(): void {
		if (this.currentDirection == 0 && this.position.IsEastWalkable()) {
			this.SetPosition(this.position.east);
		} else if (this.currentDirection == 1 && this.position.IsSouthWalkable()) {
			this.SetPosition(this.position.south);
		} else if (this.currentDirection == 2 && this.position.IsWestWalkable()) {
			this.SetPosition(this.position.west);
		} else if (this.currentDirection == 3 && this.position.IsNorthWalkable()) {
			this.SetPosition(this.position.north);
		} else {
			this.SetFrame(this.currentDirection, 0);
			AppFacade.GetInstance().sendNotification(Events.GAME_COMMAND_DONE);
		}
	}
	
	public SetPosition(brick: Brick): void {
		if (this.IsAnimating())
			return;
		
		if (!this.position) {
			this.SetPositionImpl(brick, false);
			return;
		}
		
		var thisinst: Character = this;
		
		this.animation = TweenLite.to(thisinst, Character.BLOCK_MOVE_TIME, {x: brick.x, y: brick.y, ease: Linear.easeNone, onComplete: function(): void {
				thisinst.SetPositionImpl(brick, true);
			}, onUpdate: function(): void {
				thisinst.UpdateAnimation();
				(thisinst.parent as GameLevel).UpdateBrickDepths();
			}});
	}
	
	private Unstack(brickToUnstack: Brick): void {
		var toLift: Brick = brickToUnstack.stack;
		brickToUnstack.Unstack();
		var globPt: Point = brickToUnstack.localToGlobal(new Point(toLift.x, toLift.y));
		var locPt: Point = this.globalToLocal(globPt);
		this.addChild(toLift);
		toLift.x = locPt.x;
		toLift.y = locPt.y;
		
		toLift.scaleX = 1 / this.scaleX;
		toLift.scaleY = 1 / this.scaleY;
		
		this.liftedBrick = toLift;
		TweenLite.to(toLift, 0.1, {x: 0, y: -Character.FRAME_HEIGHT * 1.2, ease: Linear.easeNone, onComplete: function(): void {
				AppFacade.GetInstance().sendNotification(Events.GAME_COMMAND_DONE);
			}});
	}
	
	private UpdateAnimation(): void {
		Character.internal_frame_count++;
		if (Character.internal_frame_count > Character.ANIM_FRAME_TIME) {
			Character.internal_frame_count = 0;
			
			this.SetNextFrame();
		}
	}
	
	private SetPositionImpl(brick: Brick, isMoving: boolean): void {
		this.position = brick;
		this.x = brick.x;
		this.y = brick.y;
		
		if (brick.brickType == Brick.BRICK_TYPE_END) {
			AppFacade.GetInstance().sendNotification(Events.GAME_STOP_EXECUTE);
			this.AnimateOut(true);
			this.SetFrame(this.currentDirection, 0);
			return;
		}
		
		if (isMoving) {
			this.GoForward();
		}
	}
	
	public IsAnimating(): boolean {
		if (this.animation && this.animation.active)
			return true;
		else
			return false;
	}
}
