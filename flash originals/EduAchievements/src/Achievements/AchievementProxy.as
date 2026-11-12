package Achievements {
	import Achievements.Components.Popup;
	import org.puremvc.as3.interfaces.IProxy;
	import org.puremvc.as3.patterns.proxy.Proxy;
	
	/**
	 * ...
	 * @author Michal Perzak
	 */
	public class AchievementProxy extends Proxy implements IProxy {
		private var achievementList:Vector.<Achievement>;
		public static const NAME:String = "AchievementProxy";
		
		public var isLoaded:Boolean;
		public var onLoaded:Function;
		
		public function AchievementProxy() {
			achievementList = new Vector.<Achievement>();
			isLoaded = false;
			
			achievementList.push(new Achievement(1, itm_1,  "Mat wieża", "Poprawnie wykonane 10 działań pod rząd", "Złota rybka"));
			achievementList.push(new Achievement(2, itm_2,  "Mat wieża", "Poprawnie wykonane 30 działań pod rząd", "Zakręcony poślizg"));
			achievementList.push(new Achievement(3, itm_3,  "Mat wieża", "Poprawnie wykonane 50 działań (w sumie)", "Jeżyk Gagatek"));
			achievementList.push(new Achievement(4, itm_4,  "Mat wieża", "Poprawnie wykonane 100 działań (w sumie)", "Kotek Psotek"));
			achievementList.push(new Achievement(5, itm_5,  "Mat wieża", "Zbudowana wieża na 75 metrów", "Feliks Krasnal"));
			achievementList.push(new Achievement(6, itm_6,  "Mat wieża", "Zbudowana wieża na 150 metrów", "Zając Marchewka"));
			achievementList.push(new Achievement(7, itm_7,  "Mat wieża", "Wybuduj kosmiczny budynek", "Niebieska ławeczka"));
			achievementList.push(new Achievement(8, itm_8,  "Wyścigi literek", "5 poprawnie zapisanych słów pod rząd", "Czerwona ławeczka"));
			achievementList.push(new Achievement(9, itm_9,  "Wyścigi literek", "10 poprawnie zapisanych słów pod rząd", "Piesek Szarpek"));
			achievementList.push(new Achievement(10,itm_10, "Wyścigi literek", "50 poprawnie zapisanych słów (w sumie)", "Dyniek"));
			achievementList.push(new Achievement(11,itm_11, "Wyścigi literek", "100 poprawnie zapisanych słów (w sumie)", "Kaktusek Miętusek"));
			achievementList.push(new Achievement(12,itm_12, "Wyścigi literek", "wygrana w 5 wyścigach pod rząd", "Oczko wodne"));
			achievementList.push(new Achievement(13,itm_13, "Wyścigi literek", "wygrana w 10 wyścigach pod rząd", "Burak ponurak"));
			achievementList.push(new Achievement(14,itm_14, "Wyścigi literek", "wygrana w sumie w 25 wyścigach", "Żółw Ignacy"));
			achievementList.push(new Achievement(15,itm_15, "Robo", "Pokonanie 10 plansz", "Pan Kwiatkowski"));
			achievementList.push(new Achievement(16,itm_16, "Robo", "Pokonanie 30 plansz", "Bracia von Pomodore"));
			achievementList.push(new Achievement(17,itm_17, "Robo", "Pokonanie 50 plansz", "Panna Promyczek"));
			achievementList.push(new Achievement(18,itm_18, "Robo", "pokonanie 15 plansz na 3 gwiazdki", "Czerwony Kapturek"));
			achievementList.push(new Achievement(19,itm_19, "Robo", "pokonanie 30 plansz na 3 gwiazdki", "Urwis Michałek"));
			achievementList.push(new Achievement(20,itm_20, "Robo", "pokonanie 45 plansz na 3 gwiazdki", "Magiczna huśtawka"));
			achievementList.push(new Achievement(21,itm_21, "Robo", "3 gwiazdki na ostatnim poziomie", "Fontanna Życzeń"));
		}

		override public function getProxyName():String 
		{
			return NAME;
		}
		
		override public function onRegister():void {
			NetCom.instance.GardenAchievements(function(list:Vector.<int>):void {
				trace("Got " + list.length + " unlocked achievements");
				for each(var idx:int in list) {
					for each(var ach:Achievement in achievementList) {
						if (ach.achId == idx) { ach.unlocked = true; trace(ach.prizeName); }
					}
				}
				
				isLoaded = true;
				if (onLoaded != null) {
					onLoaded();
				}
				facade.sendNotification(Events.ACHIEVEMENTS_LOADED);
			} );
		}
		
		public function AddAchievement(achId:int):void {
			for each(var ach:Achievement in achievementList) {
				if (ach.achId != achId) continue;
				if (ach.unlocked) return; // this means we do not unlock whats already unlocked
				ach.unlocked = true;
				NetCom.instance.PushAchievement(achId);
				//facade.sendNotification(Events.ACHIEVEMENT_UNLOCKED, ach);
				Popup.ShowPopup(ach);
			}
		}
		
		public function GetAchievements():Vector.<Achievement> {
			var retList:Vector.<Achievement> = new Vector.<Achievement>();
			for each(var ach:Achievement in achievementList) {
				if (!ach.unlocked) continue;
				retList.push(ach);
			}
			return achievementList;
		}
		
		public function GetAchievement(achId:int):Achievement {
			for each(var ach:Achievement in achievementList) {
				if (ach.achId == achId) { return ach; }
			}
			return null;
		}
	}

}