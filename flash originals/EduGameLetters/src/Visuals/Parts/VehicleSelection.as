package Visuals.Parts {
	import com.greensock.TweenMax;
	import flash.display.Bitmap;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.text.TextField;
	import Visuals.TextButton;
	
	/**
	 * ...
	 * @author Perzka Michalowy
	 */
	public class VehicleSelection extends Sprite {
		public var btnLeft:TextButton;
		public var btnRight:TextButton;
		public var vehicleWindow:Sprite;
		public var topText:TextField;
		
		private var vehicles:Vector.<Bitmap>;
		private var tweenedVehicle:Bitmap;
		private var currentVehicle:Bitmap;
		public var currentVehicleId:int;
		private var isTweening:Boolean;
		
		public var desiredWidth:int;
		public var desiredHeight:int;
		
		private var vehicleSizeX:int;
		private var vehicleSizeY:int;
		
		public function VehicleSelection(w:int, h:int) {
			desiredHeight = h;
			desiredWidth = w;
			
			graphics.beginFill(0xffffff);
			graphics.drawRect(0, 0, w, h);
			
			btnLeft = new TextButton("", Content.GetBitmap("LeftArrow"));
			btnRight = new TextButton("", Content.GetBitmap("RightArrow"));
			
			topText = TextStyles.CreateNormalText("Wybierz swoj pojazd.");
			vehicles = new Vector.<Bitmap>();
			vehicles.push(Content.GetBitmap("Vehicle0"), Content.GetBitmap("Vehicle1"), Content.GetBitmap("Vehicle2"));
			
			vehicleWindow = new Sprite();
			var windowMask:Sprite = new Sprite();
			
			currentVehicle = vehicles[0];
			currentVehicleId = 0;
			
			vehicleSizeX = w - (btnLeft.width + btnRight.width + 2 * 20);
			vehicleSizeY = currentVehicle.height * (vehicleSizeX / currentVehicle.width);
			
			windowMask.graphics.beginFill(0, 0.3);
			windowMask.graphics.drawRect(0, 0, vehicleSizeX, vehicleSizeY);
			vehicleWindow.addChild(windowMask);
			vehicleWindow.mask = windowMask;
			
			tweenedVehicle = null;
			isTweening = false;
			
			vehicleWindow.addChild(currentVehicle);
			currentVehicle.width = vehicleSizeX;
			currentVehicle.height = vehicleSizeY;
			
			addChild(vehicleWindow);
			addChild(btnLeft);
			addChild(btnRight);
			addChild(topText);
			
			topText.x = desiredWidth / 2 - topText.width / 2;
			topText.y = 0;

			vehicleWindow.x = desiredWidth / 2 - vehicleWindow.width / 2;
			vehicleWindow.y = topText.y + topText.height + 20;
			
			btnLeft.x = vehicleWindow.x - btnLeft.width - 20;
			btnLeft.y = vehicleWindow.y + vehicleWindow.height / 2 - btnLeft.height / 2;
			
			btnRight.x = vehicleWindow.x + vehicleWindow.width + 20;
			btnRight.y = btnLeft.y;
			
			
			btnLeft.addEventListener(MouseEvent.CLICK, PrevVehicle);
			btnRight.addEventListener(MouseEvent.CLICK, NextVehicle);
		}
		
		public function NextVehicle(e:Event):void {
			if (isTweening)
				return;
			
			isTweening = true;
			// move left
			tweenedVehicle = currentVehicle;
			currentVehicleId++;
			if (currentVehicleId >= vehicles.length) {
				currentVehicleId = 0;
			}
			currentVehicle = vehicles[currentVehicleId];
			vehicleWindow.addChild(currentVehicle);
			currentVehicle.x = vehicleSizeX;
			currentVehicle.width = vehicleSizeX;
			currentVehicle.height = vehicleSizeY;
			
			TweenMax.allTo([tweenedVehicle, currentVehicle], 0.5, {x: (-vehicleSizeX).toString()}, 0, function():void {
					vehicleWindow.removeChild(tweenedVehicle);
					tweenedVehicle = null;
					isTweening = false;
				});
			
			AppFacade.GetInstance().sendNotification(Events.MENU_VEHICLE_SELECTED, currentVehicleId);
		}
		
		public function PrevVehicle(e:Event):void {
			if (isTweening)
				return;
			
			isTweening = true;
			tweenedVehicle = currentVehicle;
			currentVehicleId--;
			if (currentVehicleId < 0) {
				currentVehicleId = vehicles.length - 1;
			}
			currentVehicle = vehicles[currentVehicleId];
			vehicleWindow.addChild(currentVehicle);
			currentVehicle.x = -vehicleSizeX;
			currentVehicle.width = vehicleSizeX;
			currentVehicle.height = vehicleSizeY;
			
			TweenMax.allTo([tweenedVehicle, currentVehicle], 0.5, {x: vehicleSizeX.toString()}, 0, function():void {
					vehicleWindow.removeChild(tweenedVehicle);
					tweenedVehicle = null;
					isTweening = false;
				});
			
			AppFacade.GetInstance().sendNotification(Events.MENU_VEHICLE_SELECTED, currentVehicleId);
		}
	}

}