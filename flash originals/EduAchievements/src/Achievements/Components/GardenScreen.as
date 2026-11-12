package Achievements.Components {
	import Achievements.Achievement;
	import Achievements.AchievementProxy;
	import Achievements.Drawer;
	import Achievements.Events;
	import Achievements.GardenItem;
	import Achievements.GardenMediator;
	import Achievements.GardenSpot;
	import Achievements.NetCom;
	import adobe.utils.CustomActions;
	import com.greensock.TweenLite;
	import flash.desktop.ClipboardFormats;
	import flash.display.Bitmap;
	import flash.display.DisplayObject;
	import flash.display.MovieClip;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.geom.Point;
	import flash.geom.Rectangle;
	import org.puremvc.as3.patterns.facade.Facade;
	
	/**
	 * ...
	 * @author Michal Perzak
	 */
	public class GardenScreen extends Sprite {
		[Embed(source="../../../Assets/gardenBg.jpg")]
		private var bgCl:Class;
		[Embed(source="../../../Assets/shovel.png")]
		private var crownCl:Class;
		[Embed(source="../../../Assets/backArrow.png")]
		private var backCl:Class;
		
		[Embed(source = "../../../Assets/upArrow.png")]private static var upCl:Class;
		[Embed(source = "../../../Assets/downArrow.png")]private static var downCl:Class;
		
		public var bg:Sprite;
		public var backBtn:Sprite;
		
		public var showBtn:Sprite;
		public var sidePanel:Drawer;
		public var infoPanel:AchievementInfoPanel;
		public var spots:Vector.<GardenSpot>;
		public var items:Vector.<GardenItem>;
		
		private var currentlyDragged:MovieClip;
		private var scrollUp:Sprite;
		private var scrollDown:Sprite;
		private var scrollDir:int;
		
		public function GardenScreen() {
			addEventListener(Event.ADDED_TO_STAGE, onAdded);
		}
		
		private function onAdded(e:Event):void {
			var bgBmp:Bitmap = new bgCl();
			bgBmp.smoothing = true;
			bg = new Sprite();
			bg.addChild(bgBmp);
			addChild(bg);
			
			spots = new Vector.<GardenSpot>();
			for (var i:int = 0; i < GardenSpot.POSITIONS.length; ++i) {
				var tmpSpot:GardenSpot = new GardenSpot(40, i);
				addChild(tmpSpot);
				spots.push(tmpSpot);
			}
			
			bg.width = stage.stageWidth;
			bg.height = stage.stageHeight;
			
			var backBmp:Bitmap = new backCl();
			backBmp.smoothing = true;
			backBtn = new Sprite();
			backBtn.addChild(backBmp);
			backBtn.x = 0;
			backBtn.y = 535;
			backBtn.scaleX = backBtn.scaleY = 0.28;
			backBtn.buttonMode = true;
			
			scrollDown = new Sprite();
			scrollUp = new Sprite();
			var bmp:Bitmap = new downCl();
			bmp.smoothing = true;
			scrollDown.addChild(bmp);
			bmp = new upCl();
			bmp.smoothing = true;
			scrollUp.addChild(bmp);
			scrollDown.scaleX = scrollDown.scaleY = scrollUp.scaleX = scrollUp.scaleY = 0.4;
			
			addChild(scrollDown);
			addChild(scrollUp);
			scrollDown.y = stage.stageHeight - 30 - scrollDown.height;
			scrollDown.x = stage.stageWidth - 170;
			scrollUp.y = 30;
			scrollUp.x = stage.stageWidth - 170;
			
			scrollDown.addEventListener(MouseEvent.MOUSE_OVER, onScrollDownOver);
			scrollDown.addEventListener(MouseEvent.MOUSE_OUT, onScrollOut);
			scrollUp.addEventListener(MouseEvent.MOUSE_OVER, onScrollUpOver);
			scrollUp.addEventListener(MouseEvent.MOUSE_OUT, onScrollOut);
			
			// hide scrolls
			scrollUp.alpha = 0;
			scrollUp.visible = false;
			scrollDown.alpha = 0;
			scrollDown.visible = false;
			
			addChild(backBtn);
			
			infoPanel = new AchievementInfoPanel();
			infoPanel.alpha = 0;

			backBtn.addEventListener(MouseEvent.CLICK, onBack);
			bg.addEventListener(MouseEvent.CLICK, onHidePanel);
		}
		
		public function EnableDrawer():void {
			items = new Vector.<GardenItem>();
			items.push(new GardenItem(false, 1));
			items.push(new GardenItem(false, 2));
			items.push(new GardenItem(false, 3));
			items.push(new GardenItem(false, 4));
			items.push(new GardenItem(false, 5));
			items.push(new GardenItem(false, 6));
			items.push(new GardenItem(false, 7));
			items.push(new GardenItem(false, 8));
			items.push(new GardenItem(false, 9));
			items.push(new GardenItem(false, 10));
			items.push(new GardenItem(false, 11));
			items.push(new GardenItem(false, 12));
			items.push(new GardenItem(false, 13));
			items.push(new GardenItem(false, 14));
			items.push(new GardenItem(false, 15));
			items.push(new GardenItem(false, 16));
			items.push(new GardenItem(false, 17));
			items.push(new GardenItem(false, 18));
			items.push(new GardenItem(false, 19));
			items.push(new GardenItem(false, 20));
			items.push(new GardenItem(false, 21));
			sidePanel = new Drawer(items);
			sidePanel.x = stage.stageWidth+1;
			addChild(sidePanel);
			sidePanel.addEventListener(MouseEvent.MOUSE_DOWN, onSidePanelDown);
			addEventListener(Event.ENTER_FRAME, onScrollUpdate); // for scrolling with buttons.

			showBtn = new Sprite();
			var btnBmp:Bitmap = new crownCl();
			btnBmp.smoothing = true;
			
			addChild(showBtn);
			showBtn.addChild(btnBmp);
			showBtn.scaleX = showBtn.scaleY = 0.30;
			showBtn.x = stage.stageWidth - showBtn.width - 2;
			showBtn.y = stage.stageHeight - showBtn.height - 2;
			showBtn.addEventListener(MouseEvent.CLICK, onClick);
			showBtn.buttonMode = true;
			
			showBtn.alpha = 0;
			TweenLite.to(showBtn, 0.5, { alpha:1 } );
		}
		
		public function DisplayInfoPanel(item:GardenItem):void {
			var pt:Point = item.localToGlobal(new Point());
			if (!infoPanel.parent) {
				addChild(infoPanel);
			}
			pt.x -= item.width * 0.75;
			infoPanel.ShowInfo(item.achievement, pt);
		}
		
		public function HideInfoPanel():void {
			infoPanel.Hide(function():void {
					if (infoPanel.parent) {
						infoPanel.parent.removeChild(infoPanel);
					}
				});
		}
		
		public function StartDraggingItem(item:MovieClip):void {
			addChild(item);
			item.startDrag();
			stage.addEventListener(MouseEvent.MOUSE_UP, onStopItemDrag);
			currentlyDragged = item;
			onHidePanel(null); // just hide this panel
		}
		
		public function onStopItemDrag(e:MouseEvent):void {
			var placed:Boolean = false;
			var mousePos:Point = new Point(e.stageX, e.stageY);
			
			for each (var spot:GardenSpot in spots) {
				placed = spot.TryToCatch(currentlyDragged, mousePos);
				if (placed) {
					NetCom.instance.GardenPutObject(spot.spotId, int(currentlyDragged.name));
					break;
				}
			}
			if (!placed) {
				removeChild(currentlyDragged);
			}
			currentlyDragged.stopDrag();
			currentlyDragged = null;
			stage.removeEventListener(MouseEvent.MOUSE_UP, onStopItemDrag);
		}
		
		private function onBack(e:Event):void {
			Facade.getInstance().removeMediator(GardenMediator.NAME);
		}
		
		private function onClick(e:Event):void {
			TweenLite.to(sidePanel, 0.9, {x: int(stage.stageWidth - (sidePanel.width))});
			TweenLite.to(showBtn, 0.3, { autoAlpha: 0 } );
			TweenLite.to(scrollUp, 0.3, { autoAlpha:1, delay:1 } );
			TweenLite.to(scrollDown, 0.3, { autoAlpha:1, delay:1 } );
			
			stage.addEventListener(MouseEvent.MOUSE_WHEEL, onScroll);
		}
		
		private function onHidePanel(e:Event):void {
			TweenLite.to(sidePanel, 0.9, {x: stage.stageWidth+1});
			TweenLite.to(showBtn, 0.5, {autoAlpha: 1, delay: 0.7});
			TweenLite.to(scrollUp, 0.3, { autoAlpha:0 } );
			TweenLite.to(scrollDown, 0.3, { autoAlpha:0 } );
			
			stage.removeEventListener(MouseEvent.MOUSE_WHEEL, onScroll);
		}
		
		private function onSidePanelDown(e:MouseEvent):void {
			stage.addEventListener(MouseEvent.MOUSE_UP, onSidePanelUp);
			// check if gardenItem was not clicked
			var list:Array = stage.getObjectsUnderPoint(new Point(e.stageX, e.stageY));
			if (!currentlyDragged && list.every(function(ob:DisplayObject, idx:int, arr:Array):Boolean {
					return !(ob.parent is GardenItem);
				})) {
				sidePanel.startDrag(false, new Rectangle(int(sidePanel.x), 0, 0, -(sidePanel.height - stage.stageHeight + 5)));
			}
		}
		
		private function onScroll(e:MouseEvent):void {
			var newy:Number = sidePanel.y + e.delta * 10;
			if (newy > 0) {
				newy = 0;
			}
			if (newy < -(sidePanel.height - stage.stageHeight + 2)) {
				newy = -(sidePanel.height - stage.stageHeight + 2);
			}
			TweenLite.to(sidePanel, 0.2, { y: newy } );
		}
		
		private function onScrollUpOver(e:MouseEvent):void {
			scrollDir = 1;
		}
		
		private function onScrollDownOver(e:MouseEvent):void {
			scrollDir = -1;
		}
		
		private function onScrollOut(e:MouseEvent):void {
			scrollDir = 0;
		}
		
		private function onScrollUpdate(e:Event):void {
			if (!sidePanel || !stage) return;
			sidePanel.y += scrollDir * 10;
			sidePanel.y = Math.min(Math.max(sidePanel.y, -(sidePanel.height - stage.stageHeight + 2)), 0);
		}
		
		private function onSidePanelUp(e:Event):void {
			stage.removeEventListener(MouseEvent.MOUSE_UP, onSidePanelUp);
			sidePanel.stopDrag();
		}
	}

}