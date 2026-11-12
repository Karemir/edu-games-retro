import type { Class } from "@edugames/common/flash/utils/Class.js";
import { embed } from "@edugames/common/AssetLoader.js";
import { TweenLite } from "@edugames/common/com/greensock/TweenLite.js";
import { Bitmap } from "@edugames/common/flash/display/Bitmap.js";
import { DisplayObject } from "@edugames/common/flash/display/DisplayObject.js";
import { MovieClip } from "@edugames/common/flash/display/MovieClip.js";
import { Sprite } from "@edugames/common/flash/display/Sprite.js";
import { Event } from "@edugames/common/flash/events/Event.js";
import { MouseEvent } from "@edugames/common/flash/events/MouseEvent.js";
import { Point } from "@edugames/common/flash/geom/Point.js";
import { Rectangle } from "@edugames/common/flash/geom/Rectangle.js";
import { Facade } from "@edugames/common/org/puremvc/as3/patterns/facade/Facade.js";
import { Drawer } from "../Drawer.js";
import { GardenItem } from "../GardenItem.js";
import { GardenMediator } from "../GardenMediator.js";
import { GardenSpot } from "../GardenSpot.js";
import { NetCom } from "../NetCom.js";
import { AchievementInfoPanel } from "./AchievementInfoPanel.js";

/**
 * ...
 * @author Michal Perzak
 */
export class GardenScreen extends Sprite {
	// PORT: instance embeds hoisted to static (they register at module load)
	private static bgCl: Class = embed("../../achievements/Assets/gardenBg.jpg");
	private static crownCl: Class = embed("../../achievements/Assets/shovel.png");
	private static backCl: Class = embed("../../achievements/Assets/backArrow.png");
	
	private static upCl: Class = embed("../../achievements/Assets/upArrow.png");
	private static downCl: Class = embed("../../achievements/Assets/downArrow.png");
	
	public bg: Sprite;
	public backBtn: Sprite;
	
	public showBtn: Sprite;
	public sidePanel: Drawer;
	public infoPanel: AchievementInfoPanel;
	public spots: GardenSpot[];
	public items: GardenItem[];
	
	private currentlyDragged: MovieClip;
	private scrollUp: Sprite;
	private scrollDown: Sprite;
	private scrollDir: number = 0; // PORT: int default
	
	constructor() {
		super();
		this.addEventListener(Event.ADDED_TO_STAGE, this.onAdded);
	}
	
	private onAdded(e: Event): void {
		var bgBmp: Bitmap = new GardenScreen.bgCl();
		bgBmp.smoothing = true;
		this.bg = new Sprite();
		this.bg.addChild(bgBmp);
		this.addChild(this.bg);
		
		this.spots = [];
		for (var i: number = 0; i < GardenSpot.POSITIONS.length; ++i) {
			var tmpSpot: GardenSpot = new GardenSpot(40, i);
			this.addChild(tmpSpot);
			this.spots.push(tmpSpot);
		}
		
		this.bg.width = this.stage.stageWidth;
		this.bg.height = this.stage.stageHeight;
		
		var backBmp: Bitmap = new GardenScreen.backCl();
		backBmp.smoothing = true;
		this.backBtn = new Sprite();
		this.backBtn.addChild(backBmp);
		this.backBtn.x = 0;
		this.backBtn.y = 535;
		this.backBtn.scaleX = this.backBtn.scaleY = 0.28;
		this.backBtn.buttonMode = true;
		
		this.scrollDown = new Sprite();
		this.scrollUp = new Sprite();
		var bmp: Bitmap = new GardenScreen.downCl();
		bmp.smoothing = true;
		this.scrollDown.addChild(bmp);
		bmp = new GardenScreen.upCl();
		bmp.smoothing = true;
		this.scrollUp.addChild(bmp);
		this.scrollDown.scaleX = this.scrollDown.scaleY = this.scrollUp.scaleX = this.scrollUp.scaleY = 0.4;
		
		this.addChild(this.scrollDown);
		this.addChild(this.scrollUp);
		this.scrollDown.y = this.stage.stageHeight - 30 - this.scrollDown.height;
		this.scrollDown.x = this.stage.stageWidth - 170;
		this.scrollUp.y = 30;
		this.scrollUp.x = this.stage.stageWidth - 170;
		
		this.scrollDown.addEventListener(MouseEvent.MOUSE_OVER, this.onScrollDownOver);
		this.scrollDown.addEventListener(MouseEvent.MOUSE_OUT, this.onScrollOut);
		this.scrollUp.addEventListener(MouseEvent.MOUSE_OVER, this.onScrollUpOver);
		this.scrollUp.addEventListener(MouseEvent.MOUSE_OUT, this.onScrollOut);
		
		// hide scrolls
		this.scrollUp.alpha = 0;
		this.scrollUp.visible = false;
		this.scrollDown.alpha = 0;
		this.scrollDown.visible = false;
		
		this.addChild(this.backBtn);
		
		this.infoPanel = new AchievementInfoPanel();
		this.infoPanel.alpha = 0;

		this.backBtn.addEventListener(MouseEvent.CLICK, this.onBack);
		this.bg.addEventListener(MouseEvent.CLICK, this.onHidePanel);
	}
	
