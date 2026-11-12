package Visuals {
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.filters.GlowFilter;
	import flash.text.TextField;
	import flash.text.TextFieldAutoSize;
	import Proxies.QuestionProxy;
	
	/**
	 * ...
	 * @author Perzak
	 */
	public class DifSelection extends Sprite {
		public var selectedDif:int;
		
		private var e1:TextField;
		private var e2:TextField;
		private var e3:TextField;
		
		public function DifSelection() {
			e1 = new TextField();
			e2 = new TextField();
			e3 = new TextField();
			
			e1.text = "1 poziom";
			e1.selectable = false;
			e1.autoSize = TextFieldAutoSize.LEFT;
			e1.addEventListener(MouseEvent.CLICK, onEpochClick);
			e2.text = "2 poziom";
			e2.selectable = false;
			e2.autoSize = TextFieldAutoSize.LEFT;
			e2.addEventListener(MouseEvent.CLICK, onEpochClick);
			e3.text = "3 poziom";
			e3.selectable = false;
			e3.autoSize = TextFieldAutoSize.LEFT;
			e3.addEventListener(MouseEvent.CLICK, onEpochClick);
			
			addChild(e1);
			addChild(e2);
			addChild(e3);
			
			e2.y = e1.height;
			e3.y = e2.height + e2.y;
			
			SelectDif(e1);
			graphics.beginFill(0xffffff);
			graphics.drawRect(0, 0, width, height);
		}
		
		public function SelectDif(ep:TextField):void {
			e1.filters = [];
			e2.filters = [];
			e3.filters = [];
			
			if (ep == e1) { selectedDif = QuestionProxy.DIF_EASY; }
			if (ep == e2) { selectedDif = QuestionProxy.DIF_MEDIUM; }
			if (ep == e3) { selectedDif = QuestionProxy.DIF_HARD; }
			
			ep.filters = [new GlowFilter()];
			AppFacade.GetInstance().sendNotification(Events.MENU_DIF, selectedDif);
		}
	
		private function onEpochClick(e:Event):void {
			SelectDif(e.target as TextField);
		}
	}

}