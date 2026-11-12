import { Capabilities } from "@edugames/common/flash/system/Capabilities.js";

/**
 * ...
 * @author Michal Perzak
 */
export class Logger {
	constructor() {
	}
	
	public static Log(msg: Object): void {
		if (Capabilities.isDebugger) {
			console.log(typeof msg + " " + msg); // PORT: trace()
		}
	}
}
