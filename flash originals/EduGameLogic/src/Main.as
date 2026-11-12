package {
	import Achievements.Components.Popup;
	import Achievements.NetCom;
	import com.greensock.plugins.AutoAlphaPlugin;
	import com.greensock.plugins.TweenPlugin;
	import flash.display.Sprite;
	import flash.events.Event;

	/**
	 * ...
	 * @author Perz
	 */
	[Frame(factoryClass="Preloader")]
	public class Main extends Sprite {

		public function Main():void {
			addEventListener(Event.ADDED_TO_STAGE, OnStage);
		}
		
		private function OnStage(e:Event):void {
			TweenPlugin.activate([AutoAlphaPlugin]);
			addChild(new NetCom());
			Popup.Initialize(stage);
			AppFacade.GetInstance().Startup(stage);
		}
	}
}