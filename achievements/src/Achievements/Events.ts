/**
 * ...
 * @author Michal Perzak
 */
export class Events {
	/**
	 * Sent by the game to notify which achievement was unlocked by the user
	 * body: id of the achievement
	 */
	public static readonly ACHIEVEMENT_UNLOCKED: string = "AchievementUnlocked";
	
	/**
	 * Broadcast when achievementProxy successfully loads data from server. Before this time garden cannot be shown
	 */
	public static readonly ACHIEVEMENTS_LOADED: string = "AchievementLoaded";
	
	/**
	 * When users points to a prize in the drawer. body: pointed gardenItem
	 */
	public static readonly ACHIEVEMENT_DESC_SHOW: string = "AchievementDesc";
	public static readonly ACHIEVEMENT_DESC_HIDE: string = "AchievementHide";
	
	/**
	 * Broadcast when user wants to buy a new garden item. Body is itemId:int
	 */
	public static readonly GARDEN_ITEM_BUY: string = "GardenItemBuy";
	
	/**
	 * Closes garden screen.
	 */
	public static readonly GARDEN_EXIT: string = "GardenExit";
	
	/**
	 * Happens when user drags item out of the sidebar.
	 * body: dragged movieclip
	 */
	public static readonly GARDEN_START_DRAG: string = "GardenStartDrag";
}
