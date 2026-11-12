import { Bitmap } from "@edugames/common/flash/display/Bitmap.js";
import { Sprite } from "@edugames/common/flash/display/Sprite.js";
import { Event } from "@edugames/common/flash/events/Event.js";
import { Content } from "./Content.js";

/**
 * ...
 * @author Perz
 */
export class GameView extends Sprite {
	private static readonly LEFT_PANEL_SIZE: number = 400; 
	
	public questionPanel: Sprite;
	public towerPanel: Sprite;
			
	constructor() {
		super();
		this.questionPanel = new Sprite();
		this.towerPanel = new Sprite();
		
		let leftBg: Bitmap = Content.GetBmp("leftPanelBmp");
		leftBg.smoothing = true;
		
		this.addChild(this.questionPanel);
		this.questionPanel.addChild(leftBg);
		this.addChild(this.towerPanel);
		
		this.addEventListener(Event.ADDED_TO_STAGE, this.OnAdded);
	}
	
	private OnAdded(e: Event): void {
		this.questionPanel.graphics.clear();
		this.questionPanel.graphics.beginFill(0xAAAAAA, 0);
		this.questionPanel.graphics.drawRect(0, 0, GameView.LEFT_PANEL_SIZE, this.stage.stageHeight);

		this.towerPanel.graphics.clear();
		this.towerPanel.graphics.beginFill(0xDDDDDD, 0);
		this.towerPanel.graphics.drawRect(0, 0, this.stage.stageWidth - this.questionPanel.width, this.stage.stageHeight);
		this.towerPanel.x = this.questionPanel.width;
	}	
}
