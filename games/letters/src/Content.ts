import { embed } from "@edugames/common/AssetLoader.js";
import { Bitmap } from "@edugames/common/flash/display/Bitmap.js";
import { Loader } from "@edugames/common/flash/display/Loader.js";
import type { Stage } from "@edugames/common/flash/display/Stage.js";
import { Event } from "@edugames/common/flash/events/Event.js";
import type { ByteArray } from "@edugames/common/flash/utils/ByteArray.js";
import type { Class } from "@edugames/common/flash/utils/Class.js";
import { AppFacade } from "./AppFacade.js";

/**
 * ...
 * @author Perzka Michalowy
 */
export class Content
{
	// PORT: [Embed] fields registered with the AssetLoader, paths relative to index.html
	private static race1Icon: Class = embed("Assets/race1Btn.png", { mimeType: "application/octet-stream" });
	private static race2Icon: Class = embed("Assets/race2Btn.png", { mimeType: "application/octet-stream" });
	private static race3Icon: Class = embed("Assets/race3Btn.png", { mimeType: "application/octet-stream" });

	private static Vehicle1Selection: Class = embed("Assets/veh1Selection.png", { mimeType: "application/octet-stream" });
	private static Vehicle1f1Bmp: Class = embed("Assets/vehicle1f1.png", { mimeType: "application/octet-stream" });
	private static Vehicle1f2Bmp: Class = embed("Assets/vehicle1f2.png", { mimeType: "application/octet-stream" });
	private static Vehicle1f3Bmp: Class = embed("Assets/vehicle1f3.png", { mimeType: "application/octet-stream" });

	private static Vehicle2Selection: Class = embed("Assets/veh2Selection.png", { mimeType: "application/octet-stream" });
	private static Vehicle2f1Bmp: Class = embed("Assets/vehicle2f1.png", { mimeType: "application/octet-stream" });
	private static Vehicle2f2Bmp: Class = embed("Assets/vehicle2f2.png", { mimeType: "application/octet-stream" });
	private static Vehicle2f3Bmp: Class = embed("Assets/vehicle2f3.png", { mimeType: "application/octet-stream" });

	private static Vehicle3Selection: Class = embed("Assets/veh3Selection.png", { mimeType: "application/octet-stream" });
	private static Vehicle3f1Bmp: Class = embed("Assets/vehicle3f1.png", { mimeType: "application/octet-stream" });
	private static Vehicle3f2Bmp: Class = embed("Assets/vehicle3f2.png", { mimeType: "application/octet-stream" });
	private static Vehicle3f3Bmp: Class = embed("Assets/vehicle3f3.png", { mimeType: "application/octet-stream" });

	private static Vehicle4Selection: Class = embed("Assets/veh4Selection.png", { mimeType: "application/octet-stream" });
	private static Vehicle4f1Bmp: Class = embed("Assets/vehicle4f1.png", { mimeType: "application/octet-stream" });
	private static Vehicle4f2Bmp: Class = embed("Assets/vehicle4f2.png", { mimeType: "application/octet-stream" });
	private static Vehicle4f3Bmp: Class = embed("Assets/vehicle4f3.png", { mimeType: "application/octet-stream" });

	private static veh1Finish: Class = embed("Assets/veh1Finish.png", { mimeType: "application/octet-stream" });
	private static veh2Finish: Class = embed("Assets/veh2Finish.png", { mimeType: "application/octet-stream" });
	private static veh3Finish: Class = embed("Assets/veh3Finish.png", { mimeType: "application/octet-stream" });
	private static veh4Finish: Class = embed("Assets/veh4Finish.png", { mimeType: "application/octet-stream" });

	private static race1NameCl: Class = embed("Assets/race1Name.png", { mimeType: "application/octet-stream" });
	private static race2NameCl: Class = embed("Assets/race2Name.png", { mimeType: "application/octet-stream" });
	private static race3NameCl: Class = embed("Assets/race3Name.png", { mimeType: "application/octet-stream" });
	private static race4NameCl: Class = embed("Assets/race4Name.png", { mimeType: "application/octet-stream" });

	private static RaceBgBmp: Class = embed("Assets/raceBg.png", { mimeType: "application/octet-stream" });
	private static PrizeSmallBmp: Class = embed("Assets/prizeSmall.png", { mimeType: "application/octet-stream" });
	private static PrizeBigBmp: Class = embed("Assets/prizeBig.png", { mimeType: "application/octet-stream" });
	private static bgBmp: Class = embed("Assets/menuBg.png", { mimeType: "application/octet-stream" });

