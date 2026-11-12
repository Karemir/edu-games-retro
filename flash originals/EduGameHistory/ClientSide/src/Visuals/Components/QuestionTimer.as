package Visuals.Components {
	import flash.display.Bitmap;
	import flash.display.Graphics;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.geom.Point;
	import flash.text.TextField;
	import flash.text.TextFieldAutoSize;
	import flash.text.TextFormat;
	import Proxies.QuizConfigProxy;
	
	/**
	 * This sprite is oriented to the right side. meaning 0,0 is topmost right side
	 * @author Perzak
	 */
	public class QuestionTimer extends Sprite {
		public var config:QuizConfigProxy;
		public static const TIMER_DONE:String = "timerdone";
		
		[Embed(source="../../../Assets/timeSymbol.png")]
		private static const symbolCl:Class;
		
		// circle timer stuff
		private var bg:Sprite;
		private var visibleBg:Sprite;
		private var bgmask:Sprite;
		private var lasttime:Number;
		
		private var minutes:TextField;
		private var second1:TextField;
		private var second2:TextField;
		private var separator:TextField;
		
		private var symbol:Bitmap;
		
		public function QuestionTimer() {
			config = AppFacade.GetInstance().retrieveProxy(QuizConfigProxy.NAME) as QuizConfigProxy;
			
			addEventListener(Event.ENTER_FRAME, onFrame);
			
			symbol = new symbolCl();
			symbol.smoothing = true;
			addChild(symbol);
			symbol.x = -symbol.width;
			symbol.y = 0;
			
			minutes = createTxt();
			minutes.text = "0";
			separator = createTxt();
			separator.text = ":";
			second1 = createTxt();
			second1.text = "0";
			second2 = createTxt();
			second2.text = "0";
			
			addChild(minutes);
			addChild(separator);
			addChild(second1);
			addChild(second2);
			
			second2.x = symbol.x - 10 - second2.width;
			second1.x = second2.x + 2 - second1.width;
			separator.x = second1.x + 4 - separator.width;
			minutes.x = separator.x + 4 - minutes.width;
			second1.y = -2;
			second2.y = -2;
			separator.y = -3;
			minutes.y = -2;
			
			lasttime = new Date().time;
		/*
		   bgmask = new Sprite();
		   bg = new Sprite();
		   visibleBg = new Sprite();
		
		   addChild(visibleBg);
		   addChild(bg);
		   addChild(bgmask);
		
		   bg.mask = bgmask;
		
		   bg.graphics.beginFill(0xFF7F00, 0.9);
		   bg.graphics.drawCircle(0, 0, 29);
		   visibleBg.graphics.beginFill(0xffffff, 1);
		   visibleBg.graphics.lineStyle(2, 0);
		 visibleBg.graphics.drawCircle(0, 0, 30);*/
		
		}
		
		private function createTxt():TextField {
			var txt:TextField = new TextField();
			txt.defaultTextFormat = new TextFormat("andale", 13, 0xffffff);
			txt.embedFonts = true;
			txt.selectable = false;
			txt.autoSize = TextFieldAutoSize.LEFT;
			
			return txt;
		}
		
		private function onFrame(e:Event):void {
			var toCount:int = config.GetSecondsForAnswer() * 1000;
			var timenow:Number = new Date().time;
			
			if (timenow - lasttime >= toCount) {
				minutes.text = "0";
				second1.text = "0";
				second2.text = "0";
				StopTimer();
				dispatchEvent(new Event(TIMER_DONE));
			}
			var secLeft:int = Math.round((toCount - (timenow - lasttime)) / 1000);
			minutes.text = int(secLeft / 60).toString();
			second1.text = int((secLeft % 60) / 10).toString();
			second2.text = int((secLeft % 60) % 10).toString();
		
		/*bgmask.graphics.clear();
		   bgmask.graphics.beginFill(0, 1);
		
		   var toCount:Number = config.GetSecondsForAnswer() * 1000;
		   var timenow:Number = new Date().time;
		
		   var dif:Number = timenow - lasttime;
		   var relativeDif:Number = dif / toCount;
		   if (relativeDif >= 1) {
		   StopTimer();
		   //AppFacade.GetInstance().sendNotification(Events.QUESTION_RESULT);
		   dispatchEvent(new Event(TIMER_DONE));
		   relativeDif = 1;
		   }
		 drawClockSlice(bgmask, 0, 0, relativeDif * 360 , 30);*/
		}
		
		public function Reset():void {
			lasttime = new Date().time;
			if (!hasEventListener(Event.ENTER_FRAME)) {
				addEventListener(Event.ENTER_FRAME, onFrame);
			}
		}
		
		public function StopTimer():void {
			removeEventListener(Event.ENTER_FRAME, onFrame);
		}
		
		public function StartTimer():void {
			if (!hasEventListener(Event.ENTER_FRAME)) {
				addEventListener(Event.ENTER_FRAME, onFrame);
			}
		}
		
		private function drawClockSlice(sprite:Sprite, centerX:Number, centerY:Number, endAngle:Number, radius:Number):void {
			var g:Graphics = sprite.graphics;
			var controlPoint:Point;
			var anchorPoint:Point;
			
			var startRadians:Number = Math.PI / 180 * -90;
			var endRadians:Number = Math.PI / 180 * (endAngle - 90);
			
			var difference:Number = Math.abs(endRadians - startRadians);
			var divisions:Number = Math.floor(difference / (Math.PI / 4)) + 1;
			var span:Number = difference / (2 * divisions);
			var controlRadius:Number = radius / Math.cos(span);
			
			g.moveTo(centerX, centerY);
			g.lineTo(centerX + (Math.cos(startRadians) * radius), centerY + Math.sin(startRadians) * radius);
			
			for (var i:Number = 0; i < divisions; ++i) {
				endRadians = startRadians + span;
				startRadians = endRadians + span;
				controlPoint = new Point(centerX + Math.cos(endRadians) * controlRadius, centerY + Math.sin(endRadians) * controlRadius);
				anchorPoint = new Point(centerX + Math.cos(startRadians) * radius, centerY + Math.sin(startRadians) * radius);
				g.curveTo(controlPoint.x, controlPoint.y, anchorPoint.x, anchorPoint.y);
			}
			g.lineTo(centerX, centerY);
		}
	}

}