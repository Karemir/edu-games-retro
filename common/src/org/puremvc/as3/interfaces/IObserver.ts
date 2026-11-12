import type { INotification } from "./INotification.js";

export interface IObserver {
	setNotifyMethod(notifyMethod: Function): void;
	setNotifyContext(notifyContext: Object): void;
	notifyObserver(notification: INotification): void;
	compareNotifyContext(object: Object): boolean;
}
