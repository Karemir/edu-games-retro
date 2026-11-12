import { Sprite } from "@edugames/common/flash/display/Sprite.js";
import { Point } from "@edugames/common/flash/geom/Point.js";
import { setTimeout } from "@edugames/common/flash/utils/setTimeout.js";

/**
 * ...
 * @author Michal Perzak
 *
 * PORT: replaces the server of the original (ASP.NET HistoryQuestions: AchievementController and GardenController, reached over HTTP with
 * hostUrl and playerName from the FlashVars). The static site has no server, so the same five calls now read and write localStorage; the player
 * name and hostUrl are gone. All games and the garden page share the origin, so they share this state.
 *   edugames:achievements  JSON array of the unlocked achievement codes
 *   edugames:garden        JSON object { "<slotId>": rewardId }
 * Callbacks are still called asynchronously, as the HTTP responses were.
 */
export class NetCom extends Sprite {
	public static instance: NetCom;
	
	// PORT: storage keys of the localStorage replacement
	private static readonly ACHIEVEMENTS_KEY: string = "edugames:achievements";
	private static readonly GARDEN_KEY: string = "edugames:garden";
	
	constructor() {
		super();
		NetCom.instance = this;
	}
	
	public static GetInstance(): NetCom {
		return NetCom.instance;
	}
	
	public GardenPutObject(slotId: number, itemId: number): void {
		// PORT: what GardenController.SetSlot did: the same reward can sit in one slot only, the given slot is replaced
		let garden: any = NetCom.ReadGarden();
		for (const key of Object.keys(garden)) {
			if (garden[key] == itemId) delete garden[key];
		}
		garden[slotId] = itemId;
		NetCom.WriteGarden(garden);
		console.log("Net: GardenPutObject slot " + slotId + " reward " + itemId); // PORT: trace
	}
	
	public GardenClearSlot(slotId: number): void {
		let garden: any = NetCom.ReadGarden();
		delete garden[slotId];
		NetCom.WriteGarden(garden);
		console.log("Net: GardenClearSlot slot " + slotId); // PORT: trace
	}
	
	public GardenAchievements(callbackFunc: Function): void {
		let setup: number[] = NetCom.ReadAchievements(); // PORT: Vector.<int>
		setTimeout(() => callbackFunc(setup), 0);
	}
	
	public PushAchievement(achievementId: number): void {
		// PORT: what AchievementController.Set did: code 0 is rejected, a code is stored once
		if (achievementId == 0) return;
		let list: number[] = NetCom.ReadAchievements();
		if (list.indexOf(achievementId) < 0) {
			list.push(achievementId);
			NetCom.WriteAchievements(list);
		}
		console.log("Net: Achievement set " + achievementId); // PORT: trace
	}
	
	public GardenGetSetup(callbackFunc: Function): void {
		let garden: any = NetCom.ReadGarden();
		let setup: Point[] = []; // PORT: Vector.<Point>
		for (const key of Object.keys(garden)) {
			setup.push(new Point(Number(key), garden[key]));
		}
		setTimeout(() => callbackFunc(setup), 0);
	}
	
	// PORT: localStorage access, tolerant of missing, corrupt or unavailable storage
	private static ReadAchievements(): number[] {
		try {
			let data: any = JSON.parse(localStorage.getItem(NetCom.ACHIEVEMENTS_KEY));
			if (!Array.isArray(data)) return [];
			let list: number[] = [];
			for (const code of data) {
				if (typeof code == "number" && isFinite(code) && list.indexOf(code) < 0) list.push(code);
			}
			return list;
		} catch (e) {
			return [];
		}
	}
	
	private static WriteAchievements(list: number[]): void {
		try {
			localStorage.setItem(NetCom.ACHIEVEMENTS_KEY, JSON.stringify(list));
		} catch (e) {}
	}
	
	private static ReadGarden(): any {
		let garden: any = {};
		try {
			let data: any = JSON.parse(localStorage.getItem(NetCom.GARDEN_KEY));
			if (data && typeof data == "object" && !Array.isArray(data)) {
				for (const key of Object.keys(data)) {
					if (typeof data[key] == "number" && isFinite(data[key]) && isFinite(Number(key))) garden[key] = data[key];
				}
			}
		} catch (e) {}
		return garden;
	}
	
	private static WriteGarden(garden: any): void {
		try {
			localStorage.setItem(NetCom.GARDEN_KEY, JSON.stringify(garden));
		} catch (e) {}
	}
}