	private static compForestBmp: Class = embed("Assets/completedForest.png", { mimeType: "application/octet-stream" });
	private static compLakesBmp: Class = embed("Assets/completedLakes.png", { mimeType: "application/octet-stream" });
	private static compMountBmp: Class = embed("Assets/completedMountains.png", { mimeType: "application/octet-stream" });
	private static compSeaBmp: Class = embed("Assets/completedSea.png", { mimeType: "application/octet-stream" });

	private static gameTrack1Bmp: Class = embed("Assets/gameTrack1.png", { mimeType: "application/octet-stream" });
	private static gameTrack2Bmp: Class = embed("Assets/gameTrack2.png", { mimeType: "application/octet-stream" });
	private static gameTrack3Bmp: Class = embed("Assets/gameTrack3.png", { mimeType: "application/octet-stream" });
	private static gameTrack4Bmp: Class = embed("Assets/gameTrack4.png", { mimeType: "application/octet-stream" });
	private static gameForeground: Class = embed("Assets/gameForeground.png", { mimeType: "application/octet-stream" });
	private static gameClouds: Class = embed("Assets/gameClouds.jpg", { mimeType: "application/octet-stream" });
	private static gameBackground1: Class = embed("Assets/gameBackground1.png", { mimeType: "application/octet-stream" });
	private static gameBackground2: Class = embed("Assets/gameBackground2.png", { mimeType: "application/octet-stream" });
	private static gameBackground3: Class = embed("Assets/gameBackground3.png", { mimeType: "application/octet-stream" });
	private static gameBackground4: Class = embed("Assets/gameBackground4.png", { mimeType: "application/octet-stream" });

	private static backBtnCl: Class = embed("Assets/backBtn.png", { mimeType: "application/octet-stream" });
	private static place1Cl: Class = embed("Assets/place1.png", { mimeType: "application/octet-stream" });
	private static place2Cl: Class = embed("Assets/place2.png", { mimeType: "application/octet-stream" });
	private static place3Cl: Class = embed("Assets/place3.png", { mimeType: "application/octet-stream" });
	private static place4Cl: Class = embed("Assets/place4.png", { mimeType: "application/octet-stream" });

	private static raceStartBtnCl: Class = embed("Assets/raceStartBtn.png", { mimeType: "application/octet-stream" });

	private static tickCl: Class = embed("Assets/tick.png", { mimeType: "application/octet-stream" });
	private static butterfly1: Class = embed("Assets/butterfly1.png", { mimeType: "application/octet-stream" });
	private static butterfly2: Class = embed("Assets/butterfly2.png", { mimeType: "application/octet-stream" });
	
	private static classes: any; // PORT: an Array with string keys
	private static loadCounter: number = 0; // PORT: int default
	private static initStage: Stage;
	
