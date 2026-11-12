import { TimerEvent } from "@edugames/common/flash/events/TimerEvent.js";
import { Timer } from "@edugames/common/flash/utils/Timer.js";
import type { IProxy } from "@edugames/common/org/puremvc/as3/interfaces/IProxy.js";
import { Proxy } from "@edugames/common/org/puremvc/as3/patterns/proxy/Proxy.js";
import { Events } from "../Events.js";
import { Logger } from "../Logger.js";

/**
 * ...
 * @author Perzka Michalowy
 */
export class GameTimer extends Proxy implements IProxy {
	public static readonly NAME: string = "GameTimer";
	public static readonly GAME_ARCADE_TIME: number = 40.0;
	public static readonly GAME_FREEPLAY_TIME: number = 99.0;
	private static readonly TIMER_TICK: number = 333;

	private internalTimer: Timer;
	
	public secondsLeft: number;
	public isRunning: boolean;
	
	constructor() {
		super();
		this.secondsLeft = 0;
		this.isRunning = false;

		// start internal timer
		this.internalTimer = new Timer(GameTimer.TIMER_TICK);
		this.internalTimer.addEventListener(TimerEvent.TIMER, this.OnTimer);
		this.internalTimer.start();
	}
	
	public Start(): void {
		this.isRunning = true;
	}
	
	public Pause(): void {
		this.isRunning = false;
	}
	
	public Reset(newAmount: number): void {
		this.isRunning = false;
		this.secondsLeft = newAmount;
		
		this.facade.sendNotification(Events.GAME_TIMER_UPDATE, this.GetTimeString());
	}
	
	public AddTime(seconds: number): void {
		this.secondsLeft += seconds;
		this.secondsLeft = Math.min(999, this.secondsLeft);
	}
	
	private Update(elapsedSeconds: number): void {
		if (!this.isRunning) return;
		
		var valBefore: number = this.secondsLeft;
		var valAfter: number = this.secondsLeft -= elapsedSeconds;

		var timeAsString: string = this.GetTimeString();
		
		this.facade.sendNotification(Events.GAME_TIMER_UPDATE, timeAsString);
		
		if (valBefore > 0 && valAfter < 0) {
			this.secondsLeft = 0;
			
			this.Pause();
			Logger.Log("Timer: Game ended");
			this.sendNotification(Events.GAME_TIMER_TIME_ENDED);
		}
	}
	
	public GetTimeString(): string {
		var intSecs: number = (this.secondsLeft | 0); // PORT: int(x) -> (x | 0)
		if (intSecs < 0) intSecs = 0;
		
		var timeAsString: string = intSecs.toString();
		if (timeAsString.length == 1) { timeAsString = "00" + timeAsString; }
		if (timeAsString.length == 2) { timeAsString = "0" + timeAsString; }
		
		return timeAsString;
	}
	
	private OnTimer(e: TimerEvent): void {
		this.Update(GameTimer.TIMER_TICK / 1000.0);
	}

	public getProxyName(): string {
		return GameTimer.NAME;
	}

}
