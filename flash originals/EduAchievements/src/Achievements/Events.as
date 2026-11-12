package Achievements {
	/**
	 * ...
	 * @author Michal Perzak
	 */
	public class Events {
		/**
		 * Sent by the game to notify which achievement was unlocked by the user
		 * body: id of the achievement
		 */
		public static const ACHIEVEMENT_UNLOCKED:String = "AchievementUnlocked";
		
		/**
		 * Broadcast when achievementProxy successfully loads data from server. Before this time garden cannot be shown
		 */
		public static const ACHIEVEMENTS_LOADED:String = "AchievementLoaded";
		
		/**
		 * When users points to a prize in the drawer. body: pointed gardenItem
		 */
		public static const ACHIEVEMENT_DESC_SHOW:String = "AchievementDesc";
		public static const ACHIEVEMENT_DESC_HIDE:String = "AchievementHide";
		
		/**
		 * Broadcast when user wants to buy a new garden item. Body is itemId:int
		 */
		public static const GARDEN_ITEM_BUY:String = "GardenItemBuy";
		
		/**
		 * Closes garden screen.
		 */
		public static const GARDEN_EXIT:String = "GardenExit";
		
		/**
		 * Happens when user drags item out of the sidebar.
		 * body: dragged movieclip
		 */
		public static const GARDEN_START_DRAG:String = "GardenStartDrag";
	}

}