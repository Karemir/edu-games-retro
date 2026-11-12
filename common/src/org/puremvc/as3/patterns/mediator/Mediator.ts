import type { IMediator } from "../../interfaces/IMediator.js";
import type { INotification } from "../../interfaces/INotification.js";
import { AS3_NATIVE } from "../../../../../flash/utils/bindMethods.js";
import { Notifier } from "../observer/Notifier.js";

export class Mediator extends Notifier implements IMediator {
	static readonly [AS3_NATIVE] = true;

	public static NAME: string = "Mediator";
	protected mediatorName: string;
	protected viewComponent: Object;

	constructor(mediatorName: string = null, viewComponent: Object = null) {
		super();
		this.mediatorName = (mediatorName != null) ? mediatorName : Mediator.NAME;
		this.viewComponent = viewComponent;
	}

	public getMediatorName(): string { return this.mediatorName; }
	public setViewComponent(viewComponent: Object): void { this.viewComponent = viewComponent; }
	public getViewComponent(): Object { return this.viewComponent; }
	public listNotificationInterests(): Array<any> { return []; }
	public handleNotification(notification: INotification): void {}
	public onRegister(): void {}
	public onRemove(): void {}
}
