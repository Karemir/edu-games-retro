import type { ICommand } from "../interfaces/ICommand.js";
import type { INotification } from "../interfaces/INotification.js";
import { Observer } from "../patterns/observer/Observer.js";
import { View } from "./View.js";

export class Controller {
	protected static instance: Controller;
	protected view: View;
	protected commandMap: any;

	constructor() {
		if (Controller.instance != null) throw Error("Controller Singleton already constructed!");
		Controller.instance = this;
		this.commandMap = [];
		this.initializeController();
	}

	protected initializeController(): void {
		this.view = View.getInstance();
	}

	public static getInstance(): Controller {
		if (Controller.instance == null) Controller.instance = new Controller();
		return Controller.instance;
	}

	public executeCommand(note: INotification): void {
		const commandClassRef: any = this.commandMap[note.getName()];
		if (commandClassRef == null) return;
		const commandInstance: ICommand = new commandClassRef();
		commandInstance.execute(note);
	}

	public registerCommand(notificationName: string, commandClassRef: Function): void {
		if (this.commandMap[notificationName] == null) {
			this.view.registerObserver(notificationName, new Observer(this.executeCommand, this));
		}
		this.commandMap[notificationName] = commandClassRef;
	}

	public hasCommand(notificationName: string): boolean {
		return this.commandMap[notificationName] != null;
	}

	public removeCommand(notificationName: string): void {
		if (this.hasCommand(notificationName)) {
			this.view.removeObserver(notificationName, this);
			this.commandMap[notificationName] = null;
		}
	}
}
