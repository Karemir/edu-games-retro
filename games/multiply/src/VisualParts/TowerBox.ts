import { Bounce } from "@edugames/common/com/greensock/easing/Bounce.js";
import { Circ } from "@edugames/common/com/greensock/easing/Circ.js";
import { Cubic } from "@edugames/common/com/greensock/easing/Cubic.js";
import { Expo } from "@edugames/common/com/greensock/easing/Expo.js";
import { Quad } from "@edugames/common/com/greensock/easing/Quad.js";
import { TweenLite } from "@edugames/common/com/greensock/TweenLite.js";
import { Sprite } from "@edugames/common/flash/display/Sprite.js";
import { Point } from "@edugames/common/flash/geom/Point.js";
import { setTimeout } from "@edugames/common/flash/utils/setTimeout.js";
import { MathQuestion } from "../Data/MathQuestion.js";
import { Sounds } from "../Proxies/Sounds.js";
import { AppFacade } from "../AppFacade.js";
import { Events } from "../Events.js";
import { Logger } from "../Logger.js";
import { HeightIndicator } from "./HeightIndicator.js";
import { TowerBackground } from "./TowerBackground.js";
import { TowerBlock } from "./TowerBlock.js";
import { TowerBlockAddon } from "./TowerBlockAddon.js";
import { TowerRoof } from "./TowerRoof.js";

/**
 * ...
 * @author Perz
 */
export class TowerBox extends Sprite {
	public static readonly ADDON_PROBABILITY: number = 0.4;

	public currentBlock: TowerBlock;
	public currentAddon: TowerBlockAddon;
	private blockPanel: Sprite;
	private towerVisibleHeight: number;

	private maskingSprite: Sprite;
	private desiredWidth: number;
	private desiredHeight: number;

	public background: TowerBackground;
	public indicator: HeightIndicator;
	public soundProxy: Sounds;

	private lastBlockType: number;
	private blockTypeCount: number;

	constructor(w: number, h: number) {
		super();
		this.desiredHeight = h;
		this.desiredWidth = w;

		this.currentBlock = null;
		this.blockTypeCount = 0;

		this.graphics.beginFill(0xff0000, 0.1);
		this.graphics.drawRect(0, 0, w, h);
		this.graphics.endFill();

		this.maskingSprite = new Sprite();
		this.maskingSprite.graphics.beginFill(0xff00, 0.3);
		this.maskingSprite.graphics.drawRect(0, 0, w, h);

		this.background = new TowerBackground(w, h);
		this.addChild(this.background);

		this.addChild(this.maskingSprite);
		this.mask = this.maskingSprite;

		this.blockPanel = new Sprite();
		this.addChild(this.blockPanel);
		this.blockPanel.x = w / 2 - 5;
		this.blockPanel.y = h; // tower base height
		this.towerVisibleHeight = 0;

		this.indicator = new HeightIndicator(h);
		this.indicator.SetPerson(TowerBlock.TYPE_A);
		this.indicator.UpdateHeightTxt(0);
		this.addChild(this.indicator);
		this.indicator.x = w;
		this.indicator.y = 0;
		this.lastBlockType = TowerBlock.TYPE_A;

		this.soundProxy = AppFacade.GetInstance().retrieveProxy(Sounds.NAME) as Sounds;
	}

	public HandleQuestionAnswer(): void {
		if (!this.currentBlock)
			return;

		this.currentBlock.QuestionUpdate();

		if (this.currentBlock.question.answerType == MathQuestion.ANSWER_CORRECT) {
			this.PlaceBlockOnTower();
		} else if (this.currentBlock.question.answerType == MathQuestion.ANSWER_BAD) {
			this.DestroyBlock(true);
		} else {
			Logger.Log("Something wrong: handle waiting answer");
		}
	}

	public NextQuestion(q: MathQuestion): void {
		if (this.currentBlock) {
			this.DestroyBlock(true);
		}

		let blockType: number = TowerBlock.TYPE_FLOOR;
		if (this.blockPanel.numChildren > 0) {
			switch (q.difficultyLevel) {
				case 1:
					blockType = TowerBlock.TYPE_A;
					break;
				case 2:
					blockType = TowerBlock.TYPE_B;
					break;
				case 3:
					blockType = TowerBlock.TYPE_C;
					break;
				case 4:
					blockType = TowerBlock.TYPE_D;
					break;
			}
		}

		if (this.lastBlockType != blockType) {
			this.blockTypeCount = 0;
		} else {
			this.blockTypeCount += 1;
		}

		this.currentBlock = new TowerBlock(blockType, this.blockTypeCount);
		this.currentBlock.SetQuestion(q);
		this.addChild(this.currentBlock);
		this.currentBlock.y = 100;
		this.currentBlock.x = this.blockPanel.x; //desiredWidth / 2 - currentBlock.width/2;
		this.currentBlock.alpha = 0;
		TweenLite.to(this.currentBlock, 0.3, {alpha: 1});
	}

