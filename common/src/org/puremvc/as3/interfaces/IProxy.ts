export interface IProxy {
	getProxyName(): string;
	setData(data: Object): void;
	getData(): Object;
	onRegister(): void;
	onRemove(): void;
}
