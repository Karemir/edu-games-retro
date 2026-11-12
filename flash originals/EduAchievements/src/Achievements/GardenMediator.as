package Achievements {
	import Achievements.Components.GardenScreen;
	import flash.display.MovieClip;
	import flash.display.Stage;
	import flash.geom.Point;
	import org.puremvc.as3.interfaces.IMediator;
	import org.puremvc.as3.interfaces.INotification;
	import org.puremvc.as3.patterns.mediator.Mediator;
	
	/**
	 * ...
	 * @author Michal Perzak
	 */
	public class GardenMediator extends Mediator implements IMediator {
		public static const NAME:String = "GardenMediator";
		
		public var garden:GardenScreen;
		public var achProxy:AchievementProxy;
		
		public function GardenMediator(stageItem:Object) {
			super(NAME, stageItem);
		}
		
		override public function onRegister():void {
			trace("Garden mediator registered");
			
			achProxy = facade.retrieveProxy(AchievementProxy.NAME) as AchievementProxy;
			garden = new GardenScreen();
			stage.addChild(garden);
			
			if (achProxy.isLoaded) {
				InitGarden();
			}
		}
		
		public function onNetSetup(setupList:Vector.<Point>):void {
			for each(var pt:Point in setupList) {
				try{
					var item:GardenItem = garden.items[pt.y-1];
					garden.spots[pt.x].PlaceItem(item.contentImage);
				} catch(e:Error) {}
			}
		}
		
		override public function onRemove():void {
			trace("Garden mediator removed");
			stage.removeChild(garden);
		}
		
		override public function listNotificationInterests():Array {
			return [Events.GARDEN_EXIT, 
			Events.GARDEN_ITEM_BUY, 
			Events.GARDEN_START_DRAG,
			Events.ACHIEVEMENTS_LOADED,
			Events.ACHIEVEMENT_DESC_HIDE,
			Events.ACHIEVEMENT_DESC_SHOW];
		}
		
		public function InitGarden():void {
			garden.EnableDrawer();
			NetCom.instance.GardenGetSetup(onNetSetup);
		}
		
		override public function handleNotification(notification:INotification):void {
			var noteName:String = notification.getName();
			var body:Object = notification.getBody();
			
			switch (noteName) {
				case Events.GARDEN_EXIT:
					facade.removeMediator(NAME);
					break;
				case Events.ACHIEVEMENTS_LOADED:
					InitGarden();
					break;
				case Events.GARDEN_START_DRAG:
					garden.StartDraggingItem(body as MovieClip);
					break;
				case Events.ACHIEVEMENT_DESC_HIDE:
					garden.HideInfoPanel();
					break;
				case Events.ACHIEVEMENT_DESC_SHOW:
					garden.DisplayInfoPanel(body as GardenItem);
					break;
			}
		}
	
		public function get stage():Stage {
			return viewComponent as Stage;
		}
	}

}