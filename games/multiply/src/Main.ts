// SMOKE TEST scene, replaced by the real Main port. Exercises the polyfills end to end.
import { Bitmap } from "@edugames/common/flash/display/Bitmap.js";
import { Sprite } from "@edugames/common/flash/display/Sprite.js";
import { Event } from "@edugames/common/flash/events/Event.js";
import { MouseEvent } from "@edugames/common/flash/events/MouseEvent.js";
import { Sound } from "@edugames/common/flash/media/Sound.js";
import { TextField } from "@edugames/common/flash/text/TextField.js";
import { TextFieldAutoSize } from "@edugames/common/flash/text/TextFieldAutoSize.js";
import { TextFormat } from "@edugames/common/flash/text/TextFormat.js";
import { TweenLite } from "@edugames/common/com/greensock/TweenLite.js";
import { Bounce } from "@edugames/common/com/greensock/easing/Bounce.js";
import { embed } from "@edugames/common/AssetLoader.js";
import type { Class } from "@edugames/common/flash/utils/Class.js";

export class Main extends Sprite {
	private static bgBmp: Class = embed("Assets/MenuBg.png");
	private static clickCl: Class = embed("Assets/sounds/click.mp3");
	private static mp_bold: Class = embed("Assets/MYRIADPRO-BOLD.OTF", { fontName: "MBold", fontFamily: "MBold", mimeType: "application/x-font" });

	private box: Sprite;
	private clicks: number = 0;
	private label: TextField;

	constructor() {
		super();
		this.addEventListener(Event.ADDED_TO_STAGE, this.OnStage);
	}

	private OnStage(e: Event): void {
		const bg: Bitmap = new Main.bgBmp() as Bitmap;
		bg.smoothing = true;
		bg.width = this.stage.stageWidth;
		bg.height = this.stage.stageHeight;
		this.addChild(bg);

		this.box = new Sprite();
		this.box.graphics.beginFill(0xFF8800);
		this.box.graphics.drawRect(0, 0, 160, 80);
		this.box.x = 40;
		this.box.y = 40;
		this.box.buttonMode = true;
		this.box.addEventListener(MouseEvent.CLICK, this.OnClick);
		this.addChild(this.box);

		this.label = new TextField();
		this.label.defaultTextFormat = new TextFormat("MBold", 36, 0xFFFFFF);
		this.label.embedFonts = true;
		this.label.autoSize = TextFieldAutoSize.LEFT;
		this.label.selectable = false;
		this.label.text = "click me";
		this.label.mouseEnabled = false;
		this.label.x = 10;
		this.label.y = 10;
		this.box.addChild(this.label);
	}

	private OnClick(e: MouseEvent): void {
		this.clicks++;
		this.label.text = "clicks: " + this.clicks;
		(new Main.clickCl() as Sound).play();
		TweenLite.to(this.box, 1, { y: 40 + 300, ease: Bounce.easeOut, onComplete: () => { TweenLite.to(this.box, 0.5, { y: 40 }); } });
	}
}
