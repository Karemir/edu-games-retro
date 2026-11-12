import { Linear } from "@edugames/common/com/greensock/easing/Linear.js";
import { TweenLite } from "@edugames/common/com/greensock/TweenLite.js";
import type { Bitmap } from "@edugames/common/flash/display/Bitmap.js";
import { Sprite } from "@edugames/common/flash/display/Sprite.js";
import { Event } from "@edugames/common/flash/events/Event.js";
import { Content } from "../Content.js";

/**
 * ...
 * @author Michal Perzak
 */
export class Butterfly extends Sprite {
	
	public isFlying: boolean;
	private f1: Bitmap;
	private f2: Bitmap;
	private frame: number;
	private initY: number;
	
	constructor() {
		super();
		this.addEventListener(Event.ADDED_TO_STAGE, this.onAdded);
		this.isFlying = false;
	}
	
	public onAdded(e: Event): void {
		this.removeEventListener(Event.ADDED_TO_STAGE, this.onAdded);
		this.addEventListener(Event.ENTER_FRAME, this.onUpdate);
		
		this.f1 = Content.GetBitmap("butterfly1");
		this.f2 = Content.GetBitmap("butterfly2");
		
		this.addChild(this.f1);
		this.addChild(this.f2);
		this.f2.visible = false;
		this.frame = 0;
		
		this.initY = this.y;
	}
	
	public onUpdate(e: Event = null): void {
		this.frame++;
		if (this.frame >= 3 && Math.random() > 0.4) {
			this.frame = 0;
			if (this.f1.visible) {
				this.f1.visible = false; 
				this.f2.visible = true;
			} else {
				this.f1.visible = true;
				this.f2.visible = false;
			}
		}
		
		this.y = this.initY + Math.sin(new Date().getTime() / 1000) * 15; // PORT: Date.time -> getTime()
	}
	
	public Fly(): void {
		this.isFlying = true;
		this.ResetFly();
	}
	
	private ResetFly(): void {
		this.x = -100;
		if(this.parent && this.stage){
			TweenLite.to(this, 10, { x: this.stage.stageWidth, ease: Linear.easeIn, onComplete:this.ResetFly } );
		}
	}
}
