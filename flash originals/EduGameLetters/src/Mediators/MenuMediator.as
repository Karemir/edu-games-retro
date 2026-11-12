package Mediators 
{
	import flash.display.Stage;
	import org.puremvc.as3.interfaces.IMediator;
	import org.puremvc.as3.interfaces.INotification;
	import org.puremvc.as3.patterns.mediator.Mediator;
	import Proxies.GameData;
	import Visuals.MainMenuScreen;
	
	/**
	 * ...
	 * @author Perzka Michalowy
	 */
	public class MenuMediator extends Mediator implements IMediator 
	{
		public static const NAME:String = "MenuMediator";
		
		public var menuVisual:MainMenuScreen;
		public var gameData:GameData;
		
		public function MenuMediator(stageItem:Object) 
		{
			super(NAME, stageItem);
			
			menuVisual = new MainMenuScreen();
		}
		
		override public function onRegister():void 
		{
			stage.addChild(menuVisual);
			gameData = facade.retrieveProxy(GameData.NAME) as GameData;
			
			stage.focus = menuVisual;
		}
		
		override public function onRemove():void 
		{
			stage.removeChild(menuVisual);
		}
		
		override public function listNotificationInterests():Array 
		{
			return [
				Events.MAIN_MENU_GAME_READY,
				Events.MAIN_MENU_PANEL_BACK,
				Events.KEY_PRESS,
				Events.MENU_TOURNAMENT_SELECTED
			];
		}
		
		override public function handleNotification(notification:INotification):void 
		{
			var name:String = notification.getName();
			var body:Object = notification.getBody();
			
			switch(name) {
				case Events.MAIN_MENU_PANEL_BACK:
					menuVisual.HideNewGamePanel();
					break;
				case Events.MAIN_MENU_GAME_READY:
					gameData.StartNewGame(menuVisual.newGamePanel.playerName, menuVisual.newGamePanel.currentVehicleId);
					break;
				case Events.KEY_PRESS:
					menuVisual.HandleKeypress(body as uint);
					break;
				case Events.MENU_TOURNAMENT_SELECTED:
					gameData.currentTournament = int(body);
					sendNotification(Events.GAME_CYCLE_SCREENS, this);
					break;
			}
		}

		public function get stage():Stage {
			return viewComponent as Stage;
		}
	}
}