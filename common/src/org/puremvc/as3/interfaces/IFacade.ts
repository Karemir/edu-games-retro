import type { IMediator } from "./IMediator.js";
import type { INotifier } from "./INotifier.js";
import type { IProxy } from "./IProxy.js";

export interface IFacade extends INotifier {
	registerProxy(proxy: IProxy): void;
	retrieveProxy(proxyName: string): IProxy;
	removeProxy(proxyName: string): IProxy;
	hasProxy(proxyName: string): boolean;
	registerCommand(notificationName: string, commandClassRef: Function): void;
	removeCommand(notificationName: string): void;
	hasCommand(notificationName: string): boolean;
	registerMediator(mediator: IMediator): void;
	retrieveMediator(mediatorName: string): IMediator;
	removeMediator(mediatorName: string): IMediator;
	hasMediator(mediatorName: string): boolean;
	notifyObservers(notification: any): void;
}
