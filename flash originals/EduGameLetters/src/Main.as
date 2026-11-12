package 
{
	import Achievements.Components.Popup;
	import Achievements.NetCom;
	import com.greensock.plugins.AutoAlphaPlugin;
	import com.greensock.plugins.TweenPlugin;
	import Commands.AppCommand;
	import flash.display.Sprite;
	import flash.events.Event;
	import Proxies.Data.RacerData;
	import Proxies.Data.VehicleData;
	import Proxies.Words;
	import Visuals.AnimatedRacer;

	/**
	 * ...
	 * @author Perzka Michalowy
	 */
	[Frame(factoryClass="Preloader")]
	public class Main extends Sprite 
	{

		public function Main():void 
		{
			addEventListener(Event.ADDED_TO_STAGE, init);
		}

		private function init(e:Event = null):void 
		{
			removeEventListener(Event.ADDED_TO_STAGE, init);

			addChild(new NetCom());
			TweenPlugin.activate([AutoAlphaPlugin]);
			Popup.Initialize(stage);
			
			AppFacade.GetInstance().Startup(stage);
		}

	}

}