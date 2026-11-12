import type { Bitmap } from "@edugames/common/flash/display/Bitmap.js";
import type { DisplayObject } from "@edugames/common/flash/display/DisplayObject.js";
import { Sprite } from "@edugames/common/flash/display/Sprite.js";
import { Event } from "@edugames/common/flash/events/Event.js";
import { Content } from "../Content.js";
import type { RacerData } from "../Proxies/Data/RacerData.js";
import type { VehicleData } from "../Proxies/Data/VehicleData.js";

/**
 * ...
 * @author Michal Perzak
 */
export class AnimatedRacer extends Sprite {
	public racerData: RacerData;
	public vehicleData: VehicleData;
	public hasFinished: boolean;
	
	private frameTime: number;
	private currentFrame: number;
	private frames: Bitmap[]; // PORT: Vector.<Bitmap>
	private endFrame: Bitmap;
	
	constructor(vehData: VehicleData) {
		super();
		this.racerData = vehData.racer;
		this.vehicleData = vehData;
		this.currentFrame = 0;
		this.frameTime = 0;
		this.hasFinished = false;
		
		this.frames = [];
		var f1: Bitmap = Content.GetBitmap("Vehicle" + (this.racerData.vehicleImageId + 1) + "f1");
		var f2: Bitmap = Content.GetBitmap("Vehicle" + (this.racerData.vehicleImageId + 1) + "f2");
		var f3: Bitmap = Content.GetBitmap("Vehicle" + (this.racerData.vehicleImageId + 1) + "f3");
		this.endFrame = Content.GetBitmap("veh" + (this.racerData.vehicleImageId + 1) + "Finish");
					
		this.frames.push(f1, f2, f3);
		
		switch(vehData.racer.vehicleImageId) {
			case 0:
				f2.x = 10;
				f3.x = -10;
				break;
			case 1:
				f2.x = -37;
				f3.x = -40;
				break;
			case 2: // whiteone
				f2.x = -0;
				f3.x = -15;
				f1.y = -20;
				f2.y = -20;
				f3.y = -20;
				this.endFrame.y = -20;
				break;
			case 3:
				f2.x = -3;
				f3.x = -27;
				f3.y = - 21;
				break;
		}
		
		for (const dispobj of this.frames as DisplayObject[]) {
			this.addChild(dispobj);
			dispobj.visible = false;
		}
		this.addChild(this.endFrame);
		this.endFrame.visible = false;
		
		this.addEventListener(Event.ENTER_FRAME, this.onFrame);
		this.addEventListener(Event.REMOVED_FROM_STAGE, (e: Event): void => { this.removeEventListener(Event.ENTER_FRAME, this.onFrame); } ); // PORT: arrow function, the closure uses members
	}

	public onFrame(e: Event): void {
		this.frameTime += (Math.pow( this.vehicleData.rt_velocity, 2) / 100) * (1 / this.stage.frameRate) + 2;
		
		if (this.vehicleData.result >= 0 || this.vehicleData.rt_velocity == 0) {
			this.frames[this.currentFrame].visible = false;
			this.endFrame.visible = true;
			return;
		} else {
			this.endFrame.visible = false;
		}
		
		if (this.frameTime > 20 && this.vehicleData.result < 0) {
			this.frames[this.currentFrame].visible = false;
			this.currentFrame++;
			if (this.currentFrame > this.frames.length - 1) this.currentFrame = 0;
			this.frames[this.currentFrame].visible = true;
			this.frameTime = 0;
		} else if (this.vehicleData.result >= 0) {
			this.frames[this.currentFrame].visible = false;
			this.frames[0].visible = true;
		}
	}
	
	public get width(): number {
		return this.frames[0].width;
	}
	
	public set width(value: number) {
		super.width = value;
	}
}
