import type { IProxy } from "@edugames/common/org/puremvc/as3/interfaces/IProxy.js";
import { Proxy } from "@edugames/common/org/puremvc/as3/patterns/proxy/Proxy.js";

/**
 * ...
 * @author Michal Perzak
 */
export class HighscoreProxy extends Proxy implements IProxy {
	public static readonly NAME: string = "HighscoreProxy";
	
	public menuId: number;
	public investmentId: number;
	public pageId: number;
	
	private _galleryId: number;
	private _dualBotGalleryId: number;
	
	constructor() {
		super();
		this.dualBotGalleryId = -1;
		this.galleryId = -1;
	}
	
	public getProxyName(): string {
		return HighscoreProxy.NAME;
	}
	
	/* FOR DEBUGGING */
	
	public get galleryId(): number {
		return this._galleryId;
	}
	
	public set galleryId(value: number) {
		this._galleryId = value;
	}
	
	public get dualBotGalleryId(): number {
		return this._dualBotGalleryId;
	}
	
	public set dualBotGalleryId(value: number) {
		this._dualBotGalleryId = value;
	}
}
