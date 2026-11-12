import type { INotification } from "../../interfaces/INotification.js";

export class Notification implements INotification {
	private name: string;
	private body: Object;
	private type: string;

	constructor(name: string, body: Object = null, type: string = null) {
		this.name = name;
		this.body = body;
		this.type = type;
	}

	public getName(): string { return this.name; }
	public setBody(body: Object): void { this.body = body; }
	public getBody(): Object { return this.body; }
	public setType(type: string): void { this.type = type; }
	public getType(): string { return this.type; }

	public toString(): string {
		let msg: string = "Notification Name: " + this.getName();
		msg += "\nBody:" + ((this.body == null) ? "null" : this.body.toString());
		msg += "\nType:" + ((this.type == null) ? "null" : this.type);
		return msg;
	}
}
