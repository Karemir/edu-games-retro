package  
{
	/**
	 * ...
	 * @author Perzka Michalowy
	 */
	public class Events 
	{
		/**
		 * Opens main menu, clearing current views
		 * body: stage
		 * type: name of current logic/mediator
		 */
		public static const NAVIGATE_MAIN_MENU:String = "NavigateMainMenu";
		
		/**
		 * User selected back button on new game game screen
		 */
		public static const MAIN_MENU_PANEL_BACK:String = "MainMenuPanelBack";
		
		/**
		 * User selected level and filled his name. The game should hide panel 
		 * and go to vehicle selection screen.
		 */
		public static const MAIN_MENU_GAME_READY:String = "MainMenuGameReady";
		
		/**
		 * When user accepted a vehicle
		 * body: vehicleId : int
		 */
		public static const MENU_VEHICLE_SELECTED:String = "MenuVehicleSelected";
		
		/**
		 * When user selects a tournament to race
		 * body: track number 0-1-2
		 */
		public static const MENU_TOURNAMENT_SELECTED:String = "MenuTournamentSelected";
		
		/**
		 * When all races are signed and match should start in a moment
		 * body: race number 1-5
		 */
		public static const MENU_RACE_SELECTED:String = "MenuSigningComplete";
		
		/**
		 * This event is used to cycle through the game screens
		 * MainMenu -> VehicleSelect -> BookingScreen -> RaceScreen -> RaceSummary -> BookingScreen -> ...
		 * body: current logic (mediator) object
		 */
		public static const GAME_CYCLE_SCREENS:String = "GameCycleScreens";
		
		/**
		 * it means that the game is over. All rounds are complete and player should be taken to EndGameLogic
		 */
		public static const GAME_FINAL_ROUND_DONE:String = "GameFinalRoundDone";
		
		/**
		 * body: timeDelta in seconds, ex: 0.016
		 */
		public static const GAME_UPDATE_EVENT:String = "GameUpdateEvent";
		
		/**
		 * When all racers reached the end.
		 */
		public static const GAME_END_VISUAL_RACE:String = "GameEndVisualRace";
		
		/**
		 * When next race summary should be shown
		 */
		public static const GAME_SUMMARY_NEXT:String = "GameSummaryNext";
		
		/**
		 * When user presses a key
		 * body: Keyboard.keyCode
		 */
		public static const KEY_PRESS:String = "KeyPress";
		
		/**
		 * This notification will open a new web page
		 * body: url to a website
		 */
		public static const NAVIGATE_URL:String = "NavigateUrl";
	}

}