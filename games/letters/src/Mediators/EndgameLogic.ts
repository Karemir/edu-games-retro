import type { IMediator } from "@edugames/common/org/puremvc/as3/interfaces/IMediator.js";
import { Mediator } from "@edugames/common/org/puremvc/as3/patterns/mediator/Mediator.js";

/**
 * ...
 * @author Perzka Michalowy
 */
export class EndgameLogic extends Mediator implements IMediator 
{
	public static readonly NAME: string = "EndgameLogic";

	constructor(stageItem: Object) 
	{
		super(EndgameLogic.NAME, stageItem);
	}
	
}