	public static Init(stage: Stage): void {
		Content.classes = [];
		Content.loadCounter = 0;
		Content.initStage = stage;
		Content.classes["Vehicle1f1"] = Content.LoadImage(Content.Vehicle1f1Bmp);
		Content.classes["Vehicle1f2"] = Content.LoadImage(Content.Vehicle1f2Bmp);
		Content.classes["Vehicle1f3"] = Content.LoadImage(Content.Vehicle1f3Bmp);
		Content.classes["Vehicle2f1"] = Content.LoadImage(Content.Vehicle2f1Bmp);
		Content.classes["Vehicle2f2"] = Content.LoadImage(Content.Vehicle2f2Bmp);
		Content.classes["Vehicle2f3"] = Content.LoadImage(Content.Vehicle2f3Bmp);
		Content.classes["Vehicle3f1"] = Content.LoadImage(Content.Vehicle3f1Bmp);
		Content.classes["Vehicle3f2"] = Content.LoadImage(Content.Vehicle3f2Bmp);
		Content.classes["Vehicle3f3"] = Content.LoadImage(Content.Vehicle3f3Bmp);
		Content.classes["Vehicle4f1"] = Content.LoadImage(Content.Vehicle4f1Bmp);
		Content.classes["Vehicle4f2"] = Content.LoadImage(Content.Vehicle4f2Bmp);
		Content.classes["Vehicle4f3"] = Content.LoadImage(Content.Vehicle4f3Bmp);
		Content.classes["Vehicle1Selection"] = Content.LoadImage(Content.Vehicle1Selection);
		Content.classes["Vehicle2Selection"] = Content.LoadImage(Content.Vehicle2Selection);
		Content.classes["Vehicle3Selection"] = Content.LoadImage(Content.Vehicle3Selection);
		Content.classes["Vehicle4Selection"] = Content.LoadImage(Content.Vehicle4Selection);
		Content.classes["veh1Finish"] = Content.LoadImage(Content.veh1Finish);
		Content.classes["veh2Finish"] = Content.LoadImage(Content.veh2Finish);
		Content.classes["veh3Finish"] = Content.LoadImage(Content.veh3Finish);
		Content.classes["veh4Finish"] = Content.LoadImage(Content.veh4Finish);
		Content.classes["Race1Icon"] = Content.LoadImage(Content.race1Icon);
		Content.classes["Race2Icon"] = Content.LoadImage(Content.race2Icon);
		Content.classes["Race3Icon"] = Content.LoadImage(Content.race3Icon);
		Content.classes["RaceBg"] = Content.LoadImage(Content.RaceBgBmp);
		Content.classes["PrizeSmall"] = Content.LoadImage(Content.PrizeSmallBmp);
		Content.classes["PrizeBig"] = Content.LoadImage(Content.PrizeBigBmp);
		Content.classes["menuBg"] = Content.LoadImage(Content.bgBmp);
		Content.classes["CompletedForest"] = Content.LoadImage(Content.compForestBmp);
		Content.classes["CompletedLakes"] = Content.LoadImage(Content.compLakesBmp);
		Content.classes["CompletedMountains"] = Content.LoadImage(Content.compMountBmp);
		Content.classes["CompletedSea"] = Content.LoadImage(Content.compSeaBmp);
		Content.classes["GameTrack0"] = Content.LoadImage(Content.gameTrack1Bmp);
		Content.classes["GameTrack1"] = Content.LoadImage(Content.gameTrack2Bmp);
		Content.classes["GameTrack2"] = Content.LoadImage(Content.gameTrack3Bmp);
		Content.classes["GameTrack3"] = Content.LoadImage(Content.gameTrack4Bmp);
		Content.classes["GameForeground"] = Content.LoadImage(Content.gameForeground);
		Content.classes["GameClouds"] = Content.LoadImage(Content.gameClouds);
		Content.classes["GameBackground0"] = Content.LoadImage(Content.gameBackground1);
		Content.classes["GameBackground1"] = Content.LoadImage(Content.gameBackground2);
		Content.classes["GameBackground2"] = Content.LoadImage(Content.gameBackground3);
		Content.classes["GameBackground3"] = Content.LoadImage(Content.gameBackground4);
		Content.classes["backBtn"] = Content.LoadImage(Content.backBtnCl);
		Content.classes["place1"] = Content.LoadImage(Content.place1Cl);
		Content.classes["place2"] = Content.LoadImage(Content.place2Cl);
		Content.classes["place3"] = Content.LoadImage(Content.place3Cl);
		Content.classes["place4"] = Content.LoadImage(Content.place4Cl);
		Content.classes["race0Name"] = Content.LoadImage(Content.race1NameCl);
		Content.classes["race1Name"] = Content.LoadImage(Content.race2NameCl);
		Content.classes["race2Name"] = Content.LoadImage(Content.race3NameCl);
		Content.classes["race3Name"] = Content.LoadImage(Content.race4NameCl);
		Content.classes["tick"] = Content.LoadImage(Content.tickCl);
		Content.classes["butterfly1"] = Content.LoadImage(Content.butterfly1);
		Content.classes["butterfly2"] = Content.LoadImage(Content.butterfly2);
		Content.classes["raceStartBtn"] = Content.LoadImage(Content.raceStartBtnCl);
	}

	private static LoadImage(src: Class): Loader {
		var bg: Loader = new Loader();
		Content.loadCounter++;
		bg.loadBytes(new src() as ByteArray);
		bg.contentLoaderInfo.addEventListener(Event.COMPLETE, function (e: Event): void { 
			//(bg.content as Bitmap).smoothing = true; 
			Content.loadCounter--;
			if(Content.loadCounter == 0){
				AppFacade.GetInstance().sendNotification(AppFacade.STARTUP, Content.initStage);
			}
		} );
		return bg;
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
}
