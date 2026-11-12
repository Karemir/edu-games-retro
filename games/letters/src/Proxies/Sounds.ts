import { embed } from "@edugames/common/AssetLoader.js";
import { Sound } from "@edugames/common/flash/media/Sound.js";
import { SoundChannel } from "@edugames/common/flash/media/SoundChannel.js";
import { SoundTransform } from "@edugames/common/flash/media/SoundTransform.js";
import type { Class } from "@edugames/common/flash/utils/Class.js";
import type { IProxy } from "@edugames/common/org/puremvc/as3/interfaces/IProxy.js";
import { Proxy } from "@edugames/common/org/puremvc/as3/patterns/proxy/Proxy.js";
import { AppFacade } from "../AppFacade.js";

/**
 * ...
 * @author ...
 */
export class Sounds extends Proxy implements IProxy {
	public static readonly NAME: string = "SoundProxy";
	// PORT: instance embeds hoisted to static so they register with the AssetLoader at module load
	private static musicCl: Class = embed("Assets/soundEffects/music.mp3");
	
	private static boostCl: Class = embed("Assets/soundEffects/boost.mp3");
	private static clickCl: Class = embed("Assets/soundEffects/click.mp3");
	private static keypressCl: Class = embed("Assets/soundEffects/keypress.mp3");
	private static errorCl: Class = embed("Assets/soundEffects/error.mp3");
	private static endCl: Class = embed("Assets/soundEffects/end.mp3");
	
	public soundsEnabled: boolean;
	public musicEnabled: boolean;
	private musicInstance: SoundChannel;
	
	constructor() {
		super();
		this.soundsEnabled = true;
		this.musicEnabled = true;
		
		this.PlayMusic();
	}
	
	public PlayMusic(): void {
		var music: Sound = new Sounds.musicCl();
		this.musicInstance = music.play(0, 999999);
		this.musicInstance.soundTransform = new SoundTransform(0.07);
		this.musicEnabled = true;
	}
	
	public StopMusic(): void {
		this.musicInstance.stop();
		this.musicEnabled = false;
	}
	
	public EffectClick(): void {
		if (!this.soundsEnabled)
			return;
		var s: Sound = new Sounds.clickCl();
		s.play(200);
	}
			
	public EffectBoost(): void {
		if (!this.soundsEnabled)
			return;
		var s: Sound = new Sounds.boostCl();
		s.play(0, 0, new SoundTransform(0.1));			
	}
	
	public EffectKeypress(): void {
		if (!this.soundsEnabled)
			return;
		var s: Sound = new Sounds.keypressCl();
		s.play(0,0, new SoundTransform(0.5));
	}
	
	public EffectError(): void {
		if (!this.soundsEnabled)
			return;
		var s: Sound = new Sounds.errorCl();
		s.play(0, 0, new SoundTransform(0.4));
	}
	
	public EffectEnd(): void {
		if (!this.soundsEnabled)
			return;
		var s: Sound = new Sounds.endCl();
		s.play(0,0, new SoundTransform(0.7));
	}
	
	public getProxyName(): string {
		return Sounds.NAME;
	}
	
	public static MenuClickSound(): void {
		(AppFacade.GetInstance().retrieveProxy(Sounds.NAME) as Sounds).EffectClick();
	}
}
