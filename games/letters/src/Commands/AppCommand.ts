import { AutoAlphaPlugin } from "@edugames/common/com/greensock/plugins/AutoAlphaPlugin.js";
import { MotionBlurPlugin } from "@edugames/common/com/greensock/plugins/MotionBlurPlugin.js";
import { RemoveTintPlugin } from "@edugames/common/com/greensock/plugins/RemoveTintPlugin.js";
import { TransformAroundPointPlugin } from "@edugames/common/com/greensock/plugins/TransformAroundPointPlugin.js";
import { TweenPlugin } from "@edugames/common/com/greensock/plugins/TweenPlugin.js";
import { TintPlugin } from "@edugames/common/com/greensock/plugins/TintPlugin.js";
import { embed } from "@edugames/common/AssetLoader.js";
import { Font } from "@edugames/common/flash/text/Font.js";
import { GameData } from "../Proxies/GameData.js";
import { RaceData } from "../Proxies/RaceData.js";
import { Sounds } from "../Proxies/Sounds.js";
import { Words } from "../Proxies/Words.js";
import type { Stage } from "@edugames/common/flash/display/Stage.js";
import type { Class } from "@edugames/common/flash/utils/Class.js";
import type { ICommand } from "@edugames/common/org/puremvc/as3/interfaces/ICommand.js";
import type { INotification } from "@edugames/common/org/puremvc/as3/interfaces/INotification.js";
import { SimpleCommand } from "@edugames/common/org/puremvc/as3/patterns/command/SimpleCommand.js";
import { Events } from "../Events.js";
import { Logger } from "../Logger.js";

/**
 * ...
 * @author Michal Perzak
 */
export class AppCommand extends SimpleCommand implements ICommand {
	// PORT: instance embed hoisted to static so it registers with the AssetLoader at module load; embedAsCFF has no equivalent
	private static mp_bold: Class = embed("Assets/MyriadPro-Bold.ttf", { fontName: "MBold", fontFamily: "MBold", fontStyle: "normal", fontWeight: "normal", mimeType: "application/x-font" });		
	
	public execute(notification: INotification): void {
		var stage: Stage = notification.getBody() as Stage;
		stage.stageFocusRect = false;

		Font.registerFont(AppCommand.mp_bold);

		this.facade.registerProxy(new RaceData());
		this.facade.registerProxy(new GameData());
		this.facade.registerProxy(new Words());
		this.facade.registerProxy(new Sounds());
		// PORT: DynamicPropsPlugin removed from the list, no tween uses it
		TweenPlugin.activate([TintPlugin, RemoveTintPlugin, AutoAlphaPlugin, MotionBlurPlugin, TransformAroundPointPlugin]);
		Logger.Log("AppCommand");
		
		// show main menu
		this.facade.sendNotification(Events.NAVIGATE_MAIN_MENU, stage);
	}
}
