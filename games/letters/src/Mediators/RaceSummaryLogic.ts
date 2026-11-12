import type { Stage } from "@edugames/common/flash/display/Stage.js";
import { Timer } from "@edugames/common/flash/utils/Timer.js";
import type { IMediator } from "@edugames/common/org/puremvc/as3/interfaces/IMediator.js";
import type { INotification } from "@edugames/common/org/puremvc/as3/interfaces/INotification.js";
import { Mediator } from "@edugames/common/org/puremvc/as3/patterns/mediator/Mediator.js";
import { Events } from "../Events.js";
import type { RacerData } from "../Proxies/Data/RacerData.js";
import { VehicleData } from "../Proxies/Data/VehicleData.js";
import { GameData } from "../Proxies/GameData.js";
import { RaceData } from "../Proxies/RaceData.js";
import { RaceSummaryScreen } from "../Visuals/RaceSummaryScreen.js";

/**
 * ...
 * @author Perzka Michalowy
 */
export class RaceSummaryLogic extends Mediator implements IMediator {
	public static readonly NAME: string = "RaceSummaryLogic";
	
	public raceSummaryScreen: RaceSummaryScreen;
	public gameData: GameData;
	public raceData: RaceData;
	
	private handledTrack: number = 1;
	private timer: Timer;
	
	constructor(stageItem: Object) {
		super(RaceSummaryLogic.NAME, stageItem);
	}
	
	public onRegister(): void {
		this.gameData = this.facade.retrieveProxy(GameData.NAME) as GameData;
		this.raceData = this.facade.retrieveProxy(RaceData.NAME) as RaceData;
					
		// prepare raceData for the next race
		this.raceData.racers = []; // PORT: Vector.<VehicleData>
		for (const racer of this.gameData.racers as RacerData[]) {
			var veh: VehicleData = new VehicleData();
			veh.racer = racer;
			veh.isPlayer = racer.id == GameData.PLAYER_ID;
			this.raceData.racers.push(veh);
		}
		
		this.raceSummaryScreen = new RaceSummaryScreen(this.gameData);
		this.stage.addChild(this.raceSummaryScreen);
		this.stage.focus = this.raceSummaryScreen;
		
		this.timer = new Timer(1000, 1);
		//timer.addEventListener(TimerEvent.TIMER, function(e:Event):void { facade.sendNotification(Events.GAME_SUMMARY_NEXT);} );
		//timer.start();
	}
	
	public onRemove(): void {
		this.stage.removeChild(this.raceSummaryScreen);
	}
	
	public listNotificationInterests(): Array<any> {
		return [
			Events.MENU_RACE_SELECTED,
			];
	}
	
	public handleNotification(notification: INotification): void {
		var name: string = notification.getName();
		var body: Object = notification.getBody();
		
		switch (name) {
			case Events.MENU_RACE_SELECTED:
				this.raceData.trackType = (Number(body) | 0);
				this.sendNotification(Events.GAME_CYCLE_SCREENS, this);
				break;
		}
	}
					
	public get stage(): Stage {
		return this.viewComponent as Stage;
	}
}
