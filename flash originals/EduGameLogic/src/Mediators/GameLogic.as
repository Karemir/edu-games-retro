package Mediators {
	import Achievements.AchievementProxy;
	import flash.display.Stage;
	import flash.ui.Keyboard;
	import Game.Character;
	import Game.GameLevel;
	import Game.RoboCommand;
	import Game.Screen;
	import org.puremvc.as3.interfaces.IMediator;
	import org.puremvc.as3.interfaces.INotification;
	import org.puremvc.as3.patterns.mediator.Mediator;
	import Proxies.CommandHistory;
	import Proxies.SaveData;
	
	/**
	 * ...
	 * @author Michal Perzak
	 */
	public class GameLogic extends Mediator implements IMediator {
		public static const NAME:String = "GameLogic";
		public static const GAME_DIF_EASY:int = 1;
		public static const GAME_DIF_MEDIUM:int = 2;
		public static const GAME_DIF_HARD:int = 3;
		
		public var saveData:SaveData;
		public var commandHist:CommandHistory;
		public var gameScreen:Screen;
		public var character:Character;
		public var isExecuting:Boolean;
		public var levelId:int;
		
		public function GameLogic(stageItem:Object, levelId:int) {
			super(NAME, stageItem);
			
			isExecuting = false;
			gameScreen = null;
			this.levelId = levelId;
		}
		
		override public function onRegister():void {
			commandHist = facade.retrieveProxy(CommandHistory.NAME) as CommandHistory;
			saveData = facade.retrieveProxy(SaveData.NAME) as SaveData;
			ShowScreen();
		}
		
		override public function onRemove():void {
			if (gameScreen) { stage.removeChild(gameScreen);}
		}
		
		private function ShowScreen():void {
			if (gameScreen) { stage.removeChild(gameScreen); }
			
			gameScreen = new Screen(levelId);
			gameScreen.Show();
			stage.addChild(gameScreen);
			gameScreen.commandList.RestoreCommands(commandHist.GetCommands(levelId));
			gameScreen.UpdateComCount(gameScreen.commandList.roboCommands.length);
			character = gameScreen.character;
			stage.focus = gameScreen;
		}
		
		override public function listNotificationInterests():Array {
			return [ Events.KEY_PRESS,
				Events.GAME_ADD_COMMAND,
				Events.GAME_EXECUTE,
				Events.GAME_COMMAND_DONE,
				Events.GAME_REMOVE_COMMAND,
				Events.GAME_NEXT_COMMAND,
				Events.GAME_RESET_LEVEL,
				Events.GAME_COMPLETE_LEVEL,
				Events.GAME_STOP_EXECUTE
			];
		}
	
		override public function handleNotification(notification:INotification):void 
		{
			var name:String = notification.getName();
			var body:Object = notification.getBody();
			
			switch(name){
				case Events.KEY_PRESS:
					HandleKey(body as uint);
					break;
				case Events.GAME_ADD_COMMAND:
					gameScreen.commandList.AddCommand(int(body));
					gameScreen.UpdateComCount(gameScreen.commandList.roboCommands.length);
					break;
				case Events.GAME_COMMAND_DONE:
					gameScreen.commandList.OnCommandDone();
					break;
				case Events.GAME_REMOVE_COMMAND:
					gameScreen.commandList.OnCommandRemove(body as RoboCommand);
					gameScreen.UpdateComCount(gameScreen.commandList.roboCommands.length);
					break;
				case Events.GAME_NEXT_COMMAND:
					HandleCommand(int(body));
					break;
				case Events.GAME_EXECUTE:
					if (!isExecuting && gameScreen.commandList.HasCommand()) {
						isExecuting = true;
						gameScreen.StartFan(); // make some visuals :)
						commandHist.StoreCommands(gameScreen.commandList.roboCommands, levelId);
						gameScreen.commandList.StartExecuting();
						character.PowerUp(gameScreen.commandList.GetCommand());
					}
					break;
				case Events.GAME_RESET_LEVEL:
					isExecuting = false;
					gameScreen.Hide(function():void {
						ShowScreen();
					} );
					break;
				case Events.GAME_STOP_EXECUTE:
					isExecuting = false;
					gameScreen.StopFan();
					gameScreen.commandList.StopExecuting();
					break;
				case Events.GAME_COMPLETE_LEVEL:
					// lets check how many stars we got
					var moveCount:int = commandHist.GetCommands(levelId).length;
					var starCount:int = 1;
					if (gameScreen.gameLevel.movesFor3Stars >= moveCount) {
						saveData.SetLevelStatus(levelId, SaveData.LEVEL_3_STAR);
						starCount = 3;
					} else if (gameScreen.gameLevel.movesFor2Stars >= moveCount) {
						saveData.SetLevelStatus(levelId, SaveData.LEVEL_2_STAR);
						starCount = 2;
					} else {
						saveData.SetLevelStatus(levelId, SaveData.LEVEL_1_STAR);
						starCount = 1;
					}
					
					if(levelId < GameLevel.GetLevelsCount() - 1){
						gameScreen.ShowEndPopup(moveCount, starCount, true);
					} else {
						gameScreen.ShowEndPopup(moveCount, starCount, false);
					}
					
					ProcessAchievements();
					break;
			}
		}
		
		private function HandleCommand(cmdType:int):void {
			if (cmdType == RoboCommand.FORWARD) {
				character.GoForward();
			} else if (cmdType == RoboCommand.ROTATE_LEFT) {
				character.RotateLeft();
			} else if (cmdType == RoboCommand.ROTATE_RIGHT) {
				character.RotateRight();
			} else if (cmdType == RoboCommand.USE) {
				character.Use();
			} 
		}
		
		private function HandleKey(keycode:uint):void {
			if (keycode == Keyboard.ESCAPE) {
				sendNotification(Events.NAVIGATION_MENU, stage);
			}
			return;
			
			if (keycode == Keyboard.LEFT || keycode == Keyboard.A) {
				character.RotateLeft();
			} else if (keycode == Keyboard.RIGHT || keycode == Keyboard.D) {
				character.RotateRight();
			} else if (keycode == Keyboard.UP || keycode == Keyboard.W) {
				character.GoForward();
			}
		}

		public function ProcessAchievements():void { 
			var achProxy:AchievementProxy = facade.retrieveProxy(AchievementProxy.NAME) as AchievementProxy;
			var lvlCount:int = GameLevel.GetLevelsCount();
			
			var lvlsComplete:int = 0;
			var lvlsPerfect:int = 0;
			var lastLvlDone:Boolean = false;
			for (var i:int = 0; i < lvlCount; ++i) {
				if (saveData.GetLevelStatus(i) != SaveData.LEVEL_NOT_COMPLETED) {
					lvlsComplete++;
				}
				if (saveData.GetLevelStatus(i) == SaveData.LEVEL_3_STAR) {
					lvlsPerfect++;
					if (i == lvlCount -1) {
						lastLvlDone = true;
					}
				}
			}
			
			// push achievements.
			if (lvlsComplete >= 10) {
				achProxy.AddAchievement(15); //"Pokonanie 10 plansz"
			}
			if (lvlsComplete >= 30) {
				achProxy.AddAchievement(16); //"Pokonanie 30 plansz"
			}
			if (lvlsComplete >= 50) {
				achProxy.AddAchievement(17); //"Pokonanie 50 plansz"
			}
			
			if (lvlsPerfect >= 15) {
				achProxy.AddAchievement(18); // "pokonanie 15 plansz na 3 gwiazdki"
			}
			if (lvlsPerfect >= 30) {
				achProxy.AddAchievement(19); // "pokonanie 30 plansz na 3 gwiazdki"
			}
			if (lvlsPerfect >= 45) {
				achProxy.AddAchievement(20); // "pokonanie 45 plansz na 3 gwiazdki"
			}
			
			if (lastLvlDone) {
				achProxy.AddAchievement(21); // "3 gwiazdki na ostatnim poziomie"
			}
		}

		public function get stage():Stage {
			return viewComponent as Stage;
		}
	}

}