package Achievements
{
	import flash.display.MovieClip;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.geom.Point;
	import org.puremvc.as3.patterns.facade.Facade;
	
	/**
	 * ...
	 * @author ...
	 */
	public class GardenSpot extends Sprite
	{
		public static const POSITIONS:Array = [new Point(87, 307), new Point(94, 501), new Point(120, 390), new Point(251, 244), new Point(297, 322), new Point(265, 452), new Point(306, 527), new Point(367, 390), new Point(437, 213), new Point(478, 300), new Point(745, 315), new Point(725, 401), new Point(677, 497), new Point(852, 513)];
		
		public var spotId:int;
		public var pos:Point;
		public var gardenItem:MovieClip;
		public var catchSize:int;
		private var frameCount:int;
		
		public function GardenSpot(itemCatchSize:int, positionIdx:int)
		{
			this.spotId = positionIdx;
			this.catchSize = itemCatchSize;
			this.pos = POSITIONS[positionIdx];
			this.gardenItem = null;
			
			graphics.beginFill(0xff0000, 0.01);
			graphics.drawCircle(0, 0, 10);
			x = pos.x;
			y = pos.y;
			frameCount = 0;
			
			addEventListener(Event.ENTER_FRAME, onFrame);
		}
		
		/**
		 * checks if the given garden item was dragged onto the spot. If yes, then it gets attached.
		 * @param	item
		 * @return
		 */
		public function TryToCatch(item:MovieClip, mousePos:Point):Boolean
		{
			var posX:Number = mousePos.x - x;
			var posY:Number = mousePos.y - y;
				
			// Pythagorean theorem - level over 9000!
			var dist:Number = Math.sqrt((posX * posX) + (posY * posY));
			//trace(pos + " (obj: "+item.x+","+item.y+") dist: " + dist);
			if (dist < catchSize)
			{
				PlaceItem(item);	
				return true;
			}
			else
			{
				return false;
			}
		}
		
		public function onFrame(e:Event):void {
			if (!gardenItem) return;
			
			frameCount++;
			if (frameCount % 2 == 0) {
				gardenItem.gotoAndStop(((gardenItem.currentFrame+1) % gardenItem.totalFrames)+1);
			}
		}
		
		public function onMouseDown(e:MouseEvent):void {
			//if (this.gardenItem && this.gardenItem.parent == this) {
				//removeChild(this.gardenItem);
			//}
			removeEventListener(MouseEvent.MOUSE_DOWN, onMouseDown);
			gardenItem.x = e.stageX - gardenItem.width / 2;
			gardenItem.y = e.stageY - gardenItem.height ;
			Facade.getInstance().sendNotification(Events.GARDEN_START_DRAG, this.gardenItem);
			this.gardenItem = null;
			NetCom.instance.GardenClearSlot(spotId);
		}
		
		public function PlaceItem(item:MovieClip):void {
			item.x = -item.width / 2;
			item.y = -item.height * 0.75;
			addEventListener(MouseEvent.MOUSE_DOWN, onMouseDown);

			if (this.gardenItem && this.gardenItem.parent == this) {
				removeChild(this.gardenItem);
			}
			this.gardenItem = item;
			addChild(item);
		}
	}

}