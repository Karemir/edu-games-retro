import { Bounce } from "@edugames/common/com/greensock/easing/Bounce.js";
import { Circ } from "@edugames/common/com/greensock/easing/Circ.js";
import { Cubic } from "@edugames/common/com/greensock/easing/Cubic.js";
import { Linear } from "@edugames/common/com/greensock/easing/Linear.js";
import { TweenLite } from "@edugames/common/com/greensock/TweenLite.js";
import { Sprite } from "@edugames/common/flash/display/Sprite.js";
import { Event } from "@edugames/common/flash/events/Event.js";
import { MouseEvent } from "@edugames/common/flash/events/MouseEvent.js";
import { Rectangle } from "@edugames/common/flash/geom/Rectangle.js";
import { ByteArray } from "@edugames/common/flash/utils/ByteArray.js";
import { setTimeout } from "@edugames/common/flash/utils/setTimeout.js";
import { AppFacade } from "../AppFacade.js";
import { Events } from "../Events.js";
import { RoboCommand } from "./RoboCommand.js";

/**
 * ...
 * @author Michal Perzak
 */
export class CommandList extends Sprite {
	private static readonly ICON_SIZE: number = 42;
	private maskSprite: Sprite;
	private listCont: Sprite;
	public roboCommands: RoboCommand[];
	public isExecuting: boolean;
	
	private beforeDragX: number = 0; // PORT: AS3 int defaults to 0
	private beforeDragY: number = 0; // PORT: AS3 int defaults to 0
	private draggedCom: RoboCommand;
	
	constructor() {
		super();
		this.roboCommands = new Array<RoboCommand>();
		this.maskSprite = new Sprite();
		this.listCont = new Sprite();
		
		this.addEventListener(Event.ADDED_TO_STAGE, this.onAdded);
		this.isExecuting = false;
	}
	
	private onAdded(e: Event): void {
		this.graphics.beginFill(0x33aaff, 0);
		this.graphics.drawRoundRect(0, 0, this.stage.stageWidth - 145, CommandList.ICON_SIZE, 25);
		
		this.maskSprite.graphics.beginFill(0x33aaff, 0.7);
		this.maskSprite.graphics.drawRoundRect(0, 0, this.stage.stageWidth - 145, CommandList.ICON_SIZE, 25);
		this.addChild(this.maskSprite);
		this.addChild(this.listCont);
		this.listCont.mask = this.maskSprite;
	}
	
	public HasCommand(): boolean {
		return this.roboCommands.length > 0;
	}
	
	public GetCommand(): number {
		if (this.roboCommands.length > 0) {
			return this.roboCommands[0].GetCommand();
		} else {
			return -1;
		}
	}
	
	public AddCommand(command: number): void {
		if (this.isExecuting)
			return;
		let com: RoboCommand = new RoboCommand(command, false);
		this.AddCommandInst(com);
		
		com.addEventListener(MouseEvent.MOUSE_DOWN, this.onStartDrag);
	}
	
	public onStartDrag(e: MouseEvent): void {
		this.draggedCom = e.target as RoboCommand;
		this.listCont.swapChildrenAt(this.listCont.getChildIndex(this.draggedCom), this.listCont.numChildren - 1);
		
		this.beforeDragX = this.draggedCom.x | 0; // PORT: AS3 int assignment truncates
		this.beforeDragY = this.draggedCom.y | 0; // PORT: AS3 int assignment truncates
		this.draggedCom.startDrag(false, new Rectangle(0, 0, this.maskSprite.width, 0));
		TweenLite.to(this.draggedCom, 0.4, { alpha: 0.6 } );
		
		this.stage.addEventListener(MouseEvent.MOUSE_MOVE, this.onDragUpdate);
		this.stage.addEventListener(MouseEvent.MOUSE_UP, this.onEndDrag);
	}
	
	public onEndDrag(e: MouseEvent): void {
		this.stage.removeEventListener(MouseEvent.MOUSE_MOVE, this.onDragUpdate);
		this.stage.removeEventListener(MouseEvent.MOUSE_UP, this.onEndDrag);
		
		this.draggedCom.stopDrag();
		
		if (this.draggedCom.x == this.beforeDragX && this.draggedCom.y == this.beforeDragY) {
			AppFacade.GetInstance().sendNotification(Events.GAME_REMOVE_COMMAND, this.draggedCom);
		} else {
			TweenLite.to(this.draggedCom, 0.4, {x: (5 + this.roboCommands.indexOf(this.draggedCom) * CommandList.ICON_SIZE), y: this.beforeDragY, alpha:1});
		}
	}
	
