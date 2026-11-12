import { Controller } from "../../core/Controller.js";
import { Model } from "../../core/Model.js";
import { View } from "../../core/View.js";
import type { IFacade } from "../../interfaces/IFacade.js";
import type { IMediator } from "../../interfaces/IMediator.js";
import type { INotification } from "../../interfaces/INotification.js";
import type { IProxy } from "../../interfaces/IProxy.js";
import { Notification } from "../observer/Notification.js";

export class Facade implements IFacade {
	protected model: Model;
	protected view: View;
	protected controller: Controller;
	protected static instance: IFacade;

	constructor() {
		if (Facade.instance != null) throw Error("Facade Singleton already constructed!");
		Facade.instance = this;
		this.initializeFacade();
	}

	protected initializeFacade(): void {
		this.initializeModel();
		this.initializeController();
		this.initializeView();
	}

	public static getInstance(): IFacade {
		if (Facade.instance == null) Facade.instance = new Facade();
		return Facade.instance;
	}

	protected initializeController(): void {
		if (this.controller != null) return;
		this.controller = Controller.getInstance();
	}

	protected initializeModel(): void {
		if (this.model != null) return;
		this.model = Model.getInstance();
	}

	protected initializeView(): void {
		if (this.view != null) return;
		this.view = View.getInstance();
	}

	public registerCommand(notificationName: string, commandClassRef: Function): void { this.controller.registerCommand(notificationName, commandClassRef); }
	public removeCommand(notificationName: string): void { this.controller.removeCommand(notificationName); }
	public hasCommand(notificationName: string): boolean { return this.controller.hasCommand(notificationName); }
	public registerProxy(proxy: IProxy): void { this.model.registerProxy(proxy); }
	public retrieveProxy(proxyName: string): IProxy { return this.model.retrieveProxy(proxyName); }
	public removeProxy(proxyName: string): IProxy {
		let proxy: IProxy;
		if (this.model != null) proxy = this.model.removeProxy(proxyName);
		return proxy;
	}
	public hasProxy(proxyName: string): boolean { return this.model.hasProxy(proxyName); }
	public registerMediator(mediator: IMediator): void { if (this.view != null) this.view.registerMediator(mediator); }
	public retrieveMediator(mediatorName: string): IMediator { return this.view.retrieveMediator(mediatorName) as IMediator; }
	public removeMediator(mediatorName: string): IMediator {
		let mediator: IMediator;
		if (this.view != null) mediator = this.view.removeMediator(mediatorName);
		return mediator;
	}
	public hasMediator(mediatorName: string): boolean { return this.view.hasMediator(mediatorName); }

	public sendNotification(notificationName: string, body: Object = null, type: string = null): void {
		this.notifyObservers(new Notification(notificationName, body, type));
	}

	public notifyObservers(notification: INotification): void {
		if (this.view != null) this.view.notifyObservers(notification);
	}
}
