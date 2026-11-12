package Mediators {
	import flash.display.Stage;
	import Menu.MenuView;
	import org.puremvc.as3.interfaces.IMediator;
	import org.puremvc.as3.interfaces.INotification;
	import org.puremvc.as3.patterns.mediator.Mediator;
	
	/**
	 * ...
	 * @author Perz
	 */
	public class MenuMediator extends Mediator implements IMediator {
		public static const NAME:String = "MenuMediator";
		
		public var menuView:MenuView;
		
		public function MenuMediator(stageItem:Object) {
			super(NAME, stageItem);
		}
		
		override public function onRegister():void {
			super.onRegister();
			
			menuView = new MenuView();
			stage.addChild(menuView);
		}
		
		override public function onRemove():void {
			super.onRemove();
			
			stage.removeChild(menuView);
		}
		
		override public function listNotificationInterests():Array {
			return [];
		}
		
		override public function handleNotification(notif:INotification):void {
			switch (notif.getName()) {
				default: 
					Logger.Log("Unknown notification");
					return;
			}
		}
		
		public function get stage():Stage {
			return viewComponent as Stage;
		}
	}
}