	public EnableDrawer(): void {
		this.items = [];
		this.items.push(new GardenItem(false, 1));
		this.items.push(new GardenItem(false, 2));
		this.items.push(new GardenItem(false, 3));
		this.items.push(new GardenItem(false, 4));
		this.items.push(new GardenItem(false, 5));
		this.items.push(new GardenItem(false, 6));
		this.items.push(new GardenItem(false, 7));
		this.items.push(new GardenItem(false, 8));
		this.items.push(new GardenItem(false, 9));
		this.items.push(new GardenItem(false, 10));
		this.items.push(new GardenItem(false, 11));
		this.items.push(new GardenItem(false, 12));
		this.items.push(new GardenItem(false, 13));
		this.items.push(new GardenItem(false, 14));
		this.items.push(new GardenItem(false, 15));
		this.items.push(new GardenItem(false, 16));
		this.items.push(new GardenItem(false, 17));
		this.items.push(new GardenItem(false, 18));
		this.items.push(new GardenItem(false, 19));
		this.items.push(new GardenItem(false, 20));
		this.items.push(new GardenItem(false, 21));
		this.sidePanel = new Drawer(this.items);
		this.sidePanel.x = this.stage.stageWidth+1;
		this.addChild(this.sidePanel);
		this.sidePanel.addEventListener(MouseEvent.MOUSE_DOWN, this.onSidePanelDown);
		this.addEventListener(Event.ENTER_FRAME, this.onScrollUpdate); // for scrolling with buttons.

		this.showBtn = new Sprite();
		var btnBmp: Bitmap = new GardenScreen.crownCl();
		btnBmp.smoothing = true;
		
		this.addChild(this.showBtn);
		this.showBtn.addChild(btnBmp);
		this.showBtn.scaleX = this.showBtn.scaleY = 0.30;
		this.showBtn.x = this.stage.stageWidth - this.showBtn.width - 2;
		this.showBtn.y = this.stage.stageHeight - this.showBtn.height - 2;
		this.showBtn.addEventListener(MouseEvent.CLICK, this.onClick);
		this.showBtn.buttonMode = true;
		
		this.showBtn.alpha = 0;
		TweenLite.to(this.showBtn, 0.5, { alpha:1 } );
	}
	
	public DisplayInfoPanel(item: GardenItem): void {
		var pt: Point = item.localToGlobal(new Point());
		if (!this.infoPanel.parent) {
			this.addChild(this.infoPanel);
		}
		pt.x -= item.width * 0.75;
		this.infoPanel.ShowInfo(item.achievement, pt);
	}
	
	public HideInfoPanel(): void {
		this.infoPanel.Hide(() => {
				if (this.infoPanel.parent) {
					this.infoPanel.parent.removeChild(this.infoPanel);
				}
			});
	}
	
