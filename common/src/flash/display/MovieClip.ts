import { Event } from "../events/Event.js";
import { AS3_NATIVE } from "../utils/bindMethods.js";
import { Sprite } from "./Sprite.js";

/** No timeline content exists in the ported games; frames only model the SWF preloader's `currentFrame == totalFrames`. */
export class MovieClip extends Sprite {
	static readonly [AS3_NATIVE] = true;

	public _currentFrame: number = 1;
	public _totalFrames: number = 1;

	public get currentFrame(): number { return this._currentFrame; }
	public get totalFrames(): number { return this._totalFrames; }

	public play(): void {}
	public stop(): void {}
	public gotoAndStop(frame: any, scene: string = null): void { this._currentFrame = Math.min(Math.max(1, Number(frame)), this._totalFrames); }
	public gotoAndPlay(frame: any, scene: string = null): void { this.gotoAndStop(frame); }
	public nextFrame(): void { this.gotoAndStop(this._currentFrame + 1); }
	public prevFrame(): void { this.gotoAndStop(this._currentFrame - 1); }
}
