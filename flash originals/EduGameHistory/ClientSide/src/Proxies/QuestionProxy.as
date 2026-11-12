package Proxies {
	import flash.events.Event;
	import flash.events.HTTPStatusEvent;
	import flash.events.IOErrorEvent;
	import flash.events.SecurityErrorEvent;
	import flash.net.URLLoader;
	import flash.net.URLLoaderDataFormat;
	import flash.net.URLRequest;
	import flash.net.URLVariables;
	import flash.utils.ByteArray;
	import org.puremvc.as3.interfaces.IProxy;
	import org.puremvc.as3.patterns.proxy.Proxy;
	import Proxies.DataStructs.DisplayQuestion;
	import Proxies.DataStructs.QQuestion;
	import Proxies.DataStructs.QQuestionList;
	
	/**
	 * ...
	 * @author Perzak
	 */
	public class QuestionProxy extends Proxy implements IProxy {
		public static const NAME:String = "QuestionProxy";
		
		public static const GAME_QUESTION_COUNT:int = 5;
		public static const GAME_MODE_NORMAL:int = 0;
		public static const GAME_MODE_MARATHON:int = 1;
		public static const GAME_MODE_TIME_ATTACH:int = 2;
		
		public static const DIF_EASY:int = 0;
		public static const DIF_MEDIUM:int = 1;
		public static const DIF_HARD:int = 2;
		
		public static const EPOCH_STAROZYTNOSC:int = 1;
		public static const EPOCH_SREDNIOWIECZE:int = 2;
		public static const EPOCH_NOWOZYTNOSC:int = 3;
		public static const EPOCH_XIX:int = 4;
		public static const EPOCH_XX:int = 5;
		
		public var hostUrl:String;
		
		public var gameMode:int;
		public var currentEpochId:int;
		public var currentDif:int;
		private var questionList:QQuestionList;
		
		public var displayQuestions:Vector.<DisplayQuestion>;
		
		public function QuestionProxy() {
			displayQuestions = null;
			questionList = null;
			currentDif = 0;
			currentEpochId = 0;
		}
		
		override public function getProxyName():String {
			return NAME;
		}
		
		override public function onRegister():void {
			hostUrl = (facade as AppFacade).stage.loaderInfo.parameters["hostUrl"];
			if (!hostUrl) {
				trace("host url returning to default");
				hostUrl = "http://history-games.betagrawklasy.edu.pl.hostingasp.pl/";
			}
		}
		
		public function LoadQuestions(dif:int, epoch:int, gameMode:int):void {
			displayQuestions = new Vector.<DisplayQuestion>();
			this.gameMode = gameMode;
			if (currentDif == dif && currentEpochId == epoch) {
				GetRandomQuestions();
			} else {
				currentDif = dif;
				currentEpochId = epoch;
				DownloadQuestionList();
			}
			facade.sendNotification(Events.QUESTIONS_PREPARE_BEGIN);
		}
		
		private function GetRandomQuestions(lastId:int = 0):void {
			// exit condition - if we have enough questions loaded, then stop and send event we are done.
			if (
				(gameMode == GAME_MODE_NORMAL && displayQuestions.length == GAME_QUESTION_COUNT) ||
				((gameMode == GAME_MODE_MARATHON || gameMode == GAME_MODE_TIME_ATTACH) && displayQuestions.length == questionList.Length())
			) {
				trace("all questions loaded " + displayQuestions.length);
				facade.sendNotification(Events.QUESTIONS_PREPARED);
				return;
			} else if (displayQuestions.length == 0) {
				// randomize the question list.
				questionList.Shuffle();
			}
			
			DownloadQuestionData(lastId);
		}
		
		private function DownloadQuestionData(questionId:int):void {
			var url:String = "Question/GetChoicesForImage";
			var vars:URLVariables = new URLVariables();
			vars.questionId = questionList.At(questionId).id;
			
			DownloadData(url, vars, function(urldata:String):void {
				var dec:Object = JSON.parse(urldata);
				var q:DisplayQuestion = new DisplayQuestion(dec);
				displayQuestions.push(q);
				GetRandomQuestions(questionId + 1);
			});
		}
		
		private function DownloadQuestionList():void {
			var url:String = "Question/GetAllQuestionsByEpoch";
			var vars:URLVariables = new URLVariables();
			vars.minDifficulty = currentDif;
			vars.epochId = currentEpochId;
			
			DownloadData(url, vars, function(urldata:String):void {
				var dec:Object = JSON.parse(urldata);
				questionList = new QQuestionList(dec);
				if (questionList.Length() < GAME_QUESTION_COUNT) {
					facade.sendNotification(Events.QUESTIONS_ERROR, "not enough questions");
				} else {
					GetRandomQuestions();
				}
			});
		}
		
		private function DownloadData(url:String, vars:URLVariables, onComplete:Function, onError:Function = null):void {
			var req:URLRequest = new URLRequest(hostUrl + url);
			req.method = "GET";
			req.data = vars;
			
			trace("Net: request on " + req.url + "?" + vars.toString());
			
			var loader:URLLoader = new URLLoader(req);
			loader.addEventListener(Event.COMPLETE, function(e:Event):void {
				if (loader.dataFormat == URLLoaderDataFormat.TEXT) {
					onComplete(loader.data as String);
				} else {
					onComplete(loader.data as ByteArray);
				}
			});
			if (onError != null) {
				loader.addEventListener(HTTPStatusEvent.HTTP_STATUS, onError);
				loader.addEventListener(IOErrorEvent.IO_ERROR, onError);
				loader.addEventListener(SecurityErrorEvent.SECURITY_ERROR, onError);
			} else {
				loader.addEventListener(HTTPStatusEvent.HTTP_STATUS, OnStatusResponse);
				loader.addEventListener(IOErrorEvent.IO_ERROR, OnIOError);
				loader.addEventListener(SecurityErrorEvent.SECURITY_ERROR, OnSecurityError);
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