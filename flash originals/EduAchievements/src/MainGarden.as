package {
	import Achievements.AchievementTypes;
	import Achievements.Components.Popup;
	import Achievements.*;
	import com.greensock.plugins.AutoAlphaPlugin;
	import com.greensock.plugins.TweenPlugin;
	import com.greensock.TweenLite;
	import flash.display.MovieClip;
	import flash.display.Sprite;
	import flash.display.StageScaleMode;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import org.puremvc.as3.patterns.facade.Facade;
	
	/**
	 * ...
	 * @author Michal Perzak
	 */
	public class MainGarden extends MovieClip {

		public var achProxy:AchievementProxy;
		
		public function MainGarden():void {
			if (stage) init();
			else addEventListener(Event.ADDED_TO_STAGE, init);
		}
		
		private function init(e:Event = null):void {
			TweenPlugin.activate([AutoAlphaPlugin]);
			addChild(new NetCom());
			
			removeEventListener(Event.ADDED_TO_STAGE, init);
			// entry point
			achProxy = new AchievementProxy();			
			Facade.getInstance().registerProxy(achProxy); // TODO this needs to be added when game starts.
			Facade.getInstance().registerMediator(new GardenMediator(stage));
			Popup.Initialize(stage);
			
			var gardbtn:Sprite = new Sprite();
			gardbtn.graphics.beginFill(0x55ff34);
			gardbtn.graphics.drawRect(0,0, 40, 50);
			gardbtn.x = 50;
			gardbtn.y = 150;
			addChild(gardbtn);
			gardbtn.addEventListener(MouseEvent.CLICK, function():void { Facade.getInstance().registerMediator(new GardenMediator(stage)); } );
			
			var btn:Sprite = new Sprite();
			btn.graphics.beginFill(0);
			btn.graphics.drawRect(0,0, 40, 50);
			btn.x = 50;
			btn.y = 100;
			addChild(btn);
			
			btn.addEventListener(MouseEvent.CLICK, function ():void { achProxy.AddAchievement(1); } );
			stage.scaleMode = StageScaleMode.EXACT_FIT;
		}
	}
	
}