export interface INotification {
	getName(): string;
	setBody(body: Object): void;
	getBody(): Object;
	setType(type: string): void;
	getType(): string;
	toString(): string;
}
