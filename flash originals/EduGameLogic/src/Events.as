package  {
	/**
	 * ...
	 * @author Perz
	 */
	public class Events {
		/**
		 * Used to go to menu
		 */
		public static const NAVIGATION_MENU:String = "NavigationMenu";
		
		/**
		 * body: level id
		 */
		public static const NAVIGATION_PLAY_GAME:String = "NavigationGameArcade";
		public static const NAVIGATION_CHOOSE_DIF:String = "NavigationChooseDif";
		/**
		 * body: stage
		 * type: diff Id
		 */
		public static const NAVIGATION_CHOOSE_LEVEL:String = "NavigationChooseLevel";
		
		public static const GAME_RESET_LEVEL:String = "GameResetLevel";
		public static const GAME_COMPLETE_LEVEL:String = "GameCompleteLevel";
		
		public static const GAME_STOP_EXECUTE:String = "GameStopExecute";
		public static const GAME_EXECUTE:String = "GameExecute";
		public static const GAME_NEXT_COMMAND:String = "GameNextCommand";
		public static const GAME_COMMAND_DONE:String = "GameDelLastCommand";
		public static const GAME_ADD_COMMAND:String = "GameAddCommand";
		public static const GAME_REMOVE_COMMAND:String = "GameRemoveCom";
		
		public static const MENU_LEVEL_SELECTED:String = "MenuLevelSelected";
		
		/**
		 * body: url to navigate to
		 */
		public static const NAVIGATION_URL:String = "NavigationUrl";
		
		/**
		 * body: keycode that was pressed
		 */
		public static const KEY_PRESS:String = "KeyPressed";
	}
}