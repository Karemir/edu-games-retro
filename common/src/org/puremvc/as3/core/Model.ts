import type { IProxy } from "../interfaces/IProxy.js";

export class Model {
	protected static instance: Model;
	protected proxyMap: any;

	constructor() {
		if (Model.instance != null) throw Error("Model Singleton already constructed!");
		Model.instance = this;
		this.proxyMap = [];
		this.initializeModel();
	}

	protected initializeModel(): void {}

	public static getInstance(): Model {
		if (Model.instance == null) Model.instance = new Model();
		return Model.instance;
	}

	public registerProxy(proxy: IProxy): void {
		this.proxyMap[proxy.getProxyName()] = proxy;
		proxy.onRegister();
	}

	public retrieveProxy(proxyName: string): IProxy {
		return this.proxyMap[proxyName];
	}

	public hasProxy(proxyName: string): boolean {
		return this.proxyMap[proxyName] != null;
	}

	public removeProxy(proxyName: string): IProxy {
		const proxy: IProxy = this.proxyMap[proxyName] as IProxy;
		if (proxy) {
			this.proxyMap[proxyName] = null;
			proxy.onRemove();
		}
		return proxy;
	}
}
