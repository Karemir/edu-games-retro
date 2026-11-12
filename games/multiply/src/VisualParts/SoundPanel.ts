import { embed } from "@edugames/common/AssetLoader.js";
import { Bitmap } from "@edugames/common/flash/display/Bitmap.js";
import { Sprite } from "@edugames/common/flash/display/Sprite.js";
import { Event } from "@edugames/common/flash/events/Event.js";
import { MouseEvent } from "@edugames/common/flash/events/MouseEvent.js";
import type { Class } from "@edugames/common/flash/utils/Class.js";
import { AppFacade } from "../AppFacade.js";
import { Sounds } from "../Proxies/Sounds.js";

/**
 * ...
 * @author ...
 */
export class SoundPanel extends Sprite 
{
	// PORT: [Embed] fields registered with the AssetLoader, paths relative to index.html
	private static musicOffCl: Class = embed("Assets/sounds/musicOff.png");
	private static musicOnCl: Class = embed("Assets/sounds/musicOn.png");
	private static soundsOffCl: Class = embed("Assets/sounds/soundsOff.png");
	private static soundsOnCl: Class = embed("Assets/sounds/soundsOn.png");
	
	public soundProxy: Sounds;
	private son: Sprite;
	private soff: Sprite;
	private mon: Sprite;
	private moff: Sprite;
	
	constructor() 
	{
		super();
		this.soundProxy = AppFacade.GetInstance().retrieveProxy(Sounds.NAME) as Sounds;
		
		this.son = new Sprite();
		this.soff = new Sprite();
		this.mon = new Sprite();
		this.moff = new Sprite();
		
		this.son.addChild(new SoundPanel.soundsOnCl());
		this.soff.addChild(new SoundPanel.soundsOffCl());
		this.mon.addChild(new SoundPanel.musicOnCl());
		this.moff.addChild(new SoundPanel.musicOffCl());
		
		(this.son.getChildAt(0) as Bitmap).smoothing = true;
		(this.soff.getChildAt(0) as Bitmap).smoothing = true;
		(this.mon.getChildAt(0) as Bitmap).smoothing = true;
		(this.moff.getChildAt(0) as Bitmap).smoothing = true;
		
		this.addChild(this.son);
		this.addChild(this.soff);
		this.addChild(this.mon);
		this.addChild(this.moff);
		
		this.son.scaleX = this.son.scaleY = 0.7;
		this.soff.scaleX = this.soff.scaleY = 0.7;
		this.mon.scaleX = this.mon.scaleY = 0.7;
		this.moff.scaleX = this.moff.scaleY = 0.7;
		
		this.mon.x = this.son.width + 10;
		this.moff.x = this.mon.x;
		this.moff.y = -0.7;
		this.soff.y = -2.1;
		
		this.UpdateButtons();
		
		this.son.addEventListener(MouseEvent.CLICK, this.SoundOff);
		this.soff.addEventListener(MouseEvent.CLICK, this.SoundOn);
		this.mon.addEventListener(MouseEvent.CLICK, this.MusicOff);
		this.moff.addEventListener(MouseEvent.CLICK, this.MusicOn);
		
		this.son.buttonMode = true;
		this.soff.buttonMode = true;
		this.mon.buttonMode = true;
		this.moff.buttonMode = true;
	}
	
	public UpdateButtons(): void {
		if (this.soundProxy.musicEnabled) {
			this.mon.visible = true;
			this.moff.visible = false;
		} else {
			this.mon.visible = false;
			this.moff.visible = true;
		}
		
		if (this.soundProxy.soundsEnabled) {
			this.son.visible = true;
			this.soff.visible = false;
		} else {
			this.son.visible = false;
			this.soff.visible = true;
		}
	}
	
	public SoundOff(e: Event): void {
		this.soundProxy.soundsEnabled = false;
		this.UpdateButtons();
	}
	
	public SoundOn(e: Event): void {
		this.soundProxy.soundsEnabled = true;
		this.UpdateButtons();
	}
	
	public MusicOn(e: Event): void {
		this.soundProxy.PlayMusic();
		this.UpdateButtons();
	}
	
	public MusicOff(e: Event): void {
		this.soundProxy.StopMusic();
		this.UpdateButtons();
	}
}
