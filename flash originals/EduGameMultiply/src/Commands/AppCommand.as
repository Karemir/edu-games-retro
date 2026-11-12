package Commands {
	import com.greensock.plugins.AutoAlphaPlugin;
	import com.greensock.plugins.MotionBlurPlugin;
	import com.greensock.plugins.Physics2DPlugin;
	import com.greensock.plugins.RemoveTintPlugin;
	import com.greensock.plugins.TransformAroundPointPlugin;
	import com.greensock.plugins.TweenPlugin;
	import com.greensock.TweenLite;
	import com.greensock.plugins.TintPlugin;
	import flash.events.TimerEvent;
	import flash.text.Font;
	import flash.utils.setTimeout;
	import flash.utils.Timer;
	import Proxies.GameProxy;
	import Proxies.GameTimer;
	import Proxies.HighscoreProxy;
	import Proxies.Sounds;
	
	import flash.display.Stage;
	import flash.display.StageAlign;
	import flash.display.StageDisplayState;
	import flash.display.StageScaleMode;
	import flash.system.Capabilities;
	import org.puremvc.as3.interfaces.ICommand;
	import org.puremvc.as3.interfaces.INotification;
	import org.puremvc.as3.patterns.command.SimpleCommand;
	
	/**
	 * ...
	 * @author Michal Perzak
	 */
	public class AppCommand extends SimpleCommand implements ICommand {
		[Embed(source = "../../Assets/MYRIADPRO-BOLD.OTF", fontName = "MBold", fontFamily="MBold", fontStyle="normal", fontWeight="normal", mimeType="application/x-font", embedAsCFF="false")] private var mp_bold:Class;		
		[Embed(source = "../../Assets/MYRIADPRO-REGULAR.OTF", fontName = "MReg", fontFamily="MReg", fontStyle="normal", fontWeight="normal", mimeType="application/x-font", embedAsCFF="false")] private var mp_reg:Class;		

		override public function execute(notification:INotification):void {
			var stage:Stage = notification.getBody() as Stage;
			
			facade.registerProxy(new GameProxy());
			facade.registerProxy(new HighscoreProxy());
			facade.registerProxy(new GameTimer());
			facade.registerProxy(new Sounds());
			TweenPlugin.activate([TintPlugin, RemoveTintPlugin, AutoAlphaPlugin, MotionBlurPlugin, TransformAroundPointPlugin]);
			Logger.Log("AppCommand");

			Content.Init();
			Font.registerFont(mp_bold);
			Font.registerFont(mp_reg);
			
			stage.stageFocusRect = false;
			
			// show main menu
			setTimeout(function():void {
				facade.sendNotification(Events.NAVIGATION_MENU, stage);
			}, 100);
		}		
	}
}