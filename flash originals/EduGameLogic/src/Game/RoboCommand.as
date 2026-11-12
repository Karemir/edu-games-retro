package Game {
	import com.greensock.TweenLite;
	import flash.display.Bitmap;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.utils.setTimeout;

	/**
	 * Robo command is a model in proxy, but also can be displayed 
	 * @author Michal Perzak
	 */
	public class RoboCommand extends Sprite {
		public static const EXECUTE:int = 0; // not quite a command but also a button.
		public static const FORWARD:int = 1;
		public static const ROTATE_LEFT:int = 2;
		public static const ROTATE_RIGHT:int = 3;
		public static const USE:int = 4;
		
		private var comtype:int;
		/**
		 * When true, it means this command is a toolbox command. 
		 * Use it onClick - if in toolbox then user wants to add it to stack, otherwise user wants to remove
		 */
		public var toolboxMode:Boolean;
		private var image:Bitmap;
		
		public function RoboCommand(commandType:int, toolboxMode:Boolean) {
			comtype = commandType;
			this.toolboxMode = toolboxMode;
			buttonMode = true;
						
			if(toolboxMode){
				addEventListener(MouseEvent.CLICK, OnClick);
			} else {
				// clicking not in toolbox mode removes element
				//addEventListener(MouseEvent.CLICK, OnRemove);
			}

			if (toolboxMode) {
				switch(commandType) {
					case FORWARD:
						image = Content.GetBitmap("forwardBlack");
						break;
					case ROTATE_LEFT:
						image = Content.GetBitmap("rotateLeftBlack");
						break;
					case ROTATE_RIGHT:
						image = Content.GetBitmap("rotateRightBlack");
						break;
					case USE:
						image = Content.GetBitmap("useBlack");
						break;
					case EXECUTE:
						image = Content.GetBitmap("execute");
						break;
				}
			} else {
				switch(commandType) {
					case FORWARD:
						image = Content.GetBitmap("forwardGray");
						break;
					case ROTATE_LEFT:
						image = Content.GetBitmap("rotateLeftGray");
						break;
					case ROTATE_RIGHT:
						image = Content.GetBitmap("rotateRightGray");
						break;
					case USE:
						image = Content.GetBitmap("useGray");
						break;
				}
			}
			addChild(image);
		}
		
		public function GetCommand():int {
			return comtype;
		}
		
		public function IsCommand(commandType:int):Boolean {
			return comtype == commandType;
		}
		
		public function OnClick(e:Event):void {
			if (comtype == EXECUTE) {
				AppFacade.GetInstance().sendNotification(Events.GAME_EXECUTE, comtype);
			} else {
				AppFacade.GetInstance().sendNotification(Events.GAME_ADD_COMMAND, comtype);
			}
			var btn:Sprite = e.currentTarget as Sprite;
			TweenLite.to(btn, 0.1, { tint:0xaaff44, onComplete: function():void { TweenLite.to(btn, 0.1, { removeTint:true } ); }} );
		}
		
		public function OnRemove(e:Event):void {
			removeEventListener(MouseEvent.CLICK, OnRemove);
			var inst:RoboCommand = this;
			//TweenLite.to(this, 0.1, { alpha:0 } );
			//setTimeout( function():void { 
				AppFacade.GetInstance().sendNotification(Events.GAME_REMOVE_COMMAND, inst); 
			//}, 0); 			
		}
	}

}