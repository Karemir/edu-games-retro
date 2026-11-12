import { GameAudio } from "../../GameAudio.js";
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
		const ctx = GameAudio.context;
		if (ctx.state == "suspended") ctx.resume();
		// PORT: Flash has one master volume; the page has a music and an effects mute. Looping sounds are music.
		return new SoundChannel(ctx, this.buffer, startTime, loops, sndTransform, GameAudio.bus(loops > 0 ? "music" : "sfx"));
	}
}
bindNativeMethods(Sound);
