import { Bitmap } from "@edugames/common/flash/display/Bitmap.js";
import { Sprite } from "@edugames/common/flash/display/Sprite.js";
import { Font } from "@edugames/common/flash/text/Font.js";
import { TextField } from "@edugames/common/flash/text/TextField.js";
import { TextFieldAutoSize } from "@edugames/common/flash/text/TextFieldAutoSize.js";
import { TextFormat } from "@edugames/common/flash/text/TextFormat.js";
import { embed } from "@edugames/common/AssetLoader.js";
import type { Class } from "@edugames/common/flash/utils/Class.js";
import { MathQuestion } from "../Data/MathQuestion.js";

/**
 * ...
 * @author Perz
 */

export class TowerBlock extends Sprite
{

	public static readonly BLOCK_HEIGHT: number = 65;
	public static readonly FLOOR_HEIGHT: number = 71;

	public static readonly TYPE_FLOOR: number = -1;
	public static readonly TYPE_A: number = 1;
	public static readonly TYPE_B: number = 2;
	public static readonly TYPE_C: number = 3;
	public static readonly TYPE_D: number = 4;

	private textFirst: TextField;
	private textSecond: TextField;
	private textThird: TextField;
	private textSign: TextField;
	private textSign2: TextField;
	public bg: Bitmap;
	public question: MathQuestion;

	private static segmentFloor: Class = embed("Assets/segmentFloor.png"); // PORT: embeds are static
	public blockType: number;

	constructor(type: number, count: number)
	{
		super();
		if (!TowerBlock.segs)
		{
			this.InitSegments();
		}

		this.blockType = type;
		this.mouseChildren = false;
		this.bg = this.GetBgImage(type, count);
		this.addChild(this.bg);


		this.textFirst = this.BuildTextField(true, 23);
		this.textSecond = this.BuildTextField(true, 23);
		this.textThird = this.BuildTextField(true, 23);
		this.textSign = this.BuildTextField(false, 22);
		this.textSign2 = this.BuildTextField(true, 20);

		this.addChild(this.textFirst);
		this.addChild(this.textSecond);
		this.addChild(this.textThird);
		this.addChild(this.textSign);
		this.addChild(this.textSign2);

		this.textSign.text = "x";
		this.textSign2.text = "=";
		this.bg.x = -this.bg.width / 2;
		this.bg.y = -this.bg.height + this.GetSegmentHeight();

		if (this.blockType == TowerBlock.TYPE_FLOOR)
		{
			this.bg.x -= 4;
		}
	}

	private BuildTextField(useBold: boolean, fontSize: number): TextField
	{
		const tmp: TextField = new TextField();
		let fontName: string = "MReg";
		if (useBold)
		{
			fontName = "MBold";
		}

		const tf: TextFormat = new TextFormat(fontName, fontSize);
		tmp.defaultTextFormat = tf;
		tmp.autoSize = TextFieldAutoSize.LEFT;
		tmp.selectable = false;
		tmp.embedFonts = true;
		tmp.cacheAsBitmap = true;

		return tmp;
	}

	private GetBgImage(type: number, count: number): Bitmap
	{

		switch (type)
		{
			case TowerBlock.TYPE_FLOOR:
				const floorSeg: Bitmap = new TowerBlock.segmentFloor() as Bitmap;
				floorSeg.smoothing = true;
				floorSeg.name = Math.random().toString();
				return floorSeg;
			case TowerBlock.TYPE_A:
			case TowerBlock.TYPE_B:
			case TowerBlock.TYPE_C:
			case TowerBlock.TYPE_D:
				return this.GetSegment(type, count);
		}

		return null;
	}

	public GetSegmentHeight(): number
	{
		if (this.blockType == TowerBlock.TYPE_FLOOR)
		{
			return TowerBlock.FLOOR_HEIGHT;
		}
		else
		{
			return TowerBlock.BLOCK_HEIGHT;
		}
	}

	public GetSegmentId(): number
	{
		return Number(this.bg.name) | 0; // PORT: int()
	}

	public SetQuestion(q: MathQuestion): void
	{
		this.question = q;

		this.QuestionUpdate();
		//DrawBackground();
	}

