/**
 * ...
 * @author Perzka Michalowy
 */
export class Events 
{
	/**
	 * Opens main menu, clearing current views
	 * body: stage
	 * type: name of current logic/mediator
	 */
	public static readonly NAVIGATE_MAIN_MENU: string = "NavigateMainMenu";
	
	/**
	 * User selected back button on new game game screen
	 */
	public static readonly MAIN_MENU_PANEL_BACK: string = "MainMenuPanelBack";
	
	/**
	 * User selected level and filled his name. The game should hide panel 
	 * and go to vehicle selection screen.
	 */
	public static readonly MAIN_MENU_GAME_READY: string = "MainMenuGameReady";
	
	/**
	 * When user accepted a vehicle
	 * body: vehicleId : int
	 */
	public static readonly MENU_VEHICLE_SELECTED: string = "MenuVehicleSelected";
	
	/**
	 * When user selects a tournament to race
	 * body: track number 0-1-2
	 */
	public static readonly MENU_TOURNAMENT_SELECTED: string = "MenuTournamentSelected";
	
	/**
	 * When all races are signed and match should start in a moment
	 * body: race number 1-5
	 */
	public static readonly MENU_RACE_SELECTED: string = "MenuSigningComplete";
	
	/**
	 * This event is used to cycle through the game screens
	 * MainMenu -> VehicleSelect -> BookingScreen -> RaceScreen -> RaceSummary -> BookingScreen -> ...
	 * body: current logic (mediator) object
	 */
	public static readonly GAME_CYCLE_SCREENS: string = "GameCycleScreens";
	
	/**
	 * it means that the game is over. All rounds are complete and player should be taken to EndGameLogic
	 */
	public static readonly GAME_FINAL_ROUND_DONE: string = "GameFinalRoundDone";
	
	/**
	 * body: timeDelta in seconds, ex: 0.016
	 */
	public static readonly GAME_UPDATE_EVENT: string = "GameUpdateEvent";
	
	/**
	 * When all racers reached the end.
	 */
	public static readonly GAME_END_VISUAL_RACE: string = "GameEndVisualRace";
	
	/**
	 * When next race summary should be shown
	 */
	public static readonly GAME_SUMMARY_NEXT: string = "GameSummaryNext";
	
	/**
	 * When user presses a key
	 * body: Keyboard.keyCode
	 */
	public static readonly KEY_PRESS: string = "KeyPress";
	
	/**
	 * This notification will open a new web page
	 * body: url to a website
	 */
	public static readonly NAVIGATE_URL: string = "NavigateUrl";
}
