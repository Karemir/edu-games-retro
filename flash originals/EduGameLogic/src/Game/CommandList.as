package Game {
	import com.greensock.easing.Bounce;
	import com.greensock.easing.Circ;
	import com.greensock.easing.Cubic;
	import com.greensock.easing.Linear;
	import com.greensock.TweenLite;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.geom.Rectangle;
	import flash.utils.ByteArray;
	import flash.utils.setTimeout;
	
	/**
	 * ...
	 * @author Michal Perzak
	 */
	public class CommandList extends Sprite {
		private static const ICON_SIZE:int = 42;
		private var maskSprite:Sprite;
		private var listCont:Sprite;
		public var roboCommands:Vector.<RoboCommand>;
		public var isExecuting:Boolean;
		
		private var beforeDragX:int;
		private var beforeDragY:int;
		private var draggedCom:RoboCommand;
		
		public function CommandList() {
			roboCommands = new Vector.<RoboCommand>();
			maskSprite = new Sprite();
			listCont = new Sprite();
			
			addEventListener(Event.ADDED_TO_STAGE, onAdded);
			isExecuting = false;
		}
		
		private function onAdded(e:Event):void {
			graphics.beginFill(0x33aaff, 0);
			graphics.drawRoundRect(0, 0, stage.stageWidth - 145, ICON_SIZE, 25);
			
			maskSprite.graphics.beginFill(0x33aaff, 0.7);
			maskSprite.graphics.drawRoundRect(0, 0, stage.stageWidth - 145, ICON_SIZE, 25);
			addChild(maskSprite);
			addChild(listCont);
			listCont.mask = maskSprite;
		}
		
		public function HasCommand():Boolean {
			return roboCommands.length > 0;
		}
		
		public function GetCommand():int {
			if (roboCommands.length > 0) {
				return roboCommands[0].GetCommand();
			} else {
				return -1;
			}
		}
		
		public function AddCommand(command:int):void {
			if (isExecuting)
				return;
			var com:RoboCommand = new RoboCommand(command, false);
			AddCommandInst(com);
			
			com.addEventListener(MouseEvent.MOUSE_DOWN, onStartDrag);
		}
		
		public function onStartDrag(e:MouseEvent):void {
			draggedCom = e.target as RoboCommand;
			listCont.swapChildrenAt(listCont.getChildIndex(draggedCom), listCont.numChildren - 1);
			
			beforeDragX = draggedCom.x;
			beforeDragY = draggedCom.y;
			draggedCom.startDrag(false, new Rectangle(0, 0, maskSprite.width, 0));
			TweenLite.to(draggedCom, 0.4, { alpha: 0.6 } );
			
			stage.addEventListener(MouseEvent.MOUSE_MOVE, onDragUpdate);
			stage.addEventListener(MouseEvent.MOUSE_UP, onEndDrag);
		}
		
		public function onEndDrag(e:MouseEvent):void {
			stage.removeEventListener(MouseEvent.MOUSE_MOVE, onDragUpdate);
			stage.removeEventListener(MouseEvent.MOUSE_UP, onEndDrag);
			
			draggedCom.stopDrag();
			
			if (draggedCom.x == beforeDragX && draggedCom.y == beforeDragY) {
				AppFacade.GetInstance().sendNotification(Events.GAME_REMOVE_COMMAND, draggedCom);
			} else {
				TweenLite.to(draggedCom, 0.4, {x: (5 + roboCommands.indexOf(draggedCom) * ICON_SIZE), y: beforeDragY, alpha:1});
			}
		}
		
		public function onDragUpdate(e:MouseEvent):void {
			var pos:int = draggedCom.x + draggedCom.width / 2;
			var draggedIdx:int = roboCommands.indexOf(draggedCom);
			for (var i:int = 0; i < roboCommands.length; ++i) {
				var tmpC:RoboCommand = roboCommands[i];
				var tmpcPos:int = tmpC.x + tmpC.width / 2;
				
				if (tmpcPos < pos && i > draggedIdx) {
					// move left
					swapItems(roboCommands, tmpC, draggedCom);
					TweenLite.to(tmpC, 0.4, { x: (5 + draggedIdx * ICON_SIZE) } );
					
					break;
				} else if (tmpcPos > pos && i < draggedIdx) {
					// move right
					swapItems(roboCommands, tmpC, draggedCom);
					TweenLite.to(tmpC, 0.4, {x: (5 + draggedIdx * ICON_SIZE)});
					break;
				}
			}
		}
		
		public function AddCommandInst(command:RoboCommand):void {
			listCont.addChild(command);
			command.x = width;
			command.y = 0;
			command.width = ICON_SIZE;
			command.height = ICON_SIZE;
			var pos:Number = 5 + roboCommands.length * ICON_SIZE;
			
			TweenLite.to(command, 0.6, {x: pos, ease: Cubic.easeOut});
			roboCommands.push(command);
			
			UpdateListPos();
		}
		
		public function UpdateListPos():void {
			var newx:Number = -((5+roboCommands.length*ICON_SIZE) + ICON_SIZE) + maskSprite.width;
			if (newx < 0) {
				TweenLite.to(listCont, 0.5, { x:newx } );
			} else {
				TweenLite.to(listCont, 0.5, { x:0 } );
			}
		}
		
		public function RestoreCommands(list:Vector.<RoboCommand>):void {
			for each (var it:RoboCommand in list) {
				AddCommand(it.GetCommand());
			}
			UpdatePositions();
		}
		
		public function OnCommandRemove(command:RoboCommand):void {
			if (isExecuting)
				return;
			
			for (var i:int = 0; i < roboCommands.length; ++i) {
				if (roboCommands[i] == command) {
					roboCommands.splice(i, 1);
					listCont.removeChild(command);
					UpdatePositions(true);
					break;
				}
			}
		}
		
		public function OnCommandDone():void {
			var removedItem:Sprite = roboCommands.shift();
			
			TweenLite.to(removedItem, 0.4, {alpha: 0, onComplete: function():void {
					listCont.removeChild(removedItem);
				}});
			
			UpdatePositions();
			
			if (!isExecuting) {
				return;
			}
			
			if (roboCommands.length > 0) {
				setTimeout(AppFacade.GetInstance().sendNotification, 500, Events.GAME_NEXT_COMMAND, GetCommand());
			} else {
				AppFacade.GetInstance().sendNotification(Events.GAME_RESET_LEVEL);
			}
		}
		
		private function UpdatePositions(fast:Boolean = false):void {
			var nextpos:Number = 5;
			var delay:Number = 0; // 0.1;
			var duration:Number = 0.5;
			if (fast)
				duration = 0.1;
			for each (var cmd:RoboCommand in roboCommands) {
				TweenLite.to(cmd, duration, {x: nextpos, delay: delay});
				nextpos += cmd.width;
				delay += 0.016;
			}
			UpdateListPos();
		}
		
		public function StopExecuting():void {
			isExecuting = false;
		}
		
		public function StartExecuting():void {
			isExecuting = true;
		}
		
		private function swapItems(vec:Vector.<RoboCommand>, item1:RoboCommand, item2:RoboCommand):void {
			var item1pos:int = vec.indexOf(item1);
			var item2pos:int = vec.indexOf(item2);
			
			if ((item1pos != -1) && (item2pos != -1)) {
				var tempItem:RoboCommand = vec[item2pos];
				vec[item2pos] = vec[item1pos];
				vec[item1pos] = tempItem;
			}
		}
	}

}