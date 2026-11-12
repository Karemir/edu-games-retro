package Commands {
	import com.greensock.plugins.*;
	import flash.display.*;
	import flash.text.*;
	import Mediators.*;
	import org.puremvc.as3.interfaces.*;
	import org.puremvc.as3.patterns.command.*;
	import Proxies.*;
	
	/**
	 * ...
	 * @author Michal Perzak
	 */
	public class AppCommand extends SimpleCommand implements ICommand {
		[Embed(source="../../Assets/Andale Mono.ttf", fontName = "andale", fontFamily="andale", fontStyle="normal", fontWeight="normal", mimeType="application/x-font", embedAsCFF="false")] private var mp_andale:Class;		

		override public function execute(notification:INotification):void {
			var stage:Stage = notification.getBody() as Stage;
			stage.scaleMode = StageScaleMode.SHOW_ALL;
			
			facade.registerProxy(new QuestionProxy()); 
			facade.registerProxy(new QuizConfigProxy());
			facade.registerProxy(new HighscoreProxy());
			facade.registerProxy(new Sounds());
			TweenPlugin.activate([TintPlugin, RemoveTintPlugin, AutoAlphaPlugin, DropShadowFilterPlugin]);
			Logger.Log("AppCommand");
			
			stage.stageFocusRect = false;
			Font.registerFont(mp_andale);

			// show main menu
			facade.registerMediator(new SplashMediator(stage));			
		}		
	}
}