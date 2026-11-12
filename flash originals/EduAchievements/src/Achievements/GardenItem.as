package Achievements {
	import flash.display.DisplayObject;
	import flash.display.MovieClip;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.geom.ColorTransform;
	import org.puremvc.as3.patterns.facade.Facade;
	
	/**
	 * ...
	 * @author Michal Perzak
	 */
	public class GardenItem extends Sprite {
		public var isBought:Boolean;
		public var itemId:int;
		public var content:MovieClip;
		public var isPlaced:Boolean;
		public var clickLayer:Sprite;
		public var achievement:Achievement;
		
		public var contentImage:MovieClip;
		
		public function GardenItem(isPlaced:Boolean, itemId:int) {
			var achProxy:AchievementProxy = Facade.getInstance().retrieveProxy(AchievementProxy.NAME) as AchievementProxy;
			this.achievement = achProxy.GetAchievement(itemId);

			var contentClass:Class = achievement.contentClass;
			this.content = new contentClass() as MovieClip;
			this.itemId = itemId;
			this.isBought = achievement.unlocked;
			this.isPlaced = isPlaced;
			this.contentImage = new contentClass() as MovieClip;
			this.contentImage.name = itemId.toString();
			
			if (!isPlaced) {
				if (content.width > content.height) {
					content.width = 90;
					content.height *= content.scaleX;
				} else {
					content.height = 90;
					content.width *= content.scaleY;
				}
				content.stop();
			}
			addChild(content);
			
			content.x = -content.width / 2;
			content.y = -content.height / 2;
				
			addEventListener(Event.ADDED_TO_STAGE, onAdded);
		}
		
		public function onAdded(e:Event):void {
			clickLayer = new Sprite();
			clickLayer.graphics.beginFill(0, 0.001);
			clickLayer.graphics.drawRect(content.x, content.y, content.width, content.height);
			addChild(clickLayer);
			
			if (!isBought) {
				content.transform.colorTransform = new ColorTransform(0.6, 0.6, 0.6, 0.7);
			} else {
				addEventListener(MouseEvent.MOUSE_DOWN, onDown);
			}
			
			addEventListener(MouseEvent.MOUSE_OVER, onOver);
			addEventListener(MouseEvent.MOUSE_OUT, onOut);
		}
		
		public function onOver(e:MouseEvent):void {
			Facade.getInstance().sendNotification(Events.ACHIEVEMENT_DESC_SHOW, this);
		}
		
		public function onOut(e:MouseEvent):void {
			Facade.getInstance().sendNotification(Events.ACHIEVEMENT_DESC_HIDE);
		}
		
		public function onDown(e:MouseEvent):void {
			contentImage.stop();
			Facade.getInstance().sendNotification(Events.GARDEN_START_DRAG, contentImage);
			contentImage.x = e.stageX - contentImage.width / 2;
			contentImage.y = e.stageY - contentImage.height ;
		}
	}

}