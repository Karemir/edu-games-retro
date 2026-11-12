export interface INotifier {
	sendNotification(notificationName: string, body?: Object, type?: string): void;
}
