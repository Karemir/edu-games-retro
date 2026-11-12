import type { ICommand } from "../../interfaces/ICommand.js";
import type { INotification } from "../../interfaces/INotification.js";
import { AS3_NATIVE } from "../../../../../flash/utils/bindMethods.js";
import { Notifier } from "../observer/Notifier.js";

export class MacroCommand extends Notifier implements ICommand {
	static readonly [AS3_NATIVE] = true;

	private subCommands: Array<any>;

	constructor() {
		super();
		this.subCommands = [];
		this.initializeMacroCommand();
	}

	protected initializeMacroCommand(): void {}

	protected addSubCommand(subCommandClassRef: Function): void {
		this.subCommands.push(subCommandClassRef);
	}

	public execute(notification: INotification): void {
		while (this.subCommands.length > 0) {
			const commandClassRef: any = this.subCommands.shift();
			const commandInstance: ICommand = new commandClassRef();
			commandInstance.execute(notification);
		}
	}
}
