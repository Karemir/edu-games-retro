package Proxies {
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
		[Embed(source="../../Assets/sounds/correct.mp3")]
		private var correctCl:Class;
		[Embed(source="../../Assets/sounds/click.mp3")]
		private var clickCl:Class;
		[Embed(source="../../Assets/sounds/error.mp3")]
		private var errorCl:Class;
		
		public function Sounds() {
		}
		
		public function EffectClick():void {
			var s:Sound = new clickCl();
			s.play();
		}
		
		public function EffectError():void {
			var s:Sound = new errorCl();
			s.play();
		}
		
		public function EffectCorrect():void {
			var s:Sound = new correctCl();
			s.play();
		}
		
		override public function getProxyName():String {
			return NAME;
		}
	}

}