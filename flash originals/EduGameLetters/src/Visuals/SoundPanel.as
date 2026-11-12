package Visuals 
{
	import flash.display.Bitmap;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import Proxies.Sounds;
	
	/**
	 * ...
	 * @author ...
	 */
	public class SoundPanel extends Sprite 
	{
		[Embed(source = "../../Assets/soundEffects/musicOff.png")] private var musicOffCl:Class;
		[Embed(source = "../../Assets/soundEffects/musicOn.png")] private var musicOnCl:Class;
		[Embed(source = "../../Assets/soundEffects/soundsOff.png")] private var soundsOffCl:Class;
		[Embed(source = "../../Assets/soundEffects/soundsOn.png")] private var soundsOnCl:Class;
		
		public var soundProxy:Sounds;
		private var son:Sprite;
		private var soff:Sprite;
		private var mon:Sprite;
		private var moff:Sprite;
		
		public function SoundPanel() 
		{
			soundProxy = AppFacade.GetInstance().retrieveProxy(Sounds.NAME) as Sounds;
			
			son = new Sprite();
			soff = new Sprite();
			mon = new Sprite();
			moff = new Sprite();
			
			son.addChild(new soundsOnCl());
			soff.addChild(new soundsOffCl());
			mon.addChild(new musicOnCl());
			moff.addChild(new musicOffCl());
			
			(son.getChildAt(0) as Bitmap).smoothing = true;
			(soff.getChildAt(0) as Bitmap).smoothing = true;
			(mon.getChildAt(0) as Bitmap).smoothing = true;
			(moff.getChildAt(0) as Bitmap).smoothing = true;
			
			addChild(son);
			addChild(soff);
			addChild(mon);
			addChild(moff);
			
			son.scaleX = son.scaleY = 0.7;
			soff.scaleX = soff.scaleY = 0.7;
			mon.scaleX = mon.scaleY = 0.7;
			moff.scaleX = moff.scaleY = 0.7;
			
			mon.x = son.width + 10;
			moff.x = mon.x;
			moff.y = -0.7;
			soff.y = -2.1;
			
			UpdateButtons();
			
			son.addEventListener(MouseEvent.CLICK, SoundOff);
			soff.addEventListener(MouseEvent.CLICK, SoundOn);
			mon.addEventListener(MouseEvent.CLICK, MusicOff);
			moff.addEventListener(MouseEvent.CLICK, MusicOn);
			
			son.buttonMode = true;
			soff.buttonMode = true;
			mon.buttonMode = true;
			moff.buttonMode = true;
		}
		
		public function UpdateButtons():void {
			if (soundProxy.musicEnabled) {
				mon.visible = true;
				moff.visible = false;
			} else {
				mon.visible = false;
				moff.visible = true;
			}
			
			if (soundProxy.soundsEnabled) {
				son.visible = true;
				soff.visible = false;
			} else {
				son.visible = false;
				soff.visible = true;
			}
		}
		
		public function SoundOff(e:Event):void {
			soundProxy.soundsEnabled = false;
			UpdateButtons();
		}
		
		public function SoundOn(e:Event):void {
			soundProxy.soundsEnabled = true;
			UpdateButtons();
		}
		
		public function MusicOn(e:Event):void {
			soundProxy.PlayMusic();
			UpdateButtons();
		}
		
		public function MusicOff(e:Event):void {
			soundProxy.StopMusic();
			UpdateButtons();
		}
	}

}