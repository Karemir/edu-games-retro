package Mediators {
	import flash.display.Stage;
	import org.puremvc.as3.interfaces.IMediator;
	import org.puremvc.as3.interfaces.INotification;
	import org.puremvc.as3.patterns.mediator.Mediator;
	import Visuals.SplashView;
	
	/**
	 * ...
	 * @author Perz
	 */
	public class SplashMediator extends Mediator implements IMediator {
		public static const NAME:String = "SplashMediator";
		
		public var view:SplashView;
		
		public function SplashMediator(stageItem:Object) {
			super(NAME, stageItem);
		}
		
		override public function onRegister():void {
			super.onRegister();
			
			view = new SplashView();
			stage.addChild(view);
		}
		
		override public function onRemove():void {
			super.onRemove();
			
			stage.removeChild(view);
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