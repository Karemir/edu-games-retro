import { AssetLoader } from "../../AssetLoader.js";
import { EventDispatcher } from "../events/EventDispatcher.js";
import { AS3_NATIVE, bindNativeMethods } from "../utils/bindMethods.js";
import { SoundChannel } from "./SoundChannel.js";
import type { SoundTransform } from "./SoundTransform.js";

export class Sound extends EventDispatcher {
	static readonly [AS3_NATIVE] = true;

	/** PORT: decoded audio supplied by an embed (AS3 decodes the embedded mp3 itself). */
	public buffer: AudioBuffer = null;

	public get length(): number { return this.buffer ? this.buffer.duration * 1000 : 0; }

	public play(startTime: number = 0, loops: number = 0, sndTransform: SoundTransform = null): SoundChannel {
		const ctx = AssetLoader.audioContext;
		if (ctx.state == "suspended") ctx.resume();
		return new SoundChannel(ctx, this.buffer, startTime, loops, sndTransform);
	}
}
bindNativeMethods(Sound);
