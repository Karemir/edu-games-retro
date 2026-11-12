export class SharedObject {
	public data: any = {};
	private key: string;
	private saved: string = null;

	constructor(name: string) {
		this.key = "SharedObject:" + name;
		try {
			const raw = localStorage.getItem(this.key);
			if (raw) {
				this.data = JSON.parse(raw);
				this.saved = raw;
			}
		} catch (e) {
			this.data = {};
		}
	}

	private static cache: { [name: string]: SharedObject } = {};
	private static autoFlushing: boolean = false;

	public static getLocal(name: string, localPath: string = null, secure: boolean = false): SharedObject {
		if (!SharedObject.autoFlushing) SharedObject.startAutoFlush();
		return SharedObject.cache[name] || (SharedObject.cache[name] = new SharedObject(name));
	}

	/**
	 * PORT: Flash saved a shared object by itself when the SWF closed, without flush() being called (Multiply and Letters rely on it).
	 * Here every object is written when the page is hidden or closed, and once a second if its data changed.
	 */
	private static startAutoFlush(): void {
		SharedObject.autoFlushing = true;
		const flushAll = () => { for (const k of Object.keys(SharedObject.cache)) SharedObject.cache[k].flush(); };
		window.addEventListener("pagehide", flushAll);
		document.addEventListener("visibilitychange", () => { if (document.visibilityState == "hidden") flushAll(); });
		window.setInterval(flushAll, 1000);
	}

	public flush(minDiskSpace: number = 0): string {
		try {
			const raw = JSON.stringify(this.data);
			if (raw !== this.saved) {
				localStorage.setItem(this.key, raw);
				this.saved = raw;
			}
		} catch (e) {}
		return "flushed";
	}

	public clear(): void {
		this.data = {};
		this.saved = null;
		try {
			localStorage.removeItem(this.key);
		} catch (e) {}
	}
}
