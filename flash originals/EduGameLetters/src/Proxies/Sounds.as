package Proxies {
	import adobe.utils.CustomActions;
	import com.greensock.plugins.SoundTransformPlugin;
	import flash.media.Sound;
	import flash.media.SoundChannel;
	import flash.media.SoundTransform;
	import org.puremvc.as3.interfaces.IProxy;
	import org.puremvc.as3.patterns.proxy.Proxy;
	
	/**
	 * ...
	 * @author ...
	 */
	public class Sounds extends Proxy implements IProxy {
		public static const NAME:String = "SoundProxy";
		[Embed(source="../../Assets/soundEffects/music.mp3")] private var musicCl:Class;
		
		[Embed(source="../../Assets/soundEffects/boost.mp3")] private var boostCl:Class;
		[Embed(source="../../Assets/soundEffects/click.mp3")] private var clickCl:Class;
		[Embed(source = "../../Assets/soundEffects/keypress.mp3")] private var keypressCl:Class;
		[Embed(source = "../../Assets/soundEffects/error.mp3")] private var errorCl:Class;
		[Embed(source = "../../Assets/soundEffects/end.mp3")] private var endCl:Class;
		
		public var soundsEnabled:Boolean;
		public var musicEnabled:Boolean;
		private var musicInstance:SoundChannel;
		
		public function Sounds() {
			soundsEnabled = true;
			musicEnabled = true;
			
			PlayMusic();
		}
		
		public function PlayMusic():void {
			var music:Sound = new musicCl();
			musicInstance = music.play(0, 999999);
			musicInstance.soundTransform = new SoundTransform(0.07);
			musicEnabled = true;
		}
		
		public function StopMusic():void {
			musicInstance.stop();
			musicEnabled = false;
		}
		
		public function EffectClick():void {
			if (!soundsEnabled)
				return;
			var s:Sound = new clickCl();
			s.play(200);
		}
				
		public function EffectBoost():void {
			if (!soundsEnabled)
				return;
			var s:Sound = new boostCl();
			s.play(0, 0, new SoundTransform(0.1));			
		}
		
		public function EffectKeypress():void {
			if (!soundsEnabled)
				return;
			var s:Sound = new keypressCl();
			s.play(0,0, new SoundTransform(0.5));
		}
		
		public function EffectError():void {
			if (!soundsEnabled)
				return;
			var s:Sound = new errorCl();
			s.play(0, 0, new SoundTransform(0.4));
		}
		
		public function EffectEnd():void {
			if (!soundsEnabled)
				return;
			var s:Sound = new endCl();
			s.play(0,0, new SoundTransform(0.7));
		}
		
		override public function getProxyName():String {
			return NAME;
		}
		
		public static function MenuClickSound():void {
			(AppFacade.GetInstance().retrieveProxy(NAME) as Sounds).EffectClick();
		}
	}

}