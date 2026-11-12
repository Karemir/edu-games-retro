import { embed } from "@edugames/common/AssetLoader.js";
import { Bitmap } from "@edugames/common/flash/display/Bitmap.js";
import type { DisplayObject } from "@edugames/common/flash/display/DisplayObject.js";
import { Loader } from "@edugames/common/flash/display/Loader.js";
import { Event } from "@edugames/common/flash/events/Event.js";
import type { ByteArray } from "@edugames/common/flash/utils/ByteArray.js";
import type { Class } from "@edugames/common/flash/utils/Class.js";

/**
 * ...
 * @author Perzak
 */
export class Content {
	private static bgImg: Class = embed("Assets/gameBg.jpg", { mimeType: "application/octet-stream" });
//	[Embed(source = "../Assets/Logo_GwK.png", mimeType = "application/octet-stream")]private static var projectLogoBmp:Class;
//	[Embed(source = "../Assets/Logo_eu.png", mimeType = "application/octet-stream")]private static var euLogoBmp:Class;
	private static bgBmp: Class = embed("Assets/MenuBg.png", { mimeType: "application/octet-stream" });
	private static leftPanelBmp: Class = embed("Assets/leftPanelBg.png", { mimeType: "application/octet-stream" });

	private static bitmaps: any; // PORT: AS3 Array used with string keys
	
	public static Init(): void {
		Content.bitmaps = [];
		Content.bitmaps["bgImg"] = Content.LoadImage(Content.bgImg);
//		bitmaps["projectLogoBmp"] = LoadImage(projectLogoBmp);
//		bitmaps["euLogoBmp"] = LoadImage(euLogoBmp);
		Content.bitmaps["bgBmp"] = Content.LoadImage(Content.bgBmp);
		Content.bitmaps["leftPanelBmp"] = Content.LoadImage(Content.leftPanelBmp);			
	}
	
	private static LoadImage(src: Class): DisplayObject {
		var bg: Loader = new Loader();
		bg.loadBytes(new src() as ByteArray);
		bg.contentLoaderInfo.addEventListener(Event.COMPLETE, function (e: Event): void { (bg.content as Bitmap).smoothing = true; } );
		return bg;
	}
	
	public static GetBmp(className: string): Bitmap {
		var ldr: Loader = Content.bitmaps[className];
		// PORT: `!ldr.content is Bitmap` is `(!ldr.content) is Bitmap` in AS3 (always false); TS has no `is`, ported as instanceof with the same precedence
		if (!ldr || (!ldr.content as any) instanceof Bitmap) {
			return null;
		}
		
		return ldr.content as Bitmap;
	}
}
