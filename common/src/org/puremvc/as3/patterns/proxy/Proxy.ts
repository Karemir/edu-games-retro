import type { IProxy } from "../../interfaces/IProxy.js";
import { AS3_NATIVE } from "../../../../../flash/utils/bindMethods.js";
import { Notifier } from "../observer/Notifier.js";

export class Proxy extends Notifier implements IProxy {
	static readonly [AS3_NATIVE] = true;

	public static NAME: string = "Proxy";
	protected proxyName: string;
	protected data: Object;

	constructor(proxyName: string = null, data: Object = null) {
		super();
		this.proxyName = (proxyName != null) ? proxyName : Proxy.NAME;
		if (data != null) this.setData(data);
	}

	public getProxyName(): string { return this.proxyName; }
	public setData(data: Object): void { this.data = data; }
	public getData(): Object { return this.data; }
	public onRegister(): void {}
	public onRemove(): void {}
}
