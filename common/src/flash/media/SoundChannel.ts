import { Event } from "../events/Event.js";
import { EventDispatcher } from "../events/EventDispatcher.js";
import { AS3_NATIVE, bindNativeMethods } from "../utils/bindMethods.js";
import { SoundTransform } from "./SoundTransform.js";

export class SoundChannel extends EventDispatcher {
	static readonly [AS3_NATIVE] = true;

	private gain: GainNode;
	private source: AudioBufferSourceNode;
	private _transform: SoundTransform;
	private startedAt: number;
	private ctx: AudioContext;

	/** PORT: created by Sound.play(). */
	constructor(ctx: AudioContext, buffer: AudioBuffer, startTime: number, loops: number, transform: SoundTransform) {
		super();
		this.ctx = ctx;
		this.gain = ctx.createGain();
		this.gain.connect(ctx.destination);
		this._transform = transform || new SoundTransform();
		this.gain.gain.value = this._transform.volume;
		this.startedAt = ctx.currentTime - startTime / 1000;
		this.play(buffer, startTime / 1000, Math.max(0, loops));
	}

	private play(buffer: AudioBuffer, offset: number, loopsLeft: number): void {
		const src = this.ctx.createBufferSource();
		src.buffer = buffer;
		src.connect(this.gain);
		this.source = src;
		if (loopsLeft >= 1000) src.loop = true;
		src.onended = () => {
			if (this.source !== src) return;
			if (loopsLeft > 0 && !src.loop) this.play(buffer, 0, loopsLeft - 1);
			else this.dispatchEvent(new Event(Event.SOUND_COMPLETE));
		};
		src.start(0, offset);
	}

	public get position(): number { return (this.ctx.currentTime - this.startedAt) * 1000; }

	public get soundTransform(): SoundTransform { return this._transform; }
	public set soundTransform(value: SoundTransform) {
		this._transform = value;
		this.gain.gain.value = value.volume;
	}

	public stop(): void {
		const s = this.source;
		this.source = null;
		try { s.stop(); } catch (e) {}
	}
}
bindNativeMethods(SoundChannel);
