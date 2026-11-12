package Visuals {
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.filters.GlowFilter;
	import flash.text.TextField;
	import flash.text.TextFieldAutoSize;
	
	/**
	 * ...
	 * @author Perzak
	 */
	public class EpochSelection extends Sprite {
		public var selectedEpoch:int;
		
		private var e1:TextField;
		private var e2:TextField;
		private var e3:TextField;
		private var e4:TextField;
		private var e5:TextField;
		
		public function EpochSelection() {
			e1 = new TextField();
			e2 = new TextField();
			e3 = new TextField();
			e4 = new TextField();
			e5 = new TextField();
			
			e1.text = "Starożytność";
			e1.selectable = false;
			e1.autoSize = TextFieldAutoSize.LEFT;
			e1.addEventListener(MouseEvent.CLICK, onEpochClick);
			e2.text = "Średniowiecze";
			e2.selectable = false;
			e2.autoSize = TextFieldAutoSize.LEFT;
			e2.addEventListener(MouseEvent.CLICK, onEpochClick);
			e3.text = "Nowożytność";
			e3.selectable = false;
			e3.autoSize = TextFieldAutoSize.LEFT;
			e3.addEventListener(MouseEvent.CLICK, onEpochClick);
			e4.text = "XIX wiek";
			e4.selectable = false;
			e4.autoSize = TextFieldAutoSize.LEFT;
			e4.addEventListener(MouseEvent.CLICK, onEpochClick);
			e5.text = "XX wiek";
			e5.selectable = false;
			e5.autoSize = TextFieldAutoSize.LEFT;
			e5.addEventListener(MouseEvent.CLICK, onEpochClick);
			
			addChild(e1);
			addChild(e2);
			addChild(e3);
			addChild(e4);
			addChild(e5);
			
			e2.y = e1.height;
			e3.y = e2.height + e2.y;
			e4.y = e3.height + e3.y;
			e5.y = e4.height + e4.y;
			
			SelectEpoch(e1);
		}
		
		public function SelectEpoch(ep:TextField):void {
			e1.filters = [];
			e2.filters = [];
			e3.filters = [];
			e4.filters = [];
			e5.filters = [];
			
			if (ep == e1) { selectedEpoch = 1; }
			if (ep == e2) { selectedEpoch = 2; }
			if (ep == e3) { selectedEpoch = 3; }
			if (ep == e4) { selectedEpoch = 4; }
			if (ep == e5) { selectedEpoch = 5; }			
			
			ep.filters = [new GlowFilter()];
			AppFacade.GetInstance().sendNotification(Events.MENU_EPOCH, selectedEpoch);
		}
	
		private function onEpochClick(e:Event):void {
			SelectEpoch(e.target as TextField);
		}
	}

}