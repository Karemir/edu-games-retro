package  {
	/**
	 * ...
	 * @author Perz
	 */
	public class Events {
		/**
		 * body: a new and current MathQuestion 
		 */
		public static const NEW_QUESTION:String = "NewQuestion"; 
		
		/**
		 * When this event is broadcasted it means the game is ready for next question
		 */
		public static const CREATE_NEW_QUESTION:String = "CreateNewQuestion"; 
		
		/**
		 * New level is fired when the tower crossed a certain height.
		 * The bonus time is added.
		 * body: Updated DifficultyLevel after level has been updated
		 */
		public static const NEW_LEVEL:String = "NewLevel";
		
		/**
		 * body: Answered MathQuestion
		 */
		public static const ANSWER_OK:String = "AnswerOK";
		
		/**
		 * body: Answered MathQuestion
		 */
		public static const ANSWER_BAD:String = "AnswerBad";
		
		/**
		 * body: Surrendered MathQuestion
		 */
		public static const ANSWER_SURRENDER:String = "AnswerSurrender";	
		
		/**
		 * Sent when tower has increased height
		 * body: amount of height the tower is up.
		 */
		public static const GAME_TOWER_GROWS:String = "GameTowerGrows";
		
		/**
		 * Sent from proxy when tower has a new height set.
		 * body: tower height (int)
		 */
		public static const GAME_TOWER_HEIGHT_UPDATE:String = "GameTowerHeightUpdate";
		
		/**
		 * body: game time left (formatted string "0:00")
		 */
		public static const GAME_TIMER_UPDATE:String = "TimerGameUpdate";
		public static const GAME_TIMER_START:String = "GameTimerStart";
		public static const GAME_TIMER_TIME_ENDED:String = "GameTimerTimeEnded";
		
		/**
		 * Happens when user presses a number
		 * body: string with a new digit
		 */
		public static const GAME_NUM_ENTERED:String = "GameNumEntered";
		
		/**
		 * Happens when user pressed 'enter'
		 */
		public static const GAME_NUM_DONE:String = "GameNumDone";
		
		/**
		 * Happens when user pressed 'backspace'
		 */
		public static const GAME_NUM_BACK:String = "GameNumBack";
		
		public static const GAME_SEGMENT_FALLING:String = "GameSegmentFalling";
		public static const GAME_SEGMENT_PLACED:String = "GameSegmentPlaced";
		
		public static const NAVIGATION_MENU:String = "NavigationMenu";
		public static const NAVIGATION_GAME_ARCADE:String = "NavigationGameArcade";
		public static const NAVIGATION_GAME_FREEPLAY:String = "NavigationGameFreeplay";
		
		public static const GAME_NEW_ARCADE:String = "IsArc";
		public static const GAME_NEW_FREEPLAY:String = "IsFree";

		/**
		 * body: url to navigate to
		 */
		public static const NAVIGATION_URL:String = "NavigationUrl";
	}
}