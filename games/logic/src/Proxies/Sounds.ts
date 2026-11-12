import { SoundTransformPlugin } from "@edugames/common/com/greensock/plugins/SoundTransformPlugin.js";
import { embed } from "@edugames/common/AssetLoader.js";
import { Sound } from "@edugames/common/flash/media/Sound.js";
import { SoundChannel } from "@edugames/common/flash/media/SoundChannel.js";
import { SoundTransform } from "@edugames/common/flash/media/SoundTransform.js";
import type { Class } from "@edugames/common/flash/utils/Class.js";
import type { IProxy } from "@edugames/common/org/puremvc/as3/interfaces/IProxy.js";
import { Proxy } from "@edugames/common/org/puremvc/as3/patterns/proxy/Proxy.js";

/**
 * ...
 * @author ...
 */
export class Sounds extends Proxy implements IProxy 
{
	public static readonly NAME: string = "SoundProxy";
	
	// PORT: instance embeds hoisted to static so they register with the AssetLoader at module load
	private static musicCl: Class = embed("Assets/sounds/bgMusic.mp3");
	
	private static brickCl: Class = embed("Assets/sounds/brickDrop.mp3");
	private static clickCl: Class = embed("Assets/sounds/click.mp3");
	private static errorCl: Class = embed("Assets/sounds/error.mp3");
	private static keypressCl: Class = embed("Assets/sounds/keypress.mp3");
	
	public soundsEnabled: boolean;
	public musicEnabled: boolean;
	private musicInstance: SoundChannel;
	
	constructor() 
	{
		super();
		this.soundsEnabled = true;
		this.musicEnabled = true;
		
		this.PlayMusic();
	}
	
	public PlayMusic(): void {
		var music: Sound = new Sounds.musicCl();
		this.musicInstance = music.play(0, 999999);
		this.musicInstance.soundTransform = new SoundTransform(0.2);
		this.musicEnabled = true;
	}
	
	public StopMusic(): void {
		this.musicInstance.stop();
		this.musicEnabled = false;
	}
	
	public EffectClick(): void {
		if (!this.soundsEnabled) return;
		var s: Sound = new Sounds.clickCl();
		s.play();
	}
	
	public EffectError(): void {
		if (!this.soundsEnabled) return;
		var s: Sound = new Sounds.errorCl();
		s.play();
	}
	
	public EffectBrick(): void {
		if (!this.soundsEnabled) return;
		var s: Sound = new Sounds.brickCl();
		s.play();
	}
	
	public EffectKeypress(): void {
		if (!this.soundsEnabled) return;
		var s: Sound = new Sounds.keypressCl();
		s.play();
	}
	
	public getProxyName(): string 
	{
		return Sounds.NAME; // PORT: the original has a stray "s" token after this return, which is not valid TS
	}
}
