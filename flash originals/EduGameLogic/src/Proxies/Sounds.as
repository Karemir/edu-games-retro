package Proxies 
{
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
	public class Sounds extends Proxy implements IProxy 
	{
		public static const NAME:String = "SoundProxy";
		
		[Embed(source = "../../Assets/sounds/bgMusic.mp3")] private var musicCl:Class;
		
		[Embed(source = "../../Assets/sounds/brickDrop.mp3")] private var brickCl:Class;
		[Embed(source = "../../Assets/sounds/click.mp3")] private var clickCl:Class;
		[Embed(source = "../../Assets/sounds/error.mp3")] private var errorCl:Class;
		[Embed(source = "../../Assets/sounds/keypress.mp3")] private var keypressCl:Class;
		
		public var soundsEnabled:Boolean;
		public var musicEnabled:Boolean;
		private var musicInstance:SoundChannel;
		
		public function Sounds() 
		{
			soundsEnabled = true;
			musicEnabled = true;
			
			PlayMusic();
		}
		
		public function PlayMusic():void {
			var music:Sound = new musicCl();
			musicInstance = music.play(0, 999999);
			musicInstance.soundTransform = new SoundTransform(0.2);
			musicEnabled = true;
		}
		
		public function StopMusic():void {
			musicInstance.stop();
			musicEnabled = false;
		}
		
		public function EffectClick():void {
			if (!soundsEnabled) return;
			var s:Sound = new clickCl();
			s.play();
		}
		
		public function EffectError():void {
			if (!soundsEnabled) return;
			var s:Sound = new errorCl();
			s.play();
		}
		
		public function EffectBrick():void {
			if (!soundsEnabled) return;
			var s:Sound = new brickCl();
			s.play();
		}
		
		public function EffectKeypress():void {
			if (!soundsEnabled) return;
			var s:Sound = new keypressCl();
			s.play();
		}
		
		override public function getProxyName():String 
		{
			return NAME;s
		}
	}

}