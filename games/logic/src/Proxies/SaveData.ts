//import Achievements.AchievementProxy; // PORT: achievements TODO
import { SharedObject } from "@edugames/common/flash/net/SharedObject.js";
import type { IProxy } from "@edugames/common/org/puremvc/as3/interfaces/IProxy.js";
import { Proxy } from "@edugames/common/org/puremvc/as3/patterns/proxy/Proxy.js";

/**
 * ...
 * @author ...
 */
export class SaveData extends Proxy implements IProxy
{
	public static readonly NAME: string = "SaveData";
	
	public static readonly LEVEL_NOT_COMPLETED: number = 0;
	public static readonly LEVEL_1_STAR: number = 1;
	public static readonly LEVEL_2_STAR: number = 2;
	public static readonly LEVEL_3_STAR: number = 3;
	
	private sharedObj: SharedObject;
	
	constructor()
	{
		super();
		this.sharedObj = SharedObject.getLocal("robogame");
		if (!this.sharedObj.data.levels) {
			this.sharedObj.data.levels = [];
		}
	}
	
	public GetLevelStatus(levelId: number): number
	{
		var dt: Array<any> = this.sharedObj.data.levels;
		if(!dt){
			return SaveData.LEVEL_NOT_COMPLETED;
		} else {
			return (Number(dt[levelId]) | 0); // PORT: int() -> | 0
		}
	}
	
	public SetLevelStatus(levelId: number, status: number): void {
		this.sharedObj.data.levels[levelId] = status;
		this.sharedObj.flush();
	}
	
	public getProxyName(): string
	{
		return SaveData.NAME;
	}
}
