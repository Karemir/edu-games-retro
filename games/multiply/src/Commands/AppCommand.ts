import { TweenLite } from "@edugames/common/com/greensock/TweenLite.js";
import { AutoAlphaPlugin } from "@edugames/common/com/greensock/plugins/AutoAlphaPlugin.js";
import { MotionBlurPlugin } from "@edugames/common/com/greensock/plugins/MotionBlurPlugin.js";
import { Physics2DPlugin } from "@edugames/common/com/greensock/plugins/Physics2DPlugin.js";
import { RemoveTintPlugin } from "@edugames/common/com/greensock/plugins/RemoveTintPlugin.js";
import { TintPlugin } from "@edugames/common/com/greensock/plugins/TintPlugin.js";
import { TransformAroundPointPlugin } from "@edugames/common/com/greensock/plugins/TransformAroundPointPlugin.js";
import { TweenPlugin } from "@edugames/common/com/greensock/plugins/TweenPlugin.js";
import { embed } from "@edugames/common/AssetLoader.js";
import { TimerEvent } from "@edugames/common/flash/events/TimerEvent.js";
import { Font } from "@edugames/common/flash/text/Font.js";
import { setTimeout } from "@edugames/common/flash/utils/setTimeout.js";
import { Timer } from "@edugames/common/flash/utils/Timer.js";
import type { Class } from "@edugames/common/flash/utils/Class.js";
import { Events } from "../Events.js";
import { Content } from "../Content.js";
import { Logger } from "../Logger.js";
import { GameProxy } from "../Proxies/GameProxy.js";
import { GameTimer } from "../Proxies/GameTimer.js";
import { HighscoreProxy } from "../Proxies/HighscoreProxy.js";
import { Sounds } from "../Proxies/Sounds.js";

import type { Stage } from "@edugames/common/flash/display/Stage.js";
import { StageAlign } from "@edugames/common/flash/display/StageAlign.js";
import { StageDisplayState } from "@edugames/common/flash/display/StageDisplayState.js";
import { StageScaleMode } from "@edugames/common/flash/display/StageScaleMode.js";
import { Capabilities } from "@edugames/common/flash/system/Capabilities.js";
import type { ICommand } from "@edugames/common/org/puremvc/as3/interfaces/ICommand.js";
import type { INotification } from "@edugames/common/org/puremvc/as3/interfaces/INotification.js";
import { SimpleCommand } from "@edugames/common/org/puremvc/as3/patterns/command/SimpleCommand.js";

/**
 * ...
 * @author Michal Perzak
 */
export class AppCommand extends SimpleCommand implements ICommand {
	// PORT: instance embeds hoisted to static so they register with the AssetLoader at module load; embedAsCFF has no equivalent
	private static mp_bold: Class = embed("Assets/MYRIADPRO-BOLD.OTF", { fontName: "MBold", fontFamily: "MBold", fontStyle: "normal", fontWeight: "normal", mimeType: "application/x-font" });
	private static mp_reg: Class = embed("Assets/MYRIADPRO-REGULAR.OTF", { fontName: "MReg", fontFamily: "MReg", fontStyle: "normal", fontWeight: "normal", mimeType: "application/x-font" });

	public execute(notification: INotification): void {
		var stage: Stage = notification.getBody() as Stage;
		
		this.facade.registerProxy(new GameProxy());
		this.facade.registerProxy(new HighscoreProxy());
		this.facade.registerProxy(new GameTimer());
		this.facade.registerProxy(new Sounds());
		TweenPlugin.activate([TintPlugin, RemoveTintPlugin, AutoAlphaPlugin, MotionBlurPlugin, TransformAroundPointPlugin]);
		Logger.Log("AppCommand");

		Content.Init();
		Font.registerFont(AppCommand.mp_bold);
		Font.registerFont(AppCommand.mp_reg);
		
		stage.stageFocusRect = false;
		
		// show main menu
		setTimeout((): void => { // PORT: arrow function keeps `this` (facade)
			this.facade.sendNotification(Events.NAVIGATION_MENU, stage);
		}, 100);
	}		
}
