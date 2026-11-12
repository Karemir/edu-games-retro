package Proxies {
	import com.greensock.loading.core.DisplayObjectLoader;
	import com.greensock.TweenLite;
	import flash.display.Bitmap;
	import flash.display.DisplayObject;
	import flash.display.Loader;
	import flash.events.Event;
	import flash.utils.ByteArray;
	import org.puremvc.as3.interfaces.IProxy;
	import org.puremvc.as3.patterns.proxy.Proxy;
	
	/**
	 * ...
	 * @author Perzak
	 */
	public class QuizConfigProxy extends Proxy implements IProxy {
		[Embed(source="../../Assets/bgNowozytnosc.png",mimeType="application/octet-stream")]
		private static var bgNowozytnoscCl:Class;
		[Embed(source="../../Assets/bgSredniowiecze.png",mimeType="application/octet-stream")]
		private static var bgSredniowieczeCl:Class;
		[Embed(source="../../Assets/bgStarozytnosc.png",mimeType="application/octet-stream")]
		private static var bgStarozytnoscCl:Class
		[Embed(source="../../Assets/bgXIX.png",mimeType="application/octet-stream")]
		private static var bgXIXCl:Class;
		[Embed(source="../../Assets/bgXX.png",mimeType="application/octet-stream")]
		private static var bgXXCl:Class;
		
		[Embed(source="../../Assets/bgBack.png",mimeType="application/octet-stream")]
		private static const bgSplashCl:Class;
		[Embed(source="../../Assets/eulogo.png",mimeType="application/octet-stream")]
		private static const bgEUCl:Class;
		[Embed(source="../../Assets/Logo_GwK.png",mimeType="application/octet-stream")]
		private static const bgGWKCl:Class;
		
		// image cache - they tend to blink a lot. so load them once and store.
		private static var bgNowoInst:DisplayObject;
		private static var bgSrednInst:DisplayObject;
		private static var bgStaroInst:DisplayObject;
		private static var bgXIXInst:DisplayObject;
		private static var bgXXInst:DisplayObject;
		private static var bgSplashInst:DisplayObject;
		private static var bgEUInst:DisplayObject;
		private static var bgGWKInst:DisplayObject;
		
		public static const NAME:String = "QuizConfig";
		
		public var difficulty:int;
		public var epoch:int;
		public var gameMode:int;
		
		public function QuizConfigProxy() {
			bgNowoInst = LoadImage(bgNowozytnoscCl);
			bgSrednInst = LoadImage(bgSredniowieczeCl);
			bgStaroInst = LoadImage(bgStarozytnoscCl);
			bgXIXInst = LoadImage(bgXIXCl);
			bgXXInst = LoadImage(bgXXCl);
			bgSplashInst = LoadImage(bgSplashCl);
			bgEUInst = LoadImage(bgEUCl);
			bgGWKInst = LoadImage(bgGWKCl);
		}
		
		public function GetImgCountForDifficulty():int {
			switch (difficulty) {
				case QuestionProxy.DIF_EASY: 
					return 4;
				case QuestionProxy.DIF_MEDIUM: 
					return 6;
				case QuestionProxy.DIF_HARD: 
					return 8;
			}
			return 0;
		}
		
		public function GetSecondsForAnswer():int {
			if (gameMode == QuestionProxy.GAME_MODE_TIME_ATTACH) {
				return 3 * 60;
			}
			switch (difficulty) {
				case QuestionProxy.DIF_EASY: 
					return 11;
				case QuestionProxy.DIF_MEDIUM: 
					return 15;
				case QuestionProxy.DIF_HARD: 
					return 20;
			}
			return 0;
		}
		
		public function GetEpochBg(epochId:int, animateToDefault:Boolean):DisplayObject {
			switch (epochId) {
				case QuestionProxy.EPOCH_STAROZYTNOSC: 
					return ResetBg(bgStaroInst, animateToDefault);
				case QuestionProxy.EPOCH_SREDNIOWIECZE: 
					return ResetBg(bgSrednInst, animateToDefault);
				case QuestionProxy.EPOCH_NOWOZYTNOSC: 
					return ResetBg(bgNowoInst, animateToDefault);
				case QuestionProxy.EPOCH_XIX: 
					return ResetBg(bgXIXInst, animateToDefault);
				case QuestionProxy.EPOCH_XX: 
					return ResetBg(bgXXInst, animateToDefault);
			}
			return null;
		}
		
		public static function GetDefaultBg():DisplayObject {
			return bgSplashInst;
		}
		
		private function LoadImage(src:Class):DisplayObject {
			var bg:Loader = new Loader();
			bg.loadBytes(new src() as ByteArray);
			bg.contentLoaderInfo.addEventListener(Event.COMPLETE, function(e:Event):void {
					(bg.content as Bitmap).smoothing = true;
				});
			return bg;
		}
		
		public static function GetEULogo():DisplayObject {
			return bgEUInst;
		}
		
		public static function GetGWKLogo():DisplayObject {
			return bgGWKInst;
		}
		
		public static function GetEpochName(epochId:int):String {
			switch (epochId) {
				case QuestionProxy.EPOCH_SREDNIOWIECZE: 
					return "ŚREDNIOWIECZE";
				case QuestionProxy.EPOCH_STAROZYTNOSC: 
					return "STAROŻYTNOŚĆ";
				case QuestionProxy.EPOCH_NOWOZYTNOSC: 
					return "NOWOŻYTNOŚĆ";
				case QuestionProxy.EPOCH_XIX: 
					return "XIX WIEK";
				case QuestionProxy.EPOCH_XX: 
					return "XX WIEK";
			}
			return "";
		}
		
		public function GetCurrentEpochBg(animateToDefault:Boolean):DisplayObject {
			var disp:DisplayObject = GetEpochBg(epoch, animateToDefault);
			ResetBg(disp, animateToDefault);
			return disp;
		}
		
		public function ResetBg(disp:DisplayObject, animateToDefault:Boolean):DisplayObject {
			if (disp && disp is Loader) {
				var bmp:Bitmap = (disp as Loader).content as Bitmap;
				if (animateToDefault) {
					TweenLite.to(disp, 0.4, {width: bmp.bitmapData.width, height: bmp.bitmapData.height, x: 0, y: 0});
				} else {
					disp.width = bmp.bitmapData.width;
					disp.height = bmp.bitmapData.height;
					disp.x = 0;
					disp.y = 0;
				}
			}
			return disp;
		}
		
		override public function getProxyName():String {
			return NAME;
		}
	}

}