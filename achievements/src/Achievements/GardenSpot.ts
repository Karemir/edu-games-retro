import { MovieClip } from "@edugames/common/flash/display/MovieClip.js";
import { Sprite } from "@edugames/common/flash/display/Sprite.js";
import { Event } from "@edugames/common/flash/events/Event.js";
import { MouseEvent } from "@edugames/common/flash/events/MouseEvent.js";
import { Point } from "@edugames/common/flash/geom/Point.js";
import { Facade } from "@edugames/common/org/puremvc/as3/patterns/facade/Facade.js";
import { Events } from "./Events.js";
import { NetCom } from "./NetCom.js";

/**
 * ...
 * @author ...
 */
export class GardenSpot extends Sprite
{
	public static readonly POSITIONS: Array<any> = [new Point(87, 307), new Point(94, 501), new Point(120, 390), new Point(251, 244), new Point(297, 322), new Point(265, 452), new Point(306, 527), new Point(367, 390), new Point(437, 213), new Point(478, 300), new Point(745, 315), new Point(725, 401), new Point(677, 497), new Point(852, 513)];
	
	public spotId: number;
	public pos: Point;
	public gardenItem: MovieClip;
	public catchSize: number;
	private frameCount: number;
	
	constructor(itemCatchSize: number, positionIdx: number)
	{
		super();
		this.spotId = positionIdx;
		this.catchSize = itemCatchSize;
		this.pos = GardenSpot.POSITIONS[positionIdx];
		this.gardenItem = null;
		
		this.graphics.beginFill(0xff0000, 0.01);
		this.graphics.drawCircle(0, 0, 10);
		this.x = this.pos.x;
		this.y = this.pos.y;
		this.frameCount = 0;
		
		this.addEventListener(Event.ENTER_FRAME, this.onFrame);
	}
	
	/**
	 * checks if the given garden item was dragged onto the spot. If yes, then it gets attached.
	 * @param	item
	 * @return
	 */
	public TryToCatch(item: MovieClip, mousePos: Point): boolean
	{
		let posX: number = mousePos.x - this.x;
		let posY: number = mousePos.y - this.y;
			
		// Pythagorean theorem - level over 9000!
		let dist: number = Math.sqrt((posX * posX) + (posY * posY));
		//trace(pos + " (obj: "+item.x+","+item.y+") dist: " + dist);
		if (dist < this.catchSize)
		{
			this.PlaceItem(item);	
			return true;
		}
		else
		{
			return false;
		}
	}
	
	public onFrame(e: Event): void {
		if (!this.gardenItem) return;
		
		this.frameCount++;
		if (this.frameCount % 2 == 0) {
			this.gardenItem.gotoAndStop(((this.gardenItem.currentFrame+1) % this.gardenItem.totalFrames)+1);
		}
	}
	
	public onMouseDown(e: MouseEvent): void {
		//if (this.gardenItem && this.gardenItem.parent == this) {
			//removeChild(this.gardenItem);
		//}
		this.removeEventListener(MouseEvent.MOUSE_DOWN, this.onMouseDown);
		this.gardenItem.x = e.stageX - this.gardenItem.width / 2;
		this.gardenItem.y = e.stageY - this.gardenItem.height ;
		Facade.getInstance().sendNotification(Events.GARDEN_START_DRAG, this.gardenItem);
		this.gardenItem = null;
		NetCom.instance.GardenClearSlot(this.spotId);
	}
	
	public PlaceItem(item: MovieClip): void {
		item.x = -item.width / 2;
		item.y = -item.height * 0.75;
		this.addEventListener(MouseEvent.MOUSE_DOWN, this.onMouseDown);

		if (this.gardenItem && this.gardenItem.parent == this) {
			this.removeChild(this.gardenItem);
		}
		this.gardenItem = item;
		this.addChild(item);
	}
}