	public QuestionUpdate(): void
	{
		const values: Array<any> = this.question.ToSplicedString();
		this.textFirst.text = values[0];
		this.textSecond.text = values[1];
		this.textThird.text = values[2];

		// hardcode arrange textfields. bah!
		switch (this.blockType)
		{
			case TowerBlock.TYPE_FLOOR:
				this.textFirst.x = -66 - this.textFirst.width / 2;
				this.textFirst.y = 13;
				this.textSecond.x = -19 - this.textSecond.width / 2;
				this.textSecond.y = 13;
				this.textThird.x = 35 - this.textThird.width / 2;
				this.textThird.y = 13;
				this.textSign.x = -49;
				this.textSign.y = 13;
				this.textSign2.x = -3;
				this.textSign2.y = 14;
				break;
			case TowerBlock.TYPE_A:
			case TowerBlock.TYPE_B:
			case TowerBlock.TYPE_C:
			case TowerBlock.TYPE_D:
				this.textFirst.x = -67 - this.textFirst.width / 2;
				this.textFirst.y = 19;
				this.textSecond.x = -20 - this.textSecond.width / 2;
				this.textSecond.y = 19;
				this.textThird.x = 34 - this.textThird.width / 2;
				this.textThird.y = 19;
				this.textSign.x = -50;
				this.textSign.y = 19;
				this.textSign2.x = -4;
				this.textSign2.y = 20;
				break;
		}
	}

	//// SEGMENT FUNCTIONALITY
	// PORT: embeds are static
	private static segment1_1: Class = embed("Assets/segment1_1.png");
	private static segment1_2: Class = embed("Assets/segment1_2.png");
	private static segment1_3: Class = embed("Assets/segment1_3.png");
	private static segment1_4: Class = embed("Assets/segment1_4.png");
	private static segment2_1: Class = embed("Assets/segment2_1.png");
	private static segment2_2: Class = embed("Assets/segment2_2.png");
	private static segment2_3: Class = embed("Assets/segment2_3.png");
	private static segment2_4: Class = embed("Assets/segment2_4.png");
	private static segment2_5: Class = embed("Assets/segment2_5.png");
	private static segment2_6: Class = embed("Assets/segment2_6.png");
	private static segment3_1: Class = embed("Assets/segment3_1.png");
	private static segment3_2: Class = embed("Assets/segment3_2.png");
	private static segment3_3: Class = embed("Assets/segment3_3.png");
	private static segment3_4: Class = embed("Assets/segment3_4.png");
	private static segment3_5: Class = embed("Assets/segment3_5.png");
	private static segment3_6: Class = embed("Assets/segment3_6.png");
	private static segment4_1: Class = embed("Assets/segment4_1.png");
	private static segment4_2: Class = embed("Assets/segment4_2.png");
	private static segment4_3: Class = embed("Assets/segment4_3.png");

	private static segs: any = null; // PORT: Array used with string keys

	private InitSegments(): void
	{
		TowerBlock.segs = [];
		TowerBlock.segs["segment1_1"] = TowerBlock.segment1_1;
		TowerBlock.segs["segment1_2"] = TowerBlock.segment1_2;
		TowerBlock.segs["segment1_3"] = TowerBlock.segment1_3;
		TowerBlock.segs["segment1_4"] = TowerBlock.segment1_4;
		TowerBlock.segs["segment2_1"] = TowerBlock.segment2_1;
		TowerBlock.segs["segment2_2"] = TowerBlock.segment2_2;
		TowerBlock.segs["segment2_3"] = TowerBlock.segment2_3;
		TowerBlock.segs["segment2_4"] = TowerBlock.segment2_4;
		TowerBlock.segs["segment2_5"] = TowerBlock.segment2_5;
		TowerBlock.segs["segment2_6"] = TowerBlock.segment2_6;
		TowerBlock.segs["segment3_1"] = TowerBlock.segment3_1;
		TowerBlock.segs["segment3_2"] = TowerBlock.segment3_2;
		TowerBlock.segs["segment3_3"] = TowerBlock.segment3_3;
		TowerBlock.segs["segment3_4"] = TowerBlock.segment3_4;
		TowerBlock.segs["segment3_5"] = TowerBlock.segment3_5;
		TowerBlock.segs["segment3_6"] = TowerBlock.segment3_6;
		TowerBlock.segs["segment4_1"] = TowerBlock.segment4_1;
		TowerBlock.segs["segment4_2"] = TowerBlock.segment4_2;
		TowerBlock.segs["segment4_3"] = TowerBlock.segment4_3;
	}

	public GetSegment(type: number, count: number): Bitmap
	{
		let rnd: number = Math.random();
		switch (type)
		{
			case TowerBlock.TYPE_A:
				rnd *= 4;
				break;
			case TowerBlock.TYPE_B:
			case TowerBlock.TYPE_C:
				rnd *= 3;
				if (count > 4)
				{
					rnd += 3;
				}
				break;
			case TowerBlock.TYPE_D:
				rnd *= 3;
				break;
		}
		rnd = Math.floor(rnd) + 1;
		const segname: string = "segment" + type + "_" + rnd;
		const cl: Class = TowerBlock.segs[segname];
		if (cl == null)
		{
			throw new Error("Bitmap not found: " + segname);
		}
		const bmp: Bitmap = new cl();
		bmp.smoothing = true;
		bmp.name = rnd.toString();

		return bmp;
	}

}
