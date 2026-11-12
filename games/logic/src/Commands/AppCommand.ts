import { AutoAlphaPlugin } from "@edugames/common/com/greensock/plugins/AutoAlphaPlugin.js";
import { MotionBlurPlugin } from "@edugames/common/com/greensock/plugins/MotionBlurPlugin.js";
import { RemoveTintPlugin } from "@edugames/common/com/greensock/plugins/RemoveTintPlugin.js";
import { TransformAroundCenterPlugin } from "@edugames/common/com/greensock/plugins/TransformAroundCenterPlugin.js";
import { TransformAroundPointPlugin } from "@edugames/common/com/greensock/plugins/TransformAroundPointPlugin.js";
import { TweenPlugin } from "@edugames/common/com/greensock/plugins/TweenPlugin.js";
import { TweenLite } from "@edugames/common/com/greensock/TweenLite.js";
import { TintPlugin } from "@edugames/common/com/greensock/plugins/TintPlugin.js";
import { embed } from "@edugames/common/AssetLoader.js";
import { TimerEvent } from "@edugames/common/flash/events/TimerEvent.js";
import { Font } from "@edugames/common/flash/text/Font.js";
import { setTimeout } from "@edugames/common/flash/utils/setTimeout.js";
import { Timer } from "@edugames/common/flash/utils/Timer.js";
import type { Stage } from "@edugames/common/flash/display/Stage.js";
import { StageAlign } from "@edugames/common/flash/display/StageAlign.js";
import { StageDisplayState } from "@edugames/common/flash/display/StageDisplayState.js";
import { StageScaleMode } from "@edugames/common/flash/display/StageScaleMode.js";
import { Capabilities } from "@edugames/common/flash/system/Capabilities.js";
import type { Class } from "@edugames/common/flash/utils/Class.js";
import type { ICommand } from "@edugames/common/org/puremvc/as3/interfaces/ICommand.js";
import type { INotification } from "@edugames/common/org/puremvc/as3/interfaces/INotification.js";
import { SimpleCommand } from "@edugames/common/org/puremvc/as3/patterns/command/SimpleCommand.js";
import { CommandHistory } from "../Proxies/CommandHistory.js";
import { SaveData } from "../Proxies/SaveData.js";
import { Sounds } from "../Proxies/Sounds.js";
import { Events } from "../Events.js";
import { Content } from "../Content.js";
import { Logger } from "../Logger.js";

/**
 * ...
 * @author Michal Perzak
 */
export class AppCommand extends SimpleCommand implements ICommand {
	// PORT: instance embed hoisted to static so it registers with the AssetLoader at module load; embedAsCFF has no equivalent
	private static mp_8bit: Class = embed("Assets/8-BIT WONDER.TTF", { fontName: "8bit", fontFamily: "8bit", fontStyle: "normal", fontWeight: "normal", mimeType: "application/x-font" });		
	public execute(notification: INotification): void {
		var stage: Stage = notification.getBody() as Stage;
		
		this.facade.registerProxy(new CommandHistory());
		this.facade.registerProxy(new SaveData());
		this.facade.registerProxy(new Sounds());
		TweenPlugin.activate([TintPlugin, RemoveTintPlugin, AutoAlphaPlugin, MotionBlurPlugin, TransformAroundPointPlugin, TransformAroundCenterPlugin]);
		Logger.Log("AppCommand");
		
		stage.stageFocusRect = false;
		Font.registerFont(AppCommand.mp_8bit);
		Content.Init();

		// show main menu
		setTimeout((): void => { // PORT: arrow function keeps `this` (facade)
			this.facade.sendNotification(Events.NAVIGATION_MENU, stage);
		}, 100);
		//facade.sendNotification(Events.NAVIGATION_PLAY_GAME, stage);
	}		
}
