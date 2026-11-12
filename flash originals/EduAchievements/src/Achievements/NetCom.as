package Achievements {
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.HTTPStatusEvent;
	import flash.events.IOErrorEvent;
	import flash.events.SecurityErrorEvent;
	import flash.geom.Point;
	import flash.net.URLLoader;
	import flash.net.URLRequest;
	import flash.net.URLVariables;
	
	/**
	 * ...
	 * @author Michal Perzak
	 */
	public class NetCom extends Sprite {
		public static var instance:NetCom;
		
		public var hostUrl:String;
		public var playerName:String;
		
		public function NetCom() {
			instance = this;
			addEventListener(Event.ADDED_TO_STAGE, OnAdded);
		}
		
		private function OnAdded(e:Event):void {
			removeEventListener(Event.ADDED_TO_STAGE, OnAdded);
			
			hostUrl = stage.loaderInfo.parameters["hostUrl"];
			if (!hostUrl) {
				trace("host url returning to default");
				hostUrl = "http://localhost:59556/";
			}
			
			playerName = stage.loaderInfo.parameters["playerName"];
			if (!playerName) {
				trace("player name to default");
				playerName = "default_player";
			}
		}
		
		public static function GetInstance():NetCom {
			return instance;
		}
		
		public function GardenPutObject(slotId:int, itemId:int):void {
			var req:URLRequest = new URLRequest(hostUrl + "Garden/SetSlot");
			req.method = "GET";
			
			var vars:URLVariables = new URLVariables();
			vars.player = playerName;
			vars.slotId = slotId;
			vars.rewardId = itemId;
			req.data = vars;
			
			trace("Net: GardenPutObject on " + req.url + "?" + vars.toString());
			
			var loader:URLLoader = new URLLoader(req);
			loader.addEventListener(Event.COMPLETE, OnComplete);
			loader.addEventListener(HTTPStatusEvent.HTTP_STATUS, OnStatusResponse);
			loader.addEventListener(IOErrorEvent.IO_ERROR, OnIOError);
			loader.addEventListener(SecurityErrorEvent.SECURITY_ERROR, OnSecurityError);
		}
		
		public function GardenClearSlot(slotId:int):void {
			var req:URLRequest = new URLRequest(hostUrl + "Garden/ClearSlot");
			req.method = "GET";
			
			var vars:URLVariables = new URLVariables();
			vars.player = playerName;
			vars.slotId = slotId;
			req.data = vars;
			
			trace("Net: GardenClearSlot on " + req.url + "?" + vars.toString());
			
			var loader:URLLoader = new URLLoader(req);
			loader.addEventListener(Event.COMPLETE, OnComplete);
			loader.addEventListener(HTTPStatusEvent.HTTP_STATUS, OnStatusResponse);
			loader.addEventListener(IOErrorEvent.IO_ERROR, OnIOError);
			loader.addEventListener(SecurityErrorEvent.SECURITY_ERROR, OnSecurityError);
		}
		
		public function GardenAchievements(callbackFunc:Function):void {
			var req:URLRequest = new URLRequest(hostUrl + "Achievement/GetAll");
			req.method = "GET";
			
			var vars:URLVariables = new URLVariables();
			vars.player = playerName;
			req.data = vars;
			
			trace("Net: AchieveGet on " + req.url + "?" + vars.toString());
			
			var loader:URLLoader = new URLLoader(req);
			loader.addEventListener(HTTPStatusEvent.HTTP_STATUS, OnStatusResponse);
			loader.addEventListener(IOErrorEvent.IO_ERROR, OnIOError);
			loader.addEventListener(SecurityErrorEvent.SECURITY_ERROR, OnSecurityError);		
			loader.addEventListener(Event.COMPLETE, function(e:Event):void {
				var response:URLLoader = e.target as URLLoader;
				var data:Object = JSON.parse(response.data);
				var setup:Vector.<int> = new Vector.<int>();
				for each(var item:Object in data) {
					setup.push(int(item.Code));
				}
				callbackFunc(setup);
			});

		}
		
		public function PushAchievement(achievementId:int):void {
			var req:URLRequest = new URLRequest(hostUrl + "Achievement/Set");
			req.method = "GET";
			
			var vars:URLVariables = new URLVariables();
			vars.player = playerName;
			vars.code = achievementId;
			req.data = vars;
			
			trace("Net: Achievement set on " + req.url + "?" + vars.toString());
			
			var loader:URLLoader = new URLLoader(req);
			loader.addEventListener(Event.COMPLETE, OnComplete);
			loader.addEventListener(HTTPStatusEvent.HTTP_STATUS, OnStatusResponse);
			loader.addEventListener(IOErrorEvent.IO_ERROR, OnIOError);
			loader.addEventListener(SecurityErrorEvent.SECURITY_ERROR, OnSecurityError);
		}
		
		public function GardenGetSetup(callbackFunc:Function):void {
			var req:URLRequest = new URLRequest(hostUrl + "Garden/GetSlots");
			req.method = "GET";
			
			var vars:URLVariables = new URLVariables();
			vars.player = playerName;
			req.data = vars;
			
			trace("Net: GardenClearSlot on " + req.url + "?" + vars.toString());
			
			var loader:URLLoader = new URLLoader(req);
			loader.addEventListener(HTTPStatusEvent.HTTP_STATUS, OnStatusResponse);
			loader.addEventListener(IOErrorEvent.IO_ERROR, OnIOError);
			loader.addEventListener(SecurityErrorEvent.SECURITY_ERROR, OnSecurityError);		
			loader.addEventListener(Event.COMPLETE, function(e:Event):void {
				var response:URLLoader = e.target as URLLoader;
				var data:Object = JSON.parse(response.data);
				var setup:Vector.<Point> = new Vector.<Point>();
				for each(var item:Object in data) {
					setup.push(new Point(item.slotId, item.itemId));
				}
				callbackFunc(setup);
			});
		}
		
		private function OnComplete(e:Event):void {
			if (e.target is URLLoader) {
				var ul:URLLoader = e.target as URLLoader;
				trace("Net: request complete, data loaded: " + ul.bytesTotal);
			} else {
				trace("Net: request complete " + e.target);
			}
		}
		
		private function OnStatusResponse(e:HTTPStatusEvent):void {
			trace("Net: status response " + e.status);
		}
		
		private function OnSecurityError(e:SecurityErrorEvent):void {
			trace("Net: Security error " + e.text);
			trace(e);
		}
		
		private function OnIOError(e:IOErrorEvent):void {
			trace("Net: IO Error " + e);
		}
	}

}