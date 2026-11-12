import type { INotification } from "../../interfaces/INotification.js";
import type { IObserver } from "../../interfaces/IObserver.js";

export class Observer implements IObserver {
	private notify: Function;
	private context: Object;

	constructor(notifyMethod: Function, notifyContext: Object) {
		this.setNotifyMethod(notifyMethod);
		this.setNotifyContext(notifyContext);
	}

	public setNotifyMethod(notifyMethod: Function): void { this.notify = notifyMethod; }
	public setNotifyContext(notifyContext: Object): void { this.context = notifyContext; }
	private getNotifyMethod(): Function { return this.notify; }
	private getNotifyContext(): Object { return this.context; }

	public notifyObserver(notification: INotification): void {
		this.getNotifyMethod().apply(this.getNotifyContext(), [notification]);
	}

	public compareNotifyContext(object: Object): boolean {
		return object === this.context;
	}
}
