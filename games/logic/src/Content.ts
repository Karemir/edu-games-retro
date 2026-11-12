import { embed } from "@edugames/common/AssetLoader.js";
import { Bitmap } from "@edugames/common/flash/display/Bitmap.js";
import { Loader } from "@edugames/common/flash/display/Loader.js";
import { Event } from "@edugames/common/flash/events/Event.js";
import type { ByteArray } from "@edugames/common/flash/utils/ByteArray.js";
import type { Class } from "@edugames/common/flash/utils/Class.js";

/**
 * ...
 * @author Perzka Michalowy
 */
export class Content
{
	// PORT: [Embed] fields registered with the AssetLoader, paths relative to index.html
	private static execute: Class = embed("Assets/R_execute.png", { mimeType: "application/octet-stream" });
	private static forwardBlack: Class = embed("Assets/R_forwardBlack.png", { mimeType: "application/octet-stream" });
	private static forwardGray: Class = embed("Assets/R_forwardGray.png", { mimeType: "application/octet-stream" });
	private static rotateLeftBlack: Class = embed("Assets/R_rotateLeftBlack.png", { mimeType: "application/octet-stream" });
	private static rotateLeftGray: Class = embed("Assets/R_rotateLeftGray.png", { mimeType: "application/octet-stream" });
	private static rotateRightBlack: Class = embed("Assets/R_rotateRightBlack.png", { mimeType: "application/octet-stream" });
	private static rotateRightGray: Class = embed("Assets/R_rotateRightGray.png", { mimeType: "application/octet-stream" });
	private static useBlack: Class = embed("Assets/R_useBlack.png", { mimeType: "application/octet-stream" });
	private static useGray: Class = embed("Assets/R_useGray.png", { mimeType: "application/octet-stream" });
	private static gameUiBg: Class = embed("Assets/gameUiBg.png", { mimeType: "application/octet-stream" });
	private static gameBg: Class = embed("Assets/gameBg.png", { mimeType: "application/octet-stream" });
	private static bgBmp: Class = embed("Assets/MenuBg.jpg", { mimeType: "application/octet-stream" });
	private static fan: Class = embed("Assets/fan.png", { mimeType: "application/octet-stream" });
	private static starNo: Class = embed("Assets/starNo.png", { mimeType: "application/octet-stream" });
	private static starYes: Class = embed("Assets/starYes.png", { mimeType: "application/octet-stream" });
	private static ambientBg: Class = embed("Assets/ambientBg.png", { mimeType: "application/octet-stream" });
	private static levelSelector: Class = embed("Assets/levelSelector.png", { mimeType: "application/octet-stream" });

	private static lvlSelEasy: Class = embed("Assets/lvlSelectEasy.png", { mimeType: "application/octet-stream" });
	private static lvlSelHard: Class = embed("Assets/lvlSelectHard.png", { mimeType: "application/octet-stream" });
	private static lvlSelMedium: Class = embed("Assets/lvlSelectMedium.png", { mimeType: "application/octet-stream" });

	private static endBtnMenu: Class = embed("Assets/EndBtnMenu.png", { mimeType: "application/octet-stream" });
	private static endBtnNext: Class = embed("Assets/EndBtnNext.png", { mimeType: "application/octet-stream" });
	private static endBtnReplay: Class = embed("Assets/EndBtnReplay.png", { mimeType: "application/octet-stream" });
	private static endPopup: Class = embed("Assets/EndPopup.png", { mimeType: "application/octet-stream" });
	private static star: Class = embed("Assets/star.png", { mimeType: "application/octet-stream" });
	
	private static classes: any; // PORT: AS3 Array used with string keys
	
	public static Init(): void {
		Content.classes = [];
		Content.classes["endBtnMenu"] = Content.LoadImage(Content.endBtnMenu);
		Content.classes["endBtnNext"] = Content.LoadImage(Content.endBtnNext);
		Content.classes["endBtnReplay"] = Content.LoadImage(Content.endBtnReplay);
		Content.classes["endPopup"] = Content.LoadImage(Content.endPopup);
		Content.classes["star"] = Content.LoadImage(Content.star);
		
		Content.classes["execute"] = Content.LoadImage(Content.execute);
		Content.classes["forwardBlack"] = Content.LoadImage(Content.forwardBlack);
		Content.classes["forwardGray"] = Content.LoadImage(Content.forwardGray);
		Content.classes["rotateLeftBlack"] = Content.LoadImage(Content.rotateLeftBlack);
		Content.classes["rotateLeftGray"] = Content.LoadImage(Content.rotateLeftGray);
		Content.classes["rotateRightBlack"] = Content.LoadImage(Content.rotateRightBlack);
		Content.classes["rotateRightGray"] = Content.LoadImage(Content.rotateRightGray);
		Content.classes["useBlack"] = Content.LoadImage(Content.useBlack);
		Content.classes["useGray"] = Content.LoadImage(Content.useGray);
		Content.classes["gameUiBg"] = Content.LoadImage(Content.gameUiBg);
		Content.classes["gameBg"] = Content.LoadImage(Content.gameBg);
		Content.classes["bgBmp"] = Content.LoadImage(Content.bgBmp);
		Content.classes["fan"] = Content.LoadImage(Content.fan);
		Content.classes["starNo"] = Content.LoadImage(Content.starNo);
		Content.classes["starYes"] = Content.LoadImage(Content.starYes);
		Content.classes["ambientBg"] = Content.LoadImage(Content.ambientBg);
		Content.classes["levelSelector"] = Content.LoadImage(Content.levelSelector);
		
		Content.classes["lvlSelectEasy"] = Content.LoadImage(Content.lvlSelEasy);
		Content.classes["lvlSelectHard"] = Content.LoadImage(Content.lvlSelHard);
		Content.classes["lvlSelectMedium"] = Content.LoadImage(Content.lvlSelMedium);
	}
			
	public static GetBitmap(name: string): Bitmap {
		var cl: Loader = Content.classes[name];
		// PORT: `!cl.content is Bitmap` is `(!cl.content) is Bitmap` in AS3 (always false); TS has no `is`, ported as instanceof with the same precedence
		if (cl == null || (!cl.content as any) instanceof Bitmap) {
			throw new Error("Bitmap not found: " + name);
		}
		var bmp: Bitmap = new Bitmap((cl.content as Bitmap).bitmapData);
		bmp.smoothing = true;
		
		return bmp;
	}
	
	private static LoadImage(src: Class): Loader {
		var bg: Loader = new Loader();
		bg.loadBytes(new src() as ByteArray);
		bg.contentLoaderInfo.addEventListener(Event.COMPLETE, function (e: Event): void { (bg.content as Bitmap).smoothing = true; } );
		return bg;
	}

}
