package Mediators 
{
	import org.puremvc.as3.interfaces.IMediator;
	import org.puremvc.as3.patterns.mediator.Mediator;
	
	/**
	 * ...
	 * @author Perzka Michalowy
	 */
	public class EndgameLogic extends Mediator implements IMediator 
	{
		public static const NAME:String = "EndgameLogic";

		public function EndgameLogic(stageItem:Object) 
		{
			super(NAME, stageItem);
		}
		
	}

}