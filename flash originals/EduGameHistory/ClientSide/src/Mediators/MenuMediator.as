package Mediators {
	import flash.display.Stage;
	import org.puremvc.as3.interfaces.IMediator;
	import org.puremvc.as3.interfaces.INotification;
	import org.puremvc.as3.patterns.mediator.Mediator;
	import Proxies.QuestionProxy;
	import Proxies.QuizConfigProxy;
	import Visuals.MenuView;
	import Visuals.SplashView;
	
	/**
	 * ...
	 * @author Perz
	 */
	public class MenuMediator extends Mediator implements IMediator {
		public static const NAME:String = "MenuMediator";
		
		public var view:MenuView;
		public var quizConf:QuizConfigProxy;
		
		public function MenuMediator(stageItem:Object) {
			super(NAME, stageItem);
		}
		
		override public function onRegister():void {
			super.onRegister();
			quizConf = facade.retrieveProxy(QuizConfigProxy.NAME) as QuizConfigProxy;
			
			view = new MenuView();
			stage.addChild(view);
		}
		
		override public function onRemove():void {
			super.onRemove();
			
			stage.removeChild(view);
		}
		
		override public function listNotificationInterests():Array {
			return [
				Events.MENU_DIF, Events.MENU_EPOCH, Events.MENU_MODE
			];
		}
		
		override public function handleNotification(notif:INotification):void {
			var body:Object = notif.getBody();
			
			switch (notif.getName()) {
				case Events.MENU_EPOCH:
					quizConf.epoch = int(body);
					break;
				case Events.MENU_DIF:
					quizConf.difficulty = int(body);
					break;
				case Events.MENU_MODE:
					quizConf.gameMode = int(body);
					break;
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