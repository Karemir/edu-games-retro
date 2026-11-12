package Proxies {
	import org.puremvc.as3.interfaces.IProxy;
	import org.puremvc.as3.patterns.proxy.Proxy;
	
	/**
	 * ...
	 * @author Michal Perzak
	 */
	public class HighscoreProxy extends Proxy implements IProxy {
		public static const NAME:String = "HighscoreProxy";
		
		public var menuId:int;
		public var investmentId:int;
		public var pageId:int;
		
		private var _galleryId:int;
		private var _dualBotGalleryId:int;
		
		public function HighscoreProxy() {
			dualBotGalleryId = -1;
			galleryId = -1;
		}
		
		override public function getProxyName():String {
			return NAME;
		}
		
		/* FOR DEBUGGING */
		
		public function get galleryId():int {
			return _galleryId;
		}
		
		public function set galleryId(value:int):void {
			_galleryId = value;
		}
		
		public function get dualBotGalleryId():int {
			return _dualBotGalleryId;
		}
		
		public function set dualBotGalleryId(value:int):void {
			_dualBotGalleryId = value;
		}
	}
}