import { TweenLite } from "@edugames/common/com/greensock/TweenLite.js";
import { Bitmap } from "@edugames/common/flash/display/Bitmap.js";
import { Sprite } from "@edugames/common/flash/display/Sprite.js";
import { Event } from "@edugames/common/flash/events/Event.js";
import { MouseEvent } from "@edugames/common/flash/events/MouseEvent.js";
import { setTimeout } from "@edugames/common/flash/utils/setTimeout.js";
import { AppFacade } from "../AppFacade.js";
import { Content } from "../Content.js";
import { Events } from "../Events.js";

/**
 * Robo command is a model in proxy, but also can be displayed 
 * @author Michal Perzak
 */
export class RoboCommand extends Sprite {
	public static readonly EXECUTE: number = 0; // not quite a command but also a button.
	public static readonly FORWARD: number = 1;
	public static readonly ROTATE_LEFT: number = 2;
	public static readonly ROTATE_RIGHT: number = 3;
	public static readonly USE: number = 4;
	
	private comtype: number;
	/**
	 * When true, it means this command is a toolbox command. 
	 * Use it onClick - if in toolbox then user wants to add it to stack, otherwise user wants to remove
	 */
	public toolboxMode: boolean;
	private image: Bitmap;
	
	constructor(commandType: number, toolboxMode: boolean) {
		super();
		this.comtype = commandType;
		this.toolboxMode = toolboxMode;
		this.buttonMode = true;
					
		if(toolboxMode){
			this.addEventListener(MouseEvent.CLICK, this.OnClick);
		} else {
			// clicking not in toolbox mode removes element
			//addEventListener(MouseEvent.CLICK, OnRemove);
		}

		if (toolboxMode) {
			switch(commandType) {
				case RoboCommand.FORWARD:
					this.image = Content.GetBitmap("forwardBlack");
					break;
				case RoboCommand.ROTATE_LEFT:
					this.image = Content.GetBitmap("rotateLeftBlack");
					break;
				case RoboCommand.ROTATE_RIGHT:
					this.image = Content.GetBitmap("rotateRightBlack");
					break;
				case RoboCommand.USE:
					this.image = Content.GetBitmap("useBlack");
					break;
				case RoboCommand.EXECUTE:
					this.image = Content.GetBitmap("execute");
					break;
			}
		} else {
			switch(commandType) {
				case RoboCommand.FORWARD:
					this.image = Content.GetBitmap("forwardGray");
					break;
				case RoboCommand.ROTATE_LEFT:
					this.image = Content.GetBitmap("rotateLeftGray");
					break;
				case RoboCommand.ROTATE_RIGHT:
					this.image = Content.GetBitmap("rotateRightGray");
					break;
				case RoboCommand.USE:
					this.image = Content.GetBitmap("useGray");
					break;
			}
		}
		this.addChild(this.image);
	}
	
	public GetCommand(): number {
		return this.comtype;
	}
	
	public IsCommand(commandType: number): boolean {
		return this.comtype == commandType;
	}
	
	public OnClick(e: Event): void {
		if (this.comtype == RoboCommand.EXECUTE) {
			AppFacade.GetInstance().sendNotification(Events.GAME_EXECUTE, this.comtype);
		} else {
			AppFacade.GetInstance().sendNotification(Events.GAME_ADD_COMMAND, this.comtype);
		}
		let btn: Sprite = e.currentTarget as Sprite;
		TweenLite.to(btn, 0.1, { tint:0xaaff44, onComplete: function(): void { TweenLite.to(btn, 0.1, { removeTint:true } ); }} );
	}
	
	public OnRemove(e: Event): void {
		this.removeEventListener(MouseEvent.CLICK, this.OnRemove);
		let inst: RoboCommand = this;
		//TweenLite.to(this, 0.1, { alpha:0 } );
		//setTimeout( function():void { 
			AppFacade.GetInstance().sendNotification(Events.GAME_REMOVE_COMMAND, inst); 
		//}, 0); 			
	}
}
