import { AssetLoader } from "../../AssetLoader.js";
import { Event } from "../events/Event.js";
import { IOErrorEvent } from "../events/IOErrorEvent.js";
import type { URLRequest } from "../net/URLRequest.js";
import type { ByteArray } from "../utils/ByteArray.js";
import { AS3_NATIVE } from "../utils/bindMethods.js";
import { Bitmap } from "./Bitmap.js";
import { BitmapData, BitmapSource } from "./BitmapData.js";
import type { DisplayObject } from "./DisplayObject.js";
import { DisplayObjectContainer } from "./DisplayObjectContainer.js";
import { LoaderInfo } from "./LoaderInfo.js";

/**
 * Decodes images only (no SWF loading). `content` is null until the asynchronous COMPLETE, as in Flash.
 * All work is tracked by the central AssetLoader so it shows up in the loading progress.
 */
export class Loader extends DisplayObjectContainer {
	static readonly [AS3_NATIVE] = true;

	public contentLoaderInfo: LoaderInfo = new LoaderInfo();
	private _content: DisplayObject = null;

	constructor() {
		super();
		this.contentLoaderInfo.loader = this;
	}

	public get content(): DisplayObject { return this._content; }

	public loadBytes(bytes: ByteArray): void {
		const entry = bytes.asset;
		const decode: Promise<BitmapSource> = entry && entry.image
			? Promise.resolve(entry.image)
			: createImageBitmap(new Blob([bytes.data as BlobPart]));
		this.finish(decode);
	}

	public load(request: URLRequest): void {
		this.contentLoaderInfo.url = request.url;
		this.finish(AssetLoader.fetchImage(request.url));
	}

	private finish(source: Promise<BitmapSource>): void {
		AssetLoader.track(source.then(src => {
			this.unload();
			this._content = new Bitmap(BitmapData.fromSource(src));
			this.contentLoaderInfo.content = this._content;
			this.contentLoaderInfo.width = src.width;
			this.contentLoaderInfo.height = src.height;
			this.addChild(this._content);
			this.contentLoaderInfo.dispatchEvent(new Event(Event.COMPLETE));
		}, err => {
			this.contentLoaderInfo.dispatchEvent(new IOErrorEvent(IOErrorEvent.IO_ERROR, false, false, String(err)));
		}));
	}

	public unload(): void {
		if (this._content) {
			this.removeChild(this._content);
			this._content = null;
			this.contentLoaderInfo.content = null;
		}
	}
}
