import type { INotification } from "./INotification.js";

export interface IMediator {
	getMediatorName(): string;
	getViewComponent(): Object;
	setViewComponent(viewComponent: Object): void;
	listNotificationInterests(): Array<any>;
	handleNotification(notification: INotification): void;
	onRegister(): void;
	onRemove(): void;
}
