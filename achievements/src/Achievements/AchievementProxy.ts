import type { IProxy } from "@edugames/common/org/puremvc/as3/interfaces/IProxy.js";
import { Proxy } from "@edugames/common/org/puremvc/as3/patterns/proxy/Proxy.js";
import { Achievement } from "./Achievement.js";
import { Popup } from "./Components/Popup.js";
import { Events } from "./Events.js";
import { itm_1, itm_2, itm_3, itm_4, itm_5, itm_6, itm_7, itm_8, itm_9, itm_10, itm_11, itm_12, itm_13, itm_14, itm_15, itm_16, itm_17, itm_18, itm_19, itm_20, itm_21 } from "./Items.js";
import { NetCom } from "./NetCom.js";

/**
 * ...
 * @author Michal Perzak
 */
export class AchievementProxy extends Proxy implements IProxy {
	private achievementList: Achievement[]; // PORT: Vector.<Achievement>
	public static readonly NAME: string = "AchievementProxy";
	
	public isLoaded: boolean;
	public onLoaded: Function;
	
	constructor() {
		super();
		this.achievementList = [];
		this.isLoaded = false;
		
		this.achievementList.push(new Achievement(1, itm_1, "Mat wieża", "Poprawnie wykonane 10 działań pod rząd", "Złota rybka"));
		this.achievementList.push(new Achievement(2, itm_2, "Mat wieża", "Poprawnie wykonane 30 działań pod rząd", "Zakręcony poślizg"));
		this.achievementList.push(new Achievement(3, itm_3, "Mat wieża", "Poprawnie wykonane 50 działań (w sumie)", "Jeżyk Gagatek"));
		this.achievementList.push(new Achievement(4, itm_4, "Mat wieża", "Poprawnie wykonane 100 działań (w sumie)", "Kotek Psotek"));
		this.achievementList.push(new Achievement(5, itm_5, "Mat wieża", "Zbudowana wieża na 75 metrów", "Feliks Krasnal"));
		this.achievementList.push(new Achievement(6, itm_6, "Mat wieża", "Zbudowana wieża na 150 metrów", "Zając Marchewka"));
		this.achievementList.push(new Achievement(7, itm_7, "Mat wieża", "Wybuduj kosmiczny budynek", "Niebieska ławeczka"));
		this.achievementList.push(new Achievement(8, itm_8, "Wyścigi literek", "5 poprawnie zapisanych słów pod rząd", "Czerwona ławeczka"));
		this.achievementList.push(new Achievement(9, itm_9, "Wyścigi literek", "10 poprawnie zapisanych słów pod rząd", "Piesek Szarpek"));
		this.achievementList.push(new Achievement(10, itm_10, "Wyścigi literek", "50 poprawnie zapisanych słów (w sumie)", "Dyniek"));
		this.achievementList.push(new Achievement(11, itm_11, "Wyścigi literek", "100 poprawnie zapisanych słów (w sumie)", "Kaktusek Miętusek"));
		this.achievementList.push(new Achievement(12, itm_12, "Wyścigi literek", "wygrana w 5 wyścigach pod rząd", "Oczko wodne"));
		this.achievementList.push(new Achievement(13, itm_13, "Wyścigi literek", "wygrana w 10 wyścigach pod rząd", "Burak ponurak"));
		this.achievementList.push(new Achievement(14, itm_14, "Wyścigi literek", "wygrana w sumie w 25 wyścigach", "Żółw Ignacy"));
		this.achievementList.push(new Achievement(15, itm_15, "Robo", "Pokonanie 10 plansz", "Pan Kwiatkowski"));
		this.achievementList.push(new Achievement(16, itm_16, "Robo", "Pokonanie 30 plansz", "Bracia von Pomodore"));
		this.achievementList.push(new Achievement(17, itm_17, "Robo", "Pokonanie 50 plansz", "Panna Promyczek"));
		this.achievementList.push(new Achievement(18, itm_18, "Robo", "pokonanie 15 plansz na 3 gwiazdki", "Czerwony Kapturek"));
		this.achievementList.push(new Achievement(19, itm_19, "Robo", "pokonanie 30 plansz na 3 gwiazdki", "Urwis Michałek"));
		this.achievementList.push(new Achievement(20, itm_20, "Robo", "pokonanie 45 plansz na 3 gwiazdki", "Magiczna huśtawka"));
		this.achievementList.push(new Achievement(21, itm_21, "Robo", "3 gwiazdki na ostatnim poziomie", "Fontanna Życzeń"));
	}

	public getProxyName(): string 
	{
		return AchievementProxy.NAME;
	}
	
	public onRegister(): void {
		NetCom.instance.GardenAchievements((list: number[]): void => { // PORT: Vector.<int>, arrow function (uses members)
			console.log("Got " + list.length + " unlocked achievements"); // PORT: trace
			for (const idx of list) {
				for (const ach of this.achievementList) {
					if (ach.achId == idx) { ach.unlocked = true; console.log(ach.prizeName); } // PORT: trace
				}
			}
			
			this.isLoaded = true;
			if (this.onLoaded != null) {
				this.onLoaded();
			}
			this.facade.sendNotification(Events.ACHIEVEMENTS_LOADED);
		} );
	}
	
	public AddAchievement(achId: number): void {
		for (const ach of this.achievementList) {
			if (ach.achId != achId) continue;
			if (ach.unlocked) return; // this means we do not unlock whats already unlocked
			ach.unlocked = true;
			NetCom.instance.PushAchievement(achId);
			//facade.sendNotification(Events.ACHIEVEMENT_UNLOCKED, ach);
			Popup.ShowPopup(ach);
		}
	}
	
	public GetAchievements(): Achievement[] { // PORT: Vector.<Achievement>
		let retList: Achievement[] = [];
		for (const ach of this.achievementList) {
			if (!ach.unlocked) continue;
			retList.push(ach);
		}
		return this.achievementList;
	}
	
	public GetAchievement(achId: number): Achievement {
		for (const ach of this.achievementList) {
			if (ach.achId == achId) { return ach; }
		}
		return null;
	}
}
