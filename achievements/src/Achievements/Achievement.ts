import type { Class } from "@edugames/common/flash/utils/Class.js";

/**
 * ...
 * @author Michal Perzak
 */
export class Achievement {
	public achId: number;
	public title: string;
	public description: string;
	public prizeName: string;
	public date: string;
	public unlocked: boolean;
	public contentClass: Class;
	
	constructor(achId: number, contentClass: Class, title: string = null, description: string = null, prizeName: string = null, date: string = null) {
		this.unlocked = false;
		this.achId = achId;
		this.title = title;
		this.description = description;
		this.date = date;
		this.contentClass = contentClass;
		this.prizeName = prizeName;
	}
}