	public StartDraggingItem(item: MovieClip): void {
		this.addChild(item);
		item.startDrag();
		this.stage.addEventListener(MouseEvent.MOUSE_UP, this.onStopItemDrag);
		this.currentlyDragged = item;
		this.onHidePanel(null); // just hide this panel
	}
	
	public onStopItemDrag(e: MouseEvent): void {
		var placed: boolean = false;
		var mousePos: Point = new Point(e.stageX, e.stageY);
		
		for (const spot of this.spots) {
			placed = spot.TryToCatch(this.currentlyDragged, mousePos);
			if (placed) {
				NetCom.instance.GardenPutObject(spot.spotId, (Number(this.currentlyDragged.name) | 0));
				break;
			}
		}
		if (!placed) {
			this.removeChild(this.currentlyDragged);
		}
		this.currentlyDragged.stopDrag();
		this.currentlyDragged = null;
		this.stage.removeEventListener(MouseEvent.MOUSE_UP, this.onStopItemDrag);
	}
	
	private onBack(e: Event): void {
		Facade.getInstance().removeMediator(GardenMediator.NAME);
	}
	
	private onClick(e: Event): void {
		TweenLite.to(this.sidePanel, 0.9, {x: ((this.stage.stageWidth - (this.sidePanel.width)) | 0)});
		TweenLite.to(this.showBtn, 0.3, { autoAlpha: 0 } );
		TweenLite.to(this.scrollUp, 0.3, { autoAlpha:1, delay:1 } );
		TweenLite.to(this.scrollDown, 0.3, { autoAlpha:1, delay:1 } );
		
		this.stage.addEventListener(MouseEvent.MOUSE_WHEEL, this.onScroll);
	}
	
	private onHidePanel(e: Event): void {
		TweenLite.to(this.sidePanel, 0.9, {x: this.stage.stageWidth+1});
		TweenLite.to(this.showBtn, 0.5, {autoAlpha: 1, delay: 0.7});
		TweenLite.to(this.scrollUp, 0.3, { autoAlpha:0 } );
		TweenLite.to(this.scrollDown, 0.3, { autoAlpha:0 } );
		
		this.stage.removeEventListener(MouseEvent.MOUSE_WHEEL, this.onScroll);
	}
	
	private onSidePanelDown(e: MouseEvent): void {
		this.stage.addEventListener(MouseEvent.MOUSE_UP, this.onSidePanelUp);
		// check if gardenItem was not clicked
		var list: any[] = this.stage.getObjectsUnderPoint(new Point(e.stageX, e.stageY));
		if (!this.currentlyDragged && list.every(function(ob: DisplayObject, idx: number, arr: any[]): boolean {
				return !(ob.parent instanceof GardenItem);
			})) {
			this.sidePanel.startDrag(false, new Rectangle((this.sidePanel.x | 0), 0, 0, -(this.sidePanel.height - this.stage.stageHeight + 5)));
		}
	}
	
	private onScroll(e: MouseEvent): void {
		var newy: number = this.sidePanel.y + e.delta * 10;
		if (newy > 0) {
			newy = 0;
		}
		if (newy < -(this.sidePanel.height - this.stage.stageHeight + 2)) {
			newy = -(this.sidePanel.height - this.stage.stageHeight + 2);
		}
		TweenLite.to(this.sidePanel, 0.2, { y: newy } );
	}
	
	private onScrollUpOver(e: MouseEvent): void {
		this.scrollDir = 1;
	}
	
	private onScrollDownOver(e: MouseEvent): void {
		this.scrollDir = -1;
	}
	
	private onScrollOut(e: MouseEvent): void {
		this.scrollDir = 0;
	}
	
	private onScrollUpdate(e: Event): void {
		if (!this.sidePanel || !this.stage) return;
		this.sidePanel.y += this.scrollDir * 10;
		this.sidePanel.y = Math.min(Math.max(this.sidePanel.y, -(this.sidePanel.height - this.stage.stageHeight + 2)), 0);
	}
	
	private onSidePanelUp(e: Event): void {
		this.stage.removeEventListener(MouseEvent.MOUSE_UP, this.onSidePanelUp);
		this.sidePanel.stopDrag();
	}
}
