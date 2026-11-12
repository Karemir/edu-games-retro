package Mediators {
	import Data.MathQuestion;
	import flash.display.Bitmap;
	import flash.display.Sprite;
	import flash.events.MouseEvent;
	import org.puremvc.as3.interfaces.IMediator;
	import org.puremvc.as3.interfaces.INotification;
	import org.puremvc.as3.patterns.mediator.Mediator;
	import Proxies.GameProxy;
	import Proxies.Sounds;
	import VisualParts.CraneOperator;
	import VisualParts.TowerBox;
	
	/**
	 * ...
	 * @author Perzka Michalowy
	 */
	public class TowerSubMediator extends Mediator implements IMediator {
		public static const NAME:String = "TowerSubMediator";
		
		[Embed(source = "../../Assets/menuBackBtn.png")] private var backBtnCl:Class;
		
		public var menuBackBtn:Sprite;
		public var towerBox:TowerBox;
		public var gameProxy:GameProxy;
		
		public function TowerSubMediator(panel:Sprite) {
			super(NAME, panel);
		}
		
		override public function listNotificationInterests():Array {
			return [Events.ANSWER_BAD, 
				Events.ANSWER_OK, 
				Events.ANSWER_SURRENDER, 
				Events.NEW_QUESTION, 
				Events.GAME_SEGMENT_FALLING,
				Events.GAME_SEGMENT_PLACED,
				Events.GAME_TOWER_GROWS,
				Events.GAME_TIMER_TIME_ENDED,
				Events.GAME_TOWER_HEIGHT_UPDATE];
		}
		
		override public function onRegister():void {
			super.onRegister();
			
			gameProxy = facade.retrieveProxy(GameProxy.NAME) as GameProxy;
			towerBox = new TowerBox(parent.width, parent.height);
			parent.addChild(towerBox);
			
			menuBackBtn = new Sprite();
			var tmpbmp:Bitmap = new backBtnCl();
			tmpbmp.smoothing = true;
			menuBackBtn.addChild(tmpbmp);
			menuBackBtn.x = parent.width - menuBackBtn.width - 10;
			menuBackBtn.y = 0;
			parent.addChild(menuBackBtn);
			
			menuBackBtn.buttonMode = true;
			menuBackBtn.addEventListener(MouseEvent.CLICK, function():void {
				(AppFacade.GetInstance().retrieveProxy(Sounds.NAME) as Sounds).EffectClick();
				AppFacade.GetInstance().sendNotification(Events.NAVIGATION_MENU, parent.stage);
			} );
		}
		
		override public function onRemove():void {
			super.onRemove();
			
			parent.removeChild(towerBox);
			parent.removeChild(menuBackBtn);
		}
		
		override public function handleNotification(notification:INotification):void {
			var name:String = notification.getName();
			var body:Object = notification.getBody();
			
			switch(name) {
				case Events.NEW_QUESTION:
					Logger.Log("Tower: new question");
					towerBox.NextQuestion(body as MathQuestion);
					break;
				case Events.ANSWER_BAD:
				case Events.ANSWER_SURRENDER:
					towerBox.HandleQuestionAnswer();
					AppFacade.GetInstance().sendNotification(Events.CREATE_NEW_QUESTION);
					break;
				case Events.ANSWER_OK:
					Logger.Log("Tower: handler answer");
					towerBox.HandleQuestionAnswer();
					break;
				case Events.GAME_TOWER_GROWS:
					gameProxy.GrowTower(body as Number);
					break;
				case Events.GAME_TIMER_TIME_ENDED:
					towerBox.EndGame();
					break;
				case Events.GAME_SEGMENT_FALLING:
					towerBox.background.craneOperator.SetState(CraneOperator.STATE_ACTION);
					break;
				case Events.GAME_SEGMENT_PLACED:
					towerBox.background.craneOperator.SetState(CraneOperator.STATE_NORMAL);
					break;
				case Events.GAME_TOWER_HEIGHT_UPDATE:
					towerBox.indicator.UpdateHeightTxt(body as int);
					break;
			}
		}
		
		public function get parent():Sprite {
			return viewComponent as Sprite;
		}
	}

}