	public EndGame(): void {
		if (this.currentBlock) {
			this.DestroyBlock(false);
		}
		const roof: TowerRoof = new TowerRoof(this.lastBlockType);
		this.addChild(roof);
		roof.y = 0;
		roof.x = this.blockPanel.x; // alignments

		setTimeout(this.soundProxy.EffectBrick, 300);
		setTimeout(this.soundProxy.EffectBrick, 700);
		setTimeout(this.soundProxy.EffectBrick, 900);
		TweenLite.to(roof, 1, {y: this.desiredHeight - this.towerVisibleHeight - 50, motionBlur: true, ease: Bounce.easeOut});
	}

	private PlaceBlockOnTower(): void {
		const bounceAt: number = (this.desiredHeight - this.towerVisibleHeight - 100) | 0; // PORT: int()
		if (this.currentAddon) { this.currentAddon.Hide(); this.currentAddon = null; }

		AppFacade.GetInstance().sendNotification(Events.GAME_SEGMENT_FALLING);

		setTimeout(this.soundProxy.EffectBrick, 300);
		setTimeout(this.soundProxy.EffectBrick, 700);
		setTimeout(this.soundProxy.EffectBrick, 900);

		// PORT: arrow function keeps `this` (AS3 closures resolve members through the enclosing instance)
		TweenLite.to(this.currentBlock, 1, {y: bounceAt, motionBlur: true, ease: Bounce.easeOut, onComplete: () => {
				const blockHeight: number = this.currentBlock.GetSegmentHeight();

				for (let i: number = 0; i < this.blockPanel.numChildren; ++i) {
					this.blockPanel.getChildAt(i).y += blockHeight;
				}

				this.blockPanel.y -= blockHeight;
				const panelLocal: Point = this.blockPanel.globalToLocal(this.currentBlock.localToGlobal(new Point(0, 0)));
				this.currentBlock.x = panelLocal.x;
				this.currentBlock.y = panelLocal.y;

				this.blockPanel.addChild(this.currentBlock);

				if (this.blockPanel.y < this.desiredHeight / 2) {
					TweenLite.to(this.blockPanel, 0.5, {y: this.desiredHeight / 2});
					this.towerVisibleHeight = (this.desiredHeight / 2) | 0; // PORT: int field assigned a Number

					const growAmount: number = this.desiredHeight / 2 - this.blockPanel.y;
					this.indicator.AddHeight(growAmount, 0.5);
					this.background.AddHeight(growAmount * 1.2, 0.5);
				} else {
					this.towerVisibleHeight += this.currentBlock.GetSegmentHeight();
				}

				if(this.lastBlockType != this.currentBlock.blockType && this.currentBlock.blockType != TowerBlock.TYPE_FLOOR){
					this.lastBlockType = this.currentBlock.blockType;
					this.indicator.SetPerson(this.lastBlockType);
				}
				this.ShowAddon();
				this.currentBlock = null;

				AppFacade.GetInstance().sendNotification(Events.GAME_SEGMENT_PLACED);
				AppFacade.GetInstance().sendNotification(Events.GAME_TOWER_GROWS, blockHeight);
				AppFacade.GetInstance().sendNotification(Events.CREATE_NEW_QUESTION);
			}});
	}

	private ShowAddon(): void {
		if (Math.random() > TowerBox.ADDON_PROBABILITY || this.currentBlock.blockType == TowerBlock.TYPE_FLOOR) {
			return;
		}

		this.currentAddon = new TowerBlockAddon(this.currentBlock);
		this.currentAddon.Show();
	}

	private DestroyBlock(isBadAnswer: boolean): void {
		if (!this.currentBlock) return;

		if (isBadAnswer) {
			const tmpBlock: TowerBlock = this.currentBlock;
			this.currentBlock.QuestionUpdate();
			this.currentBlock = null;
			// PORT: arrow functions keep `this`; removeChild is a native method, so it is bound by hand
			TweenLite.to(tmpBlock, 0.4, { ease:Bounce.easeOut, scaleX:1.5, scaleY:1.5 ,
				onUpdate: () => { this.setChildIndex(tmpBlock, this.numChildren-1);},
				onComplete: () => { setTimeout( this.removeChild.bind(this), 3000, tmpBlock); } } );
		} else {
			TweenLite.killTweensOf(this.currentBlock);
			this.removeChild(this.currentBlock);
			this.currentBlock = null;
		}
	}
}
