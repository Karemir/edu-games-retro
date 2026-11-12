import { DisplayObject } from "./DisplayObject.js";

export class InteractiveObject extends DisplayObject {
	public mouseEnabled: boolean = true;
	public tabEnabled: boolean = false;
	public tabIndex: number = -1;
	public focusRect: any = null;
	public doubleClickEnabled: boolean = false;
}
