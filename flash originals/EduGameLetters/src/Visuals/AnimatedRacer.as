package Visuals {
	import flash.display.Bitmap;
	import flash.display.DisplayObject;
	import flash.display.Sprite;
	import flash.events.Event;
	import Proxies.Data.RacerData;
	import Proxies.Data.VehicleData;
	
	/**
	 * ...
	 * @author Michal Perzak
	 */
	public class AnimatedRacer extends Sprite {
		public var racerData:RacerData;
		public var vehicleData:VehicleData;
		public var hasFinished:Boolean;
		
		private var frameTime:Number;
		private var currentFrame:int;
		private var frames:Vector.<Bitmap>;
		private var endFrame:Bitmap;
		
		public function AnimatedRacer(vehData:VehicleData) {
			this.racerData = vehData.racer;
			this.vehicleData = vehData;
			currentFrame = 0;
			frameTime = 0;
			hasFinished = false;
			
			frames = new Vector.<Bitmap>();
			var f1:Bitmap = Content.GetBitmap("Vehicle" + (racerData.vehicleImageId + 1) + "f1");
			var f2:Bitmap = Content.GetBitmap("Vehicle" + (racerData.vehicleImageId + 1) + "f2");
			var f3:Bitmap = Content.GetBitmap("Vehicle" + (racerData.vehicleImageId + 1) + "f3");
			endFrame = Content.GetBitmap("veh" + (racerData.vehicleImageId + 1) + "Finish");
						
			frames.push(f1, f2, f3);
			
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
					endFrame.y = -20;
					break;
				case 3:
					f2.x = -3;
					f3.x = -27;
					f3.y = - 21;
					break;
			}
			
			for each(var dispobj:DisplayObject in frames) {
				addChild(dispobj);
				dispobj.visible = false;
			}
			addChild(endFrame);
			endFrame.visible = false;
			
			addEventListener(Event.ENTER_FRAME, onFrame);
			addEventListener(Event.REMOVED_FROM_STAGE, function(e:Event):void { removeEventListener(Event.ENTER_FRAME, onFrame); } );
		}
	
		public function onFrame(e:Event):void {
			frameTime += (Math.pow( vehicleData.rt_velocity, 2) / 100) * (1 / stage.frameRate) + 2;
			
			if (vehicleData.result >= 0 || vehicleData.rt_velocity == 0) {
				frames[currentFrame].visible = false;
				endFrame.visible = true;
				return;
			} else {
				endFrame.visible = false;
			}
			
			if (frameTime > 20 && vehicleData.result < 0) {
				frames[currentFrame].visible = false;
				currentFrame++;
				if (currentFrame > frames.length - 1) currentFrame = 0;
				frames[currentFrame].visible = true;
				frameTime = 0;
			} else if (vehicleData.result >= 0) {
				frames[currentFrame].visible = false;
				frames[0].visible = true;
			}
		}
		
		override public function get width():Number {
			return frames[0].width;
		}
		
		override public function set width(value:Number):void {
			super.width = value;
		}
	}

}