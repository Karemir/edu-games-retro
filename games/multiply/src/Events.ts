/**
 * ...
 * @author Perz
 */
export class Events {
	/**
	 * body: a new and current MathQuestion 
	 */
	public static readonly NEW_QUESTION: string = "NewQuestion"; 
	
	/**
	 * When this event is broadcasted it means the game is ready for next question
	 */
	public static readonly CREATE_NEW_QUESTION: string = "CreateNewQuestion"; 
	
	/**
	 * New level is fired when the tower crossed a certain height.
	 * The bonus time is added.
	 * body: Updated DifficultyLevel after level has been updated
	 */
	public static readonly NEW_LEVEL: string = "NewLevel";
	
	/**
	 * body: Answered MathQuestion
	 */
	public static readonly ANSWER_OK: string = "AnswerOK";
	
	/**
	 * body: Answered MathQuestion
	 */
	public static readonly ANSWER_BAD: string = "AnswerBad";
	
	/**
	 * body: Surrendered MathQuestion
	 */
	public static readonly ANSWER_SURRENDER: string = "AnswerSurrender";	
	
	/**
	 * Sent when tower has increased height
	 * body: amount of height the tower is up.
	 */
	public static readonly GAME_TOWER_GROWS: string = "GameTowerGrows";
	
	/**
	 * Sent from proxy when tower has a new height set.
	 * body: tower height (int)
	 */
	public static readonly GAME_TOWER_HEIGHT_UPDATE: string = "GameTowerHeightUpdate";
	
	/**
	 * body: game time left (formatted string "0:00")
	 */
	public static readonly GAME_TIMER_UPDATE: string = "TimerGameUpdate";
	public static readonly GAME_TIMER_START: string = "GameTimerStart";
	public static readonly GAME_TIMER_TIME_ENDED: string = "GameTimerTimeEnded";
	
	/**
	 * Happens when user presses a number
	 * body: string with a new digit
	 */
	public static readonly GAME_NUM_ENTERED: string = "GameNumEntered";
	
	/**
	 * Happens when user pressed 'enter'
	 */
	public static readonly GAME_NUM_DONE: string = "GameNumDone";
	
	/**
	 * Happens when user pressed 'backspace'
	 */
	public static readonly GAME_NUM_BACK: string = "GameNumBack";
	
	public static readonly GAME_SEGMENT_FALLING: string = "GameSegmentFalling";
	public static readonly GAME_SEGMENT_PLACED: string = "GameSegmentPlaced";
	
	public static readonly NAVIGATION_MENU: string = "NavigationMenu";
	public static readonly NAVIGATION_GAME_ARCADE: string = "NavigationGameArcade";
	public static readonly NAVIGATION_GAME_FREEPLAY: string = "NavigationGameFreeplay";
	
	public static readonly GAME_NEW_ARCADE: string = "IsArc";
	public static readonly GAME_NEW_FREEPLAY: string = "IsFree";

	/**
	 * body: url to navigate to
	 */
	public static readonly NAVIGATION_URL: string = "NavigationUrl";
}
