package Mediators 
{
	import flash.display.Stage;
	import flash.ui.Keyboard;
	import org.puremvc.as3.interfaces.IMediator;
	import org.puremvc.as3.interfaces.INotification;
	import org.puremvc.as3.patterns.mediator.Mediator;
	import Proxies.Data.RacerData;
	import Proxies.GameData;
	import Visuals.VehicleSelectScreen;
	
	/**
	 * ...
	 * @author Perzka Michalowy
	 */
	public class VehicleSelectLogic extends Mediator implements IMediator 
	{
		public static const NAME:String = "VehicleSelectLogic";
		
		public var selectScreen:VehicleSelectScreen;
		public var gameData:GameData;
		
		public function VehicleSelectLogic(stageItem:Object) 
		{
			super(NAME, stageItem);			
		}
		
		override public function onRegister():void 
		{
			selectScreen = new VehicleSelectScreen(stage.stageWidth, stage.stageHeight);
			stage.addChild(selectScreen);
			gameData = facade.retrieveProxy(GameData.NAME) as GameData;
			
			stage.focus = selectScreen;
		}
		
		override public function onRemove():void 
		{
			stage.removeChild(selectScreen);
		}
		
		override public function listNotificationInterests():Array 
		{
			return [
				Events.MENU_VEHICLE_SELECTED,
				Events.KEY_PRESS
				];
		}
		
		override public function handleNotification(notification:INotification):void 
		{
			var name:String = notification.getName();
			var body:Object = notification.getBody();
			
			switch(name) {
				case Events.KEY_PRESS:
					var key:uint = body as uint;
					if (key == Keyboard.LEFT) {
						Logger.Log("prev vehicle key");
						selectScreen.PrevVehicle(null);
					} else if (key == Keyboard.RIGHT) {
						Logger.Log("next vehicle key");
						selectScreen.NextVehicle(null);
					} else if (key == Keyboard.ENTER) {
						Logger.Log("Accept vehicle");
						selectScreen.OnAccept(null);
					}
					break;
				case Events.MENU_VEHICLE_SELECTED:
					var racer:RacerData = gameData.GetPlayerRacer();
					racer.vehicleImageId = body as uint;
					facade.sendNotification(Events.GAME_CYCLE_SCREENS, this);
					break;
			}
		}
		
		public function get stage():Stage {
			return viewComponent as Stage;
		}		
	}

}