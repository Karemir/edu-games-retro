import { Bitmap } from "./flash/display/Bitmap.js";
import { BitmapData } from "./flash/display/BitmapData.js";
import { Font } from "./flash/text/Font.js";
import { Sound } from "./flash/media/Sound.js";
import type { Class } from "./flash/utils/Class.js";
import { ByteArray } from "./flash/utils/ByteArray.js";

/** The options of AS3's `[Embed(...)]` that matter in the browser. */
export interface EmbedOptions {
	mimeType?: string;
	fontName?: string;
	fontFamily?: string;
	fontStyle?: string;
	fontWeight?: string;
}

type Kind = "image" | "bytes" | "sound" | "font";

/** One registered asset. `image`, `bytes`, `audio` are filled in once loading has finished. */
export class AssetEntry {
	public image: ImageBitmap = null;
	public bytes: ArrayBuffer = null;
	public audio: AudioBuffer = null;
	public error: any = null;

	constructor(public url: string, public kind: Kind, public options: EmbedOptions) {}

	/** What `new EmbeddedClass()` returns in AS3. */
	public instantiate(): any {
		switch (this.kind) {
			case "image": return new Bitmap(BitmapData.fromSource(this.image));
			case "bytes": {
				const ba = new ByteArray(new Uint8Array(this.bytes));
				ba.asset = this;
				return ba;
			}
			case "sound": {
				const s = new Sound();
				s.buffer = this.audio;
				return s;
			}
			case "font": return new Font();
		}
	}
}

/**
 * Central place every [Embed] and Loader goes through. Counts all pending work so the main screen
 * can show progress; `complete` flips once everything registered so far has settled.
 */
export class AssetLoader {
	public static total: number = 0;
	public static done: number = 0;
	public static failed: number = 0;

	private static entries: AssetEntry[] = [];
	private static progressListeners: Function[] = [];
	private static errorListeners: Function[] = [];
	private static completeWaiters: Function[] = [];
	private static _audio: AudioContext = null;

	public static get complete(): boolean { return AssetLoader.done == AssetLoader.total; }

	public static get audioContext(): AudioContext {
		if (!AssetLoader._audio) AssetLoader._audio = new AudioContext();
		return AssetLoader._audio;
	}

	public static onProgress(listener: (loaded: number, total: number) => void): void { AssetLoader.progressListeners.push(listener); }
	public static onError(listener: (url: string, error: any) => void): void { AssetLoader.errorListeners.push(listener); }

	public static whenComplete(): Promise<void> {
		if (AssetLoader.complete) return Promise.resolve();
		return new Promise(resolve => AssetLoader.completeWaiters.push(resolve));
	}

	/** Counts a pending promise toward the progress. Never rejects. */
	public static track<T>(p: Promise<T>, label: string = ""): Promise<T> {
		AssetLoader.total++;
		AssetLoader.changed();
		return p.then(v => v, err => {
			AssetLoader.failed++;
			for (const l of AssetLoader.errorListeners) l(label, err);
			return undefined as T;
		}).then(v => {
			AssetLoader.done++;
			AssetLoader.changed();
			return v;
		});
	}

	private static changed(): void {
		for (const l of AssetLoader.progressListeners) l(AssetLoader.done, AssetLoader.total);
		if (AssetLoader.complete) {
			const w = AssetLoader.completeWaiters;
			AssetLoader.completeWaiters = [];
			for (const r of w) r();
		}
	}

	public static register(url: string, options: EmbedOptions = {}): AssetEntry {
		const ext = (url.split("?")[0].split(".").pop() || "").toLowerCase();
		const isImage = ["png", "jpg", "jpeg", "gif", "webp"].indexOf(ext) >= 0;
		let kind: Kind;
		if (options.mimeType == "application/octet-stream") kind = "bytes";
		else if (options.mimeType == "application/x-font" || ["otf", "ttf", "woff", "woff2"].indexOf(ext) >= 0) kind = "font";
		else if (["mp3", "wav", "ogg"].indexOf(ext) >= 0) kind = "sound";
		else kind = "image";
		const entry = new AssetEntry(url, kind, options);
		AssetLoader.entries.push(entry);
		AssetLoader.track(AssetLoader.load(entry, isImage), url);
		return entry;
	}

	private static async load(entry: AssetEntry, isImage: boolean): Promise<void> {
		const res = await fetch(entry.url);
		if (!res.ok) throw new Error(res.status + " " + entry.url);
		switch (entry.kind) {
			case "font": {
				const name = entry.options.fontName || entry.options.fontFamily;
				const face = new FontFace(name, await res.arrayBuffer(), { style: entry.options.fontStyle, weight: entry.options.fontWeight });
				(document.fonts as any).add(await face.load());
				break;
			}
			case "sound":
				entry.audio = await AssetLoader.audioContext.decodeAudioData(await res.arrayBuffer());
				break;
			case "bytes":
				entry.bytes = await res.arrayBuffer();
				// decoded now so Loader.loadBytes can complete without extra latency
				if (isImage) entry.image = await createImageBitmap(new Blob([entry.bytes]));
				break;
			default:
				entry.image = await createImageBitmap(await res.blob());
		}
	}

	public static async fetchImage(url: string): Promise<ImageBitmap> {
		const res = await fetch(url);
		if (!res.ok) throw new Error(res.status + " " + url);
		return createImageBitmap(await res.blob());
	}
}

/**
 * PORT: replacement for `[Embed(source="...")] var x:Class`. Registers the file with the AssetLoader and returns
 * a class whose instances behave like the Flash embed (Bitmap, ByteArray, Sound or Font by type).
 * Must run at module load (static field), so every embed is known before the preload finishes.
 */
export function embed(source: string, options: EmbedOptions = {}): Class {
	const entry = AssetLoader.register(source, options);
	return class EmbeddedAsset {
		constructor() {
			return entry.instantiate();
		}
	} as any;
}
