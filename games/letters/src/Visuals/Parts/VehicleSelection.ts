import { TweenMax } from "@edugames/common/com/greensock/TweenMax.js";
import { Bitmap } from "@edugames/common/flash/display/Bitmap.js";
import { Sprite } from "@edugames/common/flash/display/Sprite.js";
import { Event } from "@edugames/common/flash/events/Event.js";
import { MouseEvent } from "@edugames/common/flash/events/MouseEvent.js";
import { TextField } from "@edugames/common/flash/text/TextField.js";
import { AppFacade } from "../../AppFacade.js";
import { Content } from "../../Content.js";
import { Events } from "../../Events.js";
import { TextStyles } from "../../TextStyles.js";
import { TextButton } from "../TextButton.js";

/**
 * ...
 * @author Perzka Michalowy
 */
export class VehicleSelection extends Sprite {
	public btnLeft: TextButton;
	public btnRight: TextButton;
	public vehicleWindow: Sprite;
	public topText: TextField;
	
	private vehicles: Bitmap[]; // PORT: Vector.<Bitmap>
	private tweenedVehicle: Bitmap;
	private currentVehicle: Bitmap;
	public currentVehicleId: number;
	private isTweening: boolean;
	
	public desiredWidth: number;
	public desiredHeight: number;
	
	private vehicleSizeX: number;
	private vehicleSizeY: number;
	
	constructor(w: number, h: number) {
		super();
		this.desiredHeight = h;
		this.desiredWidth = w;
		
		this.graphics.beginFill(0xffffff);
		this.graphics.drawRect(0, 0, w, h);
		
		this.btnLeft = new TextButton("", Content.GetBitmap("LeftArrow"));
		this.btnRight = new TextButton("", Content.GetBitmap("RightArrow"));
		
		this.topText = TextStyles.CreateNormalText("Wybierz swoj pojazd.");
		this.vehicles = [];
		this.vehicles.push(Content.GetBitmap("Vehicle0"), Content.GetBitmap("Vehicle1"), Content.GetBitmap("Vehicle2"));
		
		this.vehicleWindow = new Sprite();
		let windowMask: Sprite = new Sprite();
		
		this.currentVehicle = this.vehicles[0];
		this.currentVehicleId = 0;
		
		this.vehicleSizeX = (w - (this.btnLeft.width + this.btnRight.width + 2 * 20)) | 0; // PORT: int field
		this.vehicleSizeY = (this.currentVehicle.height * (this.vehicleSizeX / this.currentVehicle.width)) | 0; // PORT: int field
		
		windowMask.graphics.beginFill(0, 0.3);
		windowMask.graphics.drawRect(0, 0, this.vehicleSizeX, this.vehicleSizeY);
		this.vehicleWindow.addChild(windowMask);
		this.vehicleWindow.mask = windowMask;
		
		this.tweenedVehicle = null;
		this.isTweening = false;
		
		this.vehicleWindow.addChild(this.currentVehicle);
		this.currentVehicle.width = this.vehicleSizeX;
		this.currentVehicle.height = this.vehicleSizeY;
		
		this.addChild(this.vehicleWindow);
		this.addChild(this.btnLeft);
		this.addChild(this.btnRight);
		this.addChild(this.topText);
		
		this.topText.x = this.desiredWidth / 2 - this.topText.width / 2;
		this.topText.y = 0;

		this.vehicleWindow.x = this.desiredWidth / 2 - this.vehicleWindow.width / 2;
		this.vehicleWindow.y = this.topText.y + this.topText.height + 20;
		
		this.btnLeft.x = this.vehicleWindow.x - this.btnLeft.width - 20;
		this.btnLeft.y = this.vehicleWindow.y + this.vehicleWindow.height / 2 - this.btnLeft.height / 2;
		
		this.btnRight.x = this.vehicleWindow.x + this.vehicleWindow.width + 20;
		this.btnRight.y = this.btnLeft.y;
		
		
		this.btnLeft.addEventListener(MouseEvent.CLICK, this.PrevVehicle);
		this.btnRight.addEventListener(MouseEvent.CLICK, this.NextVehicle);
	}
	
	public NextVehicle(e: Event): void {
		if (this.isTweening)
			return;
		
		this.isTweening = true;
		// move left
		this.tweenedVehicle = this.currentVehicle;
		this.currentVehicleId++;
		if (this.currentVehicleId >= this.vehicles.length) {
			this.currentVehicleId = 0;
		}
		this.currentVehicle = this.vehicles[this.currentVehicleId];
		this.vehicleWindow.addChild(this.currentVehicle);
		this.currentVehicle.x = this.vehicleSizeX;
		this.currentVehicle.width = this.vehicleSizeX;
		this.currentVehicle.height = this.vehicleSizeY;
		
		TweenMax.allTo([this.tweenedVehicle, this.currentVehicle], 0.5, {x: (-this.vehicleSizeX).toString()}, 0, () => { // PORT: arrow function, the closure uses members
				this.vehicleWindow.removeChild(this.tweenedVehicle);
				this.tweenedVehicle = null;
				this.isTweening = false;
			});
		
		AppFacade.GetInstance().sendNotification(Events.MENU_VEHICLE_SELECTED, this.currentVehicleId);
	}
	
	public PrevVehicle(e: Event): void {
		if (this.isTweening)
			return;
		
		this.isTweening = true;
		this.tweenedVehicle = this.currentVehicle;
		this.currentVehicleId--;
		if (this.currentVehicleId < 0) {
			this.currentVehicleId = this.vehicles.length - 1;
		}
		this.currentVehicle = this.vehicles[this.currentVehicleId];
		this.vehicleWindow.addChild(this.currentVehicle);
		this.currentVehicle.x = -this.vehicleSizeX;
		this.currentVehicle.width = this.vehicleSizeX;
		this.currentVehicle.height = this.vehicleSizeY;
		
		TweenMax.allTo([this.tweenedVehicle, this.currentVehicle], 0.5, {x: this.vehicleSizeX.toString()}, 0, () => { // PORT: arrow function, the closure uses members
				this.vehicleWindow.removeChild(this.tweenedVehicle);
				this.tweenedVehicle = null;
				this.isTweening = false;
			});
		
		AppFacade.GetInstance().sendNotification(Events.MENU_VEHICLE_SELECTED, this.currentVehicleId);
	}
}
