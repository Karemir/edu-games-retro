export class SharedObject {
	public data: any = {};
	private key: string;

	constructor(name: string) {
		this.key = "SharedObject:" + name;
		try {
			const raw = localStorage.getItem(this.key);
			if (raw) this.data = JSON.parse(raw);
		} catch (e) {
			this.data = {};
		}
	}

	private static cache: { [name: string]: SharedObject } = {};

	public static getLocal(name: string, localPath: string = null, secure: boolean = false): SharedObject {
		return SharedObject.cache[name] || (SharedObject.cache[name] = new SharedObject(name));
	}

	public flush(minDiskSpace: number = 0): string {
		try {
			localStorage.setItem(this.key, JSON.stringify(this.data));
		} catch (e) {}
		return "flushed";
	}

	public clear(): void {
		this.data = {};
		try {
			localStorage.removeItem(this.key);
		} catch (e) {}
	}
}
