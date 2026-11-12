import { embed } from "@edugames/common/AssetLoader.js";
import { Circ } from "@edugames/common/com/greensock/easing/Circ.js";
import { TweenLite } from "@edugames/common/com/greensock/TweenLite.js";
import { Bitmap } from "@edugames/common/flash/display/Bitmap.js";
import { Sprite } from "@edugames/common/flash/display/Sprite.js";
import { Event } from "@edugames/common/flash/events/Event.js";
import { MouseEvent } from "@edugames/common/flash/events/MouseEvent.js";
import type { Class } from "@edugames/common/flash/utils/Class.js";
import { AppFacade } from "../AppFacade.js";
import { Content } from "../Content.js";
import { Events } from "../Events.js";
import { RacerData } from "../Proxies/Data/RacerData.js";
import { VehicleData } from "../Proxies/Data/VehicleData.js";
import { GameData } from "../Proxies/GameData.js";
import { Sounds } from "../Proxies/Sounds.js";
import { AnimatedRacer } from "./AnimatedRacer.js";
import { NewGameSelectionPanel } from "./NewGameSelectionPanel.js";
import { SoundPanel } from "./SoundPanel.js";
import { TextButton } from "./TextButton.js";
import { TournamentSelectPanel } from "./TournamentSelectPanel.js";

/**
 * ...
 * @author Perzka Michalowy
 */
export class MainMenuScreen extends Sprite {
	
	// PORT: [Embed] fields registered with the AssetLoader, paths relative to index.html
	private static bmpNewGame: Class = embed("Assets/newGameBtn.png");
	private static bmpResumeGame: Class = embed("Assets/resumeGameBtn.png");
	private static bmpAchievements: Class = embed("Assets/achievementsBtn.png");
	private static bmpGarden: Class = embed("Assets/gardenBtn.png");
	
	public bgImg: Bitmap;
	public newGame: TextButton;
	public resume: TextButton;
	public achievements: TextButton;
	public garden: TextButton;
	public projectLogo: Sprite;
	
	public overlay: Sprite;
	public newGamePanel: NewGameSelectionPanel;
	public tournamentPanel: TournamentSelectPanel;
	
	public currentPanel: Sprite;
	public soundPanel: SoundPanel;
	
	constructor() {
		super();
		this.bgImg = Content.GetBitmap("menuBg");
		this.addChild(this.bgImg);
		
		this.resume = new TextButton("", new MainMenuScreen.bmpResumeGame());
		this.newGame = new TextButton("", new MainMenuScreen.bmpNewGame());
		this.garden = new TextButton("", new MainMenuScreen.bmpGarden());
		this.achievements = new TextButton("", new MainMenuScreen.bmpAchievements());

		this.projectLogo = new Sprite();
		this.projectLogo.graphics.beginFill(0, 0);
		this.projectLogo.graphics.drawRect(0, 0, 110, 110);
		
		//addChild(resume);
		this.addChild(this.newGame);
		this.addChild(this.garden);
		this.addChild(this.projectLogo);
		//addChild(achievements);
		
		this.resume.addEventListener(MouseEvent.CLICK, this.OnLoadGamePress);
		this.newGame.addEventListener(MouseEvent.CLICK, this.OnNewGamePress);
		this.garden.addEventListener(MouseEvent.CLICK, this.OnGarden);
		
		this.addEventListener(Event.ADDED_TO_STAGE, this.OnAdded);
	}
	
	private OnAdded(e: Event): void {
		this.garden.x = 852;
		this.garden.y = 378;
		
		this.achievements.x = this.garden.x - this.achievements.width - 8;
		this.achievements.y = this.garden.y;
		this.newGame.y = this.resume.y;
		
		this.overlay = new Sprite();
		
		this.resume.x = 621;
		this.resume.y = 326;
		
		this.newGame.x = 721;
		this.newGame.y = 340;
		this.overlay.alpha = 0;
		this.overlay.graphics.beginFill(0xffffff);
		this.overlay.graphics.drawRect(0, 0, this.stage.stageWidth, this.stage.stageHeight);
		
		this.soundPanel = new SoundPanel();
		this.soundPanel.x = 10;
		this.soundPanel.y = 450;
		this.addChild(this.soundPanel);
					
		this.projectLogo.x = this.stage.stageWidth - this.projectLogo.width;
		this.projectLogo.y = 0;
		this.projectLogo.buttonMode = true;

		this.newGamePanel = new NewGameSelectionPanel(this.ShowSelectTournament);	
		this.SetLoadButtonVisible();
					
		this.projectLogo.addEventListener(MouseEvent.CLICK, this.OnProjectLogo);
		//debug();
	}
	
