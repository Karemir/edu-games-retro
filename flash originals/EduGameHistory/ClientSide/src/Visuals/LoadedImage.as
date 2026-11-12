package Visuals {
	import adobe.utils.CustomActions;
	import com.greensock.TweenLite;
	import flash.display.CapsStyle;
	import flash.display.JointStyle;
	import flash.display.Loader;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.HTTPStatusEvent;
	import flash.events.IOErrorEvent;
	import flash.events.MouseEvent;
	import flash.filters.DropShadowFilter;
	import flash.filters.GlowFilter;
	import flash.net.URLRequest;
	import flash.net.URLVariables;
	import flash.system.LoaderContext;
	import Proxies.QuestionProxy;
	import Proxies.Sounds;
	
	/**
	 * ...
	 * @author Perzak
	 */
	public class LoadedImage extends Sprite {
		public static const LOADED:String = "Loaded";
		public static const LOAD_ERROR:String = "Error";
		public static const SELECTED:String = "Selected";
		public static const DESELECTED:String = "Deselected";
		
		public var targetSize:int;
		
		public var loader:Loader;
		public var imgId:String;
		public var isCorrect:Boolean;
		public var isSelected:Boolean;
		public var overlay:Sprite;
		
		private var proxy:QuestionProxy;
		
		public function LoadedImage(imgId:String, isCorrect:Boolean, trgSize:int) {
			this.isCorrect = isCorrect;
			isSelected = false;
			this.imgId = imgId;
			this.targetSize = trgSize;
			
			proxy = AppFacade.GetInstance().retrieveProxy(QuestionProxy.NAME) as QuestionProxy;
			
			var vars:URLVariables = new URLVariables();
			vars.imageId = imgId;
			var req:URLRequest = new URLRequest(proxy.hostUrl + "Question/GetImg");
			req.method = "GET";
			req.data = vars;
			
			loader = new Loader();
			loader.contentLoaderInfo.addEventListener(Event.COMPLETE, onComplete);
			loader.contentLoaderInfo.addEventListener(HTTPStatusEvent.HTTP_STATUS, onStatus);
			loader.contentLoaderInfo.addEventListener(IOErrorEvent.IO_ERROR, onError);
			loader.load(req);
			addChild(loader);
			
			buttonMode = true;
			addEventListener(MouseEvent.CLICK, onClick);
			
			graphics.beginFill(0xbbbbbb,0.8);
			//graphics.lineStyle(2, 0, 0.0);
			graphics.drawRect(0, 0, trgSize, trgSize);
			
			filters = [new DropShadowFilter()];
		}
		
		public function onClick(e:MouseEvent):void {
			(AppFacade.GetInstance().retrieveProxy(Sounds.NAME) as Sounds).EffectClick();
			if (isSelected) Deselect();
			else Select();
		}
		
		private function onComplete(e:Event):void {
			if (loader.width < loader.height) {
				loader.height = targetSize;
				loader.scaleX = loader.scaleY;
			} else {
				loader.width = targetSize;
				loader.scaleY = loader.scaleX;
			}
			
			loader.x = targetSize / 2 - loader.width / 2;
			loader.y = targetSize / 2 - loader.height / 2;
			overlay = new Sprite();
			addChild(overlay);
			overlay.graphics.lineStyle(12, 0xffffff, 1, false, "normal", CapsStyle.SQUARE, JointStyle.MITER);
			overlay.graphics.moveTo(loader.x + 6, loader.y + 6);
			overlay.graphics.lineTo(loader.x + loader.width - 6, loader.y + 6);
			overlay.graphics.lineTo(loader.x + loader.width - 6, loader.y + loader.height - 6);
			overlay.graphics.lineTo(loader.x + 6, loader.y + loader.height - 6);
			overlay.graphics.lineTo(loader.x + 6, loader.y + 6);
			overlay.alpha = 0;
			
			dispatchEvent(new Event(LOADED));
		}
		
		private function onError(e:Event):void {
			trace ("load image failed for " + imgId);
			dispatchEvent(new Event(LOAD_ERROR));
		}
		
		private function onStatus(e:HTTPStatusEvent):void {
			if (e.status != 200) {
				onError(e);
			}
		}
		
		public function Select(e:Event = null):void {
			isSelected = true;
			TweenLite.to(overlay, 0.4, { tint:0xffff33, alpha:1 } );
			dispatchEvent(new Event(SELECTED));
		}
		
		public function Deselect(e:Event = null):void {
			isSelected = false;
			TweenLite.to(overlay, 0.4, { tint:0xffff33, alpha:0, removeTint:true } );
			dispatchEvent(new Event(DESELECTED));
		}
		
		/**
		 * Checks if the image is answered corectly, and marks with proper colors
		 * @return 1 if correct, 0 if correctly not selected, -0.5 when incorrect
		 */
		public function CheckAnswer():Number {
			buttonMode = false;
			removeEventListener(MouseEvent.CLICK, onClick);

			if (isSelected) {
				if (isCorrect) {
					// correct answer is selected - mark as green
					TweenLite.to(overlay, 0.4, {tint:0x91e600, alpha:1});
					return 1;
				} else {
					// bad answer selected - mark as red.
					// TODO: play sound.
					TweenLite.to(overlay, 0.4, { tint:0xff2244, alpha:1 } );
					TweenLite.to(this, 0.4, { alpha:0.4 } );
					return -0.5;
				}
			} else {
				// not selected
				if (isCorrect) {
					// mark as error (blue - not selected but correct)
					TweenLite.to(overlay, 0.4, {tint:0x1245ee, alpha:1} );
					return 0;
				} else {
					TweenLite.to(this, 0.4, { alpha:0.4 } );
					return 0; // not mark not selected good answers
				}
			}
		}
	}
}