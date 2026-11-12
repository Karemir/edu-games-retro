package  {
	/**
	 * ...
	 * @author Michal Perzak
	 */
	public class Events {
		/**
		 * Start downloading a set of questions from the server
		 */
		public static const QUESTIONS_PREPARE_BEGIN:String = "QuestionsLoadStart";
		/**
		 * All question data is loaded. Images may now be downloaded
		 */
		public static const QUESTIONS_PREPARED:String = "QuestionsLoaded";
		
		/**
		 * All images loaded for questions.
		 */
		public static const QUESTIONS_IMAGES_LOADED:String = "QuestionsImagesLoaded";
		
		/**
		 * An error ocurred while downloading the questions.
		 * Body: string with reason.
		 */
		public static const QUESTIONS_ERROR:String = "QuestionsError";
		
		/**
		 * Next question should be shown
		 */
		public static const QUESTION_NEXT:String = "QuestionNext";
		/**
		 * Question answered results are shown
		 */
		public static const QUESTION_RESULT:String = "QuestionRes";
		/**
		 * All questions are answered, and game is ended.
		 */
		public static const QUESTIONS_DONE:String = "QuestionsDone";
		
		public static const TIMER_END:String = "TimerEnd";
		public static const TIMER_START:String = "TimerStart";
		/**
		 * When user selects difficulty for the new game
		 * body: int with dif.
		 */
		public static const MENU_DIF:String = "MenuDiff";
		/**
		 * When user selects epoch for the new game
		 * body: int with epoch.
		 */
		public static const MENU_EPOCH:String = "MenuEpoch";
		public static const MENU_MODE:String = "GameMode";
		
		public static const NAVI_SHOW_SPLASH:String = "ShowSplashScreen";
		public static const NAVI_SHOW_MENU:String = "ShowMenu";
		public static const NAVI_START_GAME:String = "StartGame";
				
		/**
		 * player pressed a keyboard key. body: keycode.
		 */
		public static const KEY_PRESS:String = "KeyWasPressed";
		
		/**
		 * body: url to navigate to
		 */
		public static const NAVIGATION_URL:String = "NavigationUrl";

	}

}