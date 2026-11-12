package Commands {
	import com.greensock.plugins.AutoAlphaPlugin;
	import com.greensock.plugins.MotionBlurPlugin;
	import com.greensock.plugins.Physics2DPlugin;
	import com.greensock.plugins.RemoveTintPlugin;
	import com.greensock.plugins.TransformAroundCenterPlugin;
	import com.greensock.plugins.TransformAroundPointPlugin;
	import com.greensock.plugins.TweenPlugin;
	import com.greensock.TweenLite;
	import com.greensock.plugins.TintPlugin;
	import flash.events.TimerEvent;
	import flash.text.Font;
	import flash.utils.setTimeout;
	import flash.utils.Timer;
	import flash.display.Stage;
	import flash.display.StageAlign;
	import flash.display.StageDisplayState;
	import flash.display.StageScaleMode;
	import flash.system.Capabilities;
	import org.puremvc.as3.interfaces.ICommand;
	import org.puremvc.as3.interfaces.INotification;
	import org.puremvc.as3.patterns.command.SimpleCommand;
	import Proxies.CommandHistory;
	import Proxies.SaveData;
	import Proxies.Sounds;
	
	/**
	 * ...
	 * @author Michal Perzak
	 */
	public class AppCommand extends SimpleCommand implements ICommand {
		[Embed(source="../../Assets/8-BIT WONDER.TTF", fontName = "8bit", fontFamily="8bit", fontStyle="normal", fontWeight="normal", mimeType="application/x-font", embedAsCFF="false")] private var mp_8bit:Class;		
		override public function execute(notification:INotification):void {
			var stage:Stage = notification.getBody() as Stage;
			
			facade.registerProxy(new CommandHistory());
			facade.registerProxy(new SaveData());
			facade.registerProxy(new Sounds());
			TweenPlugin.activate([TintPlugin, RemoveTintPlugin, AutoAlphaPlugin, MotionBlurPlugin, TransformAroundPointPlugin, TransformAroundCenterPlugin]);
			Logger.Log("AppCommand");
			
			stage.stageFocusRect = false;
			Font.registerFont(mp_8bit);
			Content.Init();

			// show main menu
			setTimeout(function():void {
				facade.sendNotification(Events.NAVIGATION_MENU, stage);
			}, 100);
			//facade.sendNotification(Events.NAVIGATION_PLAY_GAME, stage);
		}		
	}
}