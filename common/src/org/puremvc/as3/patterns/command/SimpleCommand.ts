import type { ICommand } from "../../interfaces/ICommand.js";
import type { INotification } from "../../interfaces/INotification.js";
import { AS3_NATIVE } from "../../../../../flash/utils/bindMethods.js";
import { Notifier } from "../observer/Notifier.js";

export class SimpleCommand extends Notifier implements ICommand {
	static readonly [AS3_NATIVE] = true;

	public execute(notification: INotification): void {}
}
