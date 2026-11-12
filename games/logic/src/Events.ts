/**
 * ...
 * @author Perz
 */
export class Events {
	/**
	 * Used to go to menu
	 */
	public static readonly NAVIGATION_MENU: string = "NavigationMenu";
	
	/**
	 * body: level id
	 */
	public static readonly NAVIGATION_PLAY_GAME: string = "NavigationGameArcade";
	public static readonly NAVIGATION_CHOOSE_DIF: string = "NavigationChooseDif";
	/**
	 * body: stage
	 * type: diff Id
	 */
	public static readonly NAVIGATION_CHOOSE_LEVEL: string = "NavigationChooseLevel";
	
	public static readonly GAME_RESET_LEVEL: string = "GameResetLevel";
	public static readonly GAME_COMPLETE_LEVEL: string = "GameCompleteLevel";
	
	public static readonly GAME_STOP_EXECUTE: string = "GameStopExecute";
	public static readonly GAME_EXECUTE: string = "GameExecute";
	public static readonly GAME_NEXT_COMMAND: string = "GameNextCommand";
	public static readonly GAME_COMMAND_DONE: string = "GameDelLastCommand";
	public static readonly GAME_ADD_COMMAND: string = "GameAddCommand";
	public static readonly GAME_REMOVE_COMMAND: string = "GameRemoveCom";
	
	public static readonly MENU_LEVEL_SELECTED: string = "MenuLevelSelected";
	
	/**
	 * body: url to navigate to
	 */
	public static readonly NAVIGATION_URL: string = "NavigationUrl";
	
	/**
	 * body: keycode that was pressed
	 */
	public static readonly KEY_PRESS: string = "KeyPressed";
}
