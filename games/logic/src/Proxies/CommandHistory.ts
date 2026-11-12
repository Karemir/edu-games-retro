import type { RoboCommand } from "../Game/RoboCommand.js";
import type { IProxy } from "@edugames/common/org/puremvc/as3/interfaces/IProxy.js";
import { Proxy } from "@edugames/common/org/puremvc/as3/patterns/proxy/Proxy.js";

/**
 * ...
 * @author Michal Perzak
 */
export class CommandHistory extends Proxy implements IProxy {
	public static readonly NAME: string = "CommandHistoryProxy";
	
	public storedLevel: number = 0; // PORT: int default
	public commands: RoboCommand[]; // PORT: Vector.<RoboCommand>
	
	constructor() {
		super();
		this.commands = [];
	}
	
	public StoreCommands(coms: RoboCommand[], level: number): void {
		this.commands = coms.concat();
		this.storedLevel = level;
	}
	
	public GetCommands(level: number): RoboCommand[] {
		if (this.storedLevel == level) {
			return this.commands;
		} else {
			return [];
		}
	}
	
	public getProxyName(): string {
		return CommandHistory.NAME;
	}
	
	
}