	public onDragUpdate(e: MouseEvent): void {
		let pos: number = (this.draggedCom.x + this.draggedCom.width / 2) | 0; // PORT: AS3 int assignment truncates
		let draggedIdx: number = this.roboCommands.indexOf(this.draggedCom);
		for (let i: number = 0; i < this.roboCommands.length; ++i) {
			let tmpC: RoboCommand = this.roboCommands[i];
			let tmpcPos: number = (tmpC.x + tmpC.width / 2) | 0; // PORT: AS3 int assignment truncates
			
			if (tmpcPos < pos && i > draggedIdx) {
				// move left
				this.swapItems(this.roboCommands, tmpC, this.draggedCom);
				TweenLite.to(tmpC, 0.4, { x: (5 + draggedIdx * CommandList.ICON_SIZE) } );
				
				break;
			} else if (tmpcPos > pos && i < draggedIdx) {
				// move right
				this.swapItems(this.roboCommands, tmpC, this.draggedCom);
				TweenLite.to(tmpC, 0.4, {x: (5 + draggedIdx * CommandList.ICON_SIZE)});
				break;
			}
		}
	}
	
	public AddCommandInst(command: RoboCommand): void {
		this.listCont.addChild(command);
		command.x = this.width;
		command.y = 0;
		command.width = CommandList.ICON_SIZE;
		command.height = CommandList.ICON_SIZE;
		let pos: number = 5 + this.roboCommands.length * CommandList.ICON_SIZE;
		
		TweenLite.to(command, 0.6, {x: pos, ease: Cubic.easeOut});
		this.roboCommands.push(command);
		
		this.UpdateListPos();
	}
	
	public UpdateListPos(): void {
		let newx: number = -((5+this.roboCommands.length*CommandList.ICON_SIZE) + CommandList.ICON_SIZE) + this.maskSprite.width;
		if (newx < 0) {
			TweenLite.to(this.listCont, 0.5, { x:newx } );
		} else {
			TweenLite.to(this.listCont, 0.5, { x:0 } );
		}
	}
	
	public RestoreCommands(list: RoboCommand[]): void {
		for (const it of list) { // PORT: for each
			this.AddCommand(it.GetCommand());
		}
		this.UpdatePositions();
	}
	
	public OnCommandRemove(command: RoboCommand): void {
		if (this.isExecuting)
			return;
		
		for (let i: number = 0; i < this.roboCommands.length; ++i) {
			if (this.roboCommands[i] == command) {
				this.roboCommands.splice(i, 1);
				this.listCont.removeChild(command);
				this.UpdatePositions(true);
				break;
			}
		}
	}
	
	public OnCommandDone(): void {
		let removedItem: Sprite = this.roboCommands.shift();
		
		// PORT: arrow function, the closure uses a member
		TweenLite.to(removedItem, 0.4, {alpha: 0, onComplete: () => {
				this.listCont.removeChild(removedItem);
			}});
		
		this.UpdatePositions();
		
		if (!this.isExecuting) {
			return;
		}
		
		if (this.roboCommands.length > 0) {
			setTimeout(AppFacade.GetInstance().sendNotification, 500, Events.GAME_NEXT_COMMAND, this.GetCommand());
		} else {
			AppFacade.GetInstance().sendNotification(Events.GAME_RESET_LEVEL);
		}
	}
	
	private UpdatePositions(fast: boolean = false): void {
		let nextpos: number = 5;
		let delay: number = 0; // 0.1;
		let duration: number = 0.5;
		if (fast)
			duration = 0.1;
		for (const cmd of this.roboCommands) { // PORT: for each
			TweenLite.to(cmd, duration, {x: nextpos, delay: delay});
			nextpos += cmd.width;
			delay += 0.016;
		}
		this.UpdateListPos();
	}
	
	public StopExecuting(): void {
		this.isExecuting = false;
	}
	
	public StartExecuting(): void {
		this.isExecuting = true;
	}
	
	private swapItems(vec: RoboCommand[], item1: RoboCommand, item2: RoboCommand): void {
		let item1pos: number = vec.indexOf(item1);
		let item2pos: number = vec.indexOf(item2);
		
		if ((item1pos != -1) && (item2pos != -1)) {
			let tempItem: RoboCommand = vec[item2pos];
			vec[item2pos] = vec[item1pos];
			vec[item1pos] = tempItem;
		}
	}
}
