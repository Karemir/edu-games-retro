package Commands {
	import com.greensock.plugins.AutoAlphaPlugin;
	import com.greensock.plugins.DynamicPropsPlugin;
	import com.greensock.plugins.MotionBlurPlugin;
	import com.greensock.plugins.Physics2DPlugin;
	import com.greensock.plugins.RemoveTintPlugin;
	import com.greensock.plugins.TransformAroundPointPlugin;
	import com.greensock.plugins.TweenPlugin;
	import com.greensock.TweenLite;
	import com.greensock.plugins.TintPlugin;
	import flash.events.TimerEvent;
	import flash.text.Font;
	import flash.utils.Timer;
	import Proxies.GameData;
	import Proxies.RaceData;
	import Proxies.Sounds;
	import Proxies.Words;
	
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
		[Embed(source="../../Assets/MyriadPro-Bold.ttf", fontName = "MBold", fontFamily="MBold", fontStyle="normal", fontWeight="normal", mimeType="application/x-font", embedAsCFF="false")] private var mp_bold:Class;		
		
		override public function execute(notification:INotification):void {
			var stage:Stage = notification.getBody() as Stage;
			stage.stageFocusRect = false;

			Font.registerFont(mp_bold);

			facade.registerProxy(new RaceData());
			facade.registerProxy(new GameData());
			facade.registerProxy(new Words());
			facade.registerProxy(new Sounds());
			TweenPlugin.activate([TintPlugin, RemoveTintPlugin, AutoAlphaPlugin, MotionBlurPlugin, TransformAroundPointPlugin, DynamicPropsPlugin]);
			Logger.Log("AppCommand");
			
			// show main menu
			facade.sendNotification(Events.NAVIGATE_MAIN_MENU, stage);
		}
	}
}