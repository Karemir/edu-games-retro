import { EventDispatcher } from "../events/EventDispatcher.js";
import { AS3_NATIVE } from "../utils/bindMethods.js";
import type { DisplayObject } from "./DisplayObject.js";

export class LoaderInfo extends EventDispatcher {
	static readonly [AS3_NATIVE] = true;

	public bytesLoaded: number = 0;
	public bytesTotal: number = 0;
	public content: DisplayObject = null;
	public loader: any = null;
	public url: string = null;
	public width: number = 0;
	public height: number = 0;
	public parameters: any = {};
}
