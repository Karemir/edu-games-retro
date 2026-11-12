import { MovieClip } from "@edugames/common/flash/display/MovieClip.js";
import { Sprite } from "@edugames/common/flash/display/Sprite.js";
import { Event } from "@edugames/common/flash/events/Event.js";
import { MouseEvent } from "@edugames/common/flash/events/MouseEvent.js";
import { ColorTransform } from "@edugames/common/flash/geom/ColorTransform.js";
import type { Class } from "@edugames/common/flash/utils/Class.js";
import { Facade } from "@edugames/common/org/puremvc/as3/patterns/facade/Facade.js";
import type { Achievement } from "./Achievement.js";
import { AchievementProxy } from "./AchievementProxy.js";
import { Events } from "./Events.js";

/**
 * ...
 * @author Michal Perzak
 */
export class GardenItem extends Sprite {
	public isBought: boolean;
	public itemId: number;
	public content: MovieClip;
	public isPlaced: boolean;
	public clickLayer: Sprite;
	public achievement: Achievement;
	
	public contentImage: MovieClip;
	
	constructor(isPlaced: boolean, itemId: number) {
		super();
		let achProxy: AchievementProxy = Facade.getInstance().retrieveProxy(AchievementProxy.NAME) as AchievementProxy;
		this.achievement = achProxy.GetAchievement(itemId);

		let contentClass: Class = this.achievement.contentClass;
		this.content = new contentClass() as MovieClip;
		this.itemId = itemId;
		this.isBought = this.achievement.unlocked;
		this.isPlaced = isPlaced;
		this.contentImage = new contentClass() as MovieClip;
		this.contentImage.name = itemId.toString();
		
		if (!isPlaced) {
			if (this.content.width > this.content.height) {
				this.content.width = 90;
				this.content.height *= this.content.scaleX;
			} else {
				this.content.height = 90;
				this.content.width *= this.content.scaleY;
			}
			this.content.stop();
		}
		this.addChild(this.content);
		
		this.content.x = -this.content.width / 2;
		this.content.y = -this.content.height / 2;
			
		this.addEventListener(Event.ADDED_TO_STAGE, this.onAdded);
	}
	
	public onAdded(e: Event): void {
		this.clickLayer = new Sprite();
		this.clickLayer.graphics.beginFill(0, 0.001);
		this.clickLayer.graphics.drawRect(this.content.x, this.content.y, this.content.width, this.content.height);
		this.addChild(this.clickLayer);
		
		if (!this.isBought) {
			this.content.transform.colorTransform = new ColorTransform(0.6, 0.6, 0.6, 0.7);
		} else {
			this.addEventListener(MouseEvent.MOUSE_DOWN, this.onDown);
		}
		
		this.addEventListener(MouseEvent.MOUSE_OVER, this.onOver);
		this.addEventListener(MouseEvent.MOUSE_OUT, this.onOut);
	}
	
	public onOver(e: MouseEvent): void {
		Facade.getInstance().sendNotification(Events.ACHIEVEMENT_DESC_SHOW, this);
	}
	
	public onOut(e: MouseEvent): void {
		Facade.getInstance().sendNotification(Events.ACHIEVEMENT_DESC_HIDE);
	}
	
	public onDown(e: MouseEvent): void {
		this.contentImage.stop();
		Facade.getInstance().sendNotification(Events.GARDEN_START_DRAG, this.contentImage);
		this.contentImage.x = e.stageX - this.contentImage.width / 2;
		this.contentImage.y = e.stageY - this.contentImage.height ;
	}
}
