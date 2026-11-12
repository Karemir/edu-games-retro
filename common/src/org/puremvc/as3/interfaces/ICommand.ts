import type { INotification } from "./INotification.js";
import type { INotifier } from "./INotifier.js";

export interface ICommand extends INotifier {
	execute(notification: INotification): void;
}
