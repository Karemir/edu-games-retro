import type { IFacade } from "../../interfaces/IFacade.js";
import type { INotifier } from "../../interfaces/INotifier.js";
import { AS3_NATIVE, bindMethods } from "../../../../../flash/utils/bindMethods.js";
import { Facade } from "../facade/Facade.js";

export class Notifier implements INotifier {
	static readonly [AS3_NATIVE] = true;

	protected facade: IFacade = Facade.getInstance();

	constructor() {
		bindMethods(this, new.target);
	}

	public sendNotification(notificationName: string, body: Object = null, type: string = null): void {
		this.facade.sendNotification(notificationName, body, type);
	}
}