	public SetLoadButtonVisible(): void {
		this.resume.visible = GameData.HasSavedGame();
	}
	
	public HandleKeypress(keycode: number): void {
		if (this.newGamePanel) {
			this.newGamePanel.HandleNameKey(keycode);
		}
	}
	
	private OnNewGamePress(e: Event): void {
		Sounds.MenuClickSound();
		// PORT: starting a game loads the last save (progress is saved after every race); without a save the new game panel opens as before.
		if (!this.currentPanel && GameData.HasSavedGame()) {
			var gameData: GameData = AppFacade.GetInstance().retrieveProxy(GameData.NAME) as GameData;
			if (gameData.LoadSavedGame()) {
				this.ShowSelectTournament();
				return;
			}
		}
		if (!this.currentPanel) {
			this.currentPanel = this.newGamePanel;
			this.addChild(this.overlay);
			this.addChild(this.newGamePanel);
			
			this.newGamePanel.x = this.stage.stageWidth;
			this.newGamePanel.y = 20;
			TweenLite.to(this.newGamePanel, 0.9, {x: this.stage.stageWidth / 2 - this.newGamePanel.width / 2, ease: Circ.easeOut});
			
			TweenLite.to(this.overlay, 0.7, {alpha: 0.7});
		}
	}
	
	public ShowSelectTournament(): void {
		this.tournamentPanel = new TournamentSelectPanel(this.HideAndCycleScreens);
		this.addChild(this.tournamentPanel);
		if (this.currentPanel) {
			TweenLite.to(this.currentPanel, 0.5, {x: -this.currentPanel.width, onComplete: () => { // PORT: arrow function, the closure uses members
					this.currentPanel = this.tournamentPanel;
				}});
		} else {
			this.overlay.alpha = 0.7;
			this.currentPanel = this.tournamentPanel;
		}
		if(!this.overlay.parent){
			this.addChildAt(this.overlay, 4);
		}
		this.tournamentPanel.x = this.stage.stageWidth;
		this.tournamentPanel.y = 20;
		TweenLite.to(this.tournamentPanel, 0.7, {delay: 0.5, x: this.stage.stageWidth / 2 - this.tournamentPanel.width / 2, ease: Circ.easeOut } );
	}
	
	public HideNewGamePanel(): void {
		if (this.newGamePanel) {
			TweenLite.to(this.newGamePanel, 0.7, {y: -this.newGamePanel.height, onComplete: () => { // PORT: arrow function, the closure uses members
					this.removeChild(this.newGamePanel);
					this.newGamePanel = null;
				}});
			TweenLite.to(this.overlay, 0.7, {alpha: 0, onComplete: () => { // PORT: arrow function, the closure uses members
					this.removeChild(this.overlay);
				}});
		}
	}
	
	public HideAndCycleScreens(raceId: string): void {
		TweenLite.to(this.currentPanel, 0.5, {x: -this.currentPanel.width, onComplete: function(): void {
			AppFacade.GetInstance().sendNotification(Events.MENU_TOURNAMENT_SELECTED, raceId);
		}});
	}
	
	private OnLoadGamePress(e: MouseEvent): void {
		Sounds.MenuClickSound();
		if (this.newGamePanel)
			return;
	}

	private OnGarden(e: MouseEvent): void {
		Sounds.MenuClickSound();
		// PORT: the garden is a page of its own now (the original opened GardenMediator over the game)
		location.assign("../garden/index.html");
		//AppFacade.GetInstance().registerMediator(new GardenMediator(stage));
	}
	
	private OnProjectLogo(e: Event): void {
		this.soundPanel.soundProxy.EffectClick();
		AppFacade.GetInstance().sendNotification(Events.NAVIGATE_URL, "http://www.grawklasy.edu.pl/");
	}
	
	private debug(): void {
		let veh: VehicleData = new VehicleData();
		veh.racer = new RacerData();
		veh.racer.vehicleImageId = 3;
		
		let r: AnimatedRacer = new AnimatedRacer(veh);
		r.x = 300;
		r.y = 300;
		this.stage.addChild(r);
	}

}
