import type { IMediator } from "../interfaces/IMediator.js";
import type { INotification } from "../interfaces/INotification.js";
import type { IObserver } from "../interfaces/IObserver.js";
import { Observer } from "../patterns/observer/Observer.js";

export class View {
	protected static instance: View;
	protected mediatorMap: any;
	protected observerMap: any;

	constructor() {
		if (View.instance != null) throw Error("View Singleton already constructed!");
		View.instance = this;
		this.mediatorMap = [];
		this.observerMap = [];
		this.initializeView();
	}

	public static getInstance(): View {
		if (View.instance == null) View.instance = new View();
		return View.instance;
	}

	protected initializeView(): void {}

	public registerObserver(notificationName: string, observer: IObserver): void {
		const observers: Array<any> = this.observerMap[notificationName];
		if (observers) {
			observers.push(observer);
		} else {
			this.observerMap[notificationName] = [observer];
		}
	}

	public notifyObservers(notification: INotification): void {
		if (this.observerMap[notification.getName()] != null) {
			const observers_ref: Array<any> = this.observerMap[notification.getName()];
			const observers: Array<any> = [];
			let observer: IObserver;
			for (let i = 0; i < observers_ref.length; i++) {
				observer = observers_ref[i];
				observers.push(observer);
			}
			for (let i = 0; i < observers.length; i++) {
				observer = observers[i];
				observer.notifyObserver(notification);
			}
		}
	}

	public removeObserver(notificationName: string, notifyContext: Object): void {
		const observers: Array<any> = this.observerMap[notificationName];
		for (let i = 0; i < observers.length; i++) {
			if (observers[i].compareNotifyContext(notifyContext) == true) {
				observers.splice(i, 1);
				break;
			}
		}
		if (observers.length == 0) delete this.observerMap[notificationName];
	}

	public registerMediator(mediator: IMediator): void {
		if (this.mediatorMap[mediator.getMediatorName()] != null) return;
		this.mediatorMap[mediator.getMediatorName()] = mediator;
		const interests: Array<any> = mediator.listNotificationInterests();
		if (interests.length > 0) {
			const observer: IObserver = new Observer(mediator.handleNotification, mediator);
			for (let i = 0; i < interests.length; i++) {
				this.registerObserver(interests[i], observer);
			}
		}
		mediator.onRegister();
	}

	public retrieveMediator(mediatorName: string): IMediator {
		return this.mediatorMap[mediatorName];
	}

	public removeMediator(mediatorName: string): IMediator {
		const mediator: IMediator = this.mediatorMap[mediatorName];
		if (mediator) {
			const interests: Array<any> = mediator.listNotificationInterests();
			for (let i = 0; i < interests.length; i++) {
				this.removeObserver(interests[i], mediator);
			}
			delete this.mediatorMap[mediatorName];
			mediator.onRemove();
		}
		return mediator;
	}

	public hasMediator(mediatorName: string): boolean {
		return this.mediatorMap[mediatorName] != null;
	}
}
