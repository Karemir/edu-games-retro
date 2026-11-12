import { Back } from "@edugames/common/com/greensock/easing/Back.js";
import { TweenLite } from "@edugames/common/com/greensock/TweenLite.js";
import { Bitmap } from "@edugames/common/flash/display/Bitmap.js";
import { Sprite } from "@edugames/common/flash/display/Sprite.js";
import { MouseEvent } from "@edugames/common/flash/events/MouseEvent.js";
import { Matrix } from "@edugames/common/flash/geom/Matrix.js";
import type { TextField } from "@edugames/common/flash/text/TextField.js";
import { AppFacade } from "../AppFacade.js";
import { Content } from "../Content.js";
import { Events } from "../Events.js";
import type { VehicleData } from "../Proxies/Data/VehicleData.js";
import type { RaceData } from "../Proxies/RaceData.js";
import { SplitTextField } from "../SplitTextField.js";
import { TextStyles } from "../TextStyles.js";
import { AnimatedRacer } from "./AnimatedRacer.js";
import { Butterfly } from "./Butterfly.js";

/**
 * ...
 * @author Perz
 */
export class RaceScreen extends Sprite {
	public track: Bitmap;
	public clouds: Sprite;
	public background: Bitmap;
	public foreground: Bitmap;
	public raceData: RaceData;
	
	public gameContents: Sprite;
	
	public desiredWidth: number;
	public desiredHeight: number;
	public displayedText: SplitTextField;
	public currentLetter: number = 0; // PORT: int default
	
	public vehicles: AnimatedRacer[]; // PORT: Vector.<AnimatedRacer>
	public raceLength: number;
	public butterfly: Butterfly;
	
	constructor(raceData: RaceData, w: number, h: number) {
		super();
		this.raceData = raceData;
		this.clouds = new Sprite();
		this.track = Content.GetBitmap("GameTrack"+raceData.trackType);
		this.background = Content.GetBitmap("GameBackground"+raceData.trackType);
		this.foreground = Content.GetBitmap("GameForeground");
		this.butterfly = new Butterfly();
		
		this.desiredHeight = h;
		this.desiredWidth = w;
		this.raceLength = this.track.width;
		this.foreground.y = h - this.foreground.height;
		this.track.y = 40;
		this.butterfly.y = 20;
		this.butterfly.x = -100;

		this.clouds.addChild(Content.GetBitmap("GameClouds"));
		var tmpC: Bitmap = Content.GetBitmap("GameClouds");
		tmpC.x = tmpC.width;
		this.clouds.addChild(tmpC);
		
		this.gameContents = new Sprite();
		
		this.gameContents.addChild(this.clouds);
		this.gameContents.addChild(this.background);
		this.gameContents.addChild(this.track);

		this.LoadVehicles();
		this.PrepareRace();
		
		this.addChild(this.gameContents);
		this.addChild(this.foreground);
		this.addChild(this.butterfly);
	}
	
	private PrepareRace(): void {			
		for (var i: number = 0; i < this.raceData.racers.length; ++i) {
			var bmp: AnimatedRacer = this.vehicles[i];
			this.gameContents.addChild(bmp);
			bmp.x = this.raceData.racers[i].rt_position;
			bmp.y = 90 + i * 75;
		}
	}
	
	public SetText(text: string): void {
		text = text.toUpperCase();
		var txt: TextField = TextStyles.CreateGameText(text);
		this.displayedText = new SplitTextField(txt);
		this.addChild(this.displayedText);
		
		this.displayedText.x = this.stage.stageWidth / 2 - this.displayedText.width / 2;
		this.displayedText.y = 520;
		this.currentLetter = 0;
	}
	
	public LetterDone(): void {
		TweenLite.to(this.displayedText.textFields[this.currentLetter], 0.3, { tint:0x799f1c } );
		this.currentLetter++;
		if (!this.butterfly.isFlying) {
			this.butterfly.Fly();
		}
	}
	
	public Update(): void {
		for (var i: number = 0; i < this.raceData.racers.length; ++i) {
			this.vehicles[i].x = this.raceData.racers[i].rt_position;
		}
		
		this.clouds.transform.matrix = new Matrix(1,0,0,1, this.clouds.transform.matrix.tx - 1,0);
		if (this.clouds.transform.matrix.tx < -this.clouds.width / 2) {
			this.clouds.transform.matrix = new Matrix(1,0,0,1, this.clouds.transform.matrix.tx + this.clouds.width/2,0)
		}
		
		var pidx: number = this.raceData.GetPlayerIndex();
		var offset: number = (this.vehicles[pidx].x + this.vehicles[pidx].width) / this.raceLength - 0.3;
		var maxMove: number = this.raceLength - this.stage.stageWidth;
		
		if (offset > 0) {
			offset *= 2;
		}
		this.gameContents.x = -maxMove * Math.min(Math.max(offset, 0), 1);
		this.background.x = this.gameContents.x * 0.2; // move grass;
	}
	
	private LoadVehicles(): void {
		this.vehicles = []; // PORT: Vector.<AnimatedRacer>
		for (const veh of this.raceData.racers as VehicleData[]) {
			this.vehicles.push(new AnimatedRacer(veh));
		}
	}
	
	public ShowRaceEnd(position: number): void {
		var posScreen: Sprite = new Sprite();
		var bmp: Bitmap = Content.GetBitmap("place" + (position + 1));
		bmp.x = -bmp.width / 2;
		bmp.y = -bmp.height / 2;
		posScreen.addChild(bmp);
		posScreen.buttonMode = true;
		posScreen.addEventListener(MouseEvent.CLICK, function(): void{
			AppFacade.GetInstance().sendNotification(Events.GAME_END_VISUAL_RACE);
		});

		this.addChild(posScreen);
		posScreen.x = this.stage.stageWidth / 2;
		posScreen.y = this.stage.stageHeight / 2;
		posScreen.alpha = 0;
		posScreen.scaleX = 0.1;
		posScreen.scaleY = 0.1;
		
		TweenLite.to(posScreen, 1, { scaleX:1, scaleY:1, alpha:1, ease: Back.easeOut } );
	}
}
