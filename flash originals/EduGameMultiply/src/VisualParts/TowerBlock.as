package VisualParts
{
	import com.greensock.motionPaths.Direction;
	import Data.MathQuestion;
	import flash.display.Bitmap;
	import flash.display.Sprite;
	import flash.text.Font;
	import flash.text.TextField;
	import flash.text.TextFieldAutoSize;
	import flash.text.TextFormat;
	
	/**
	 * ...
	 * @author Perz
	 */
	
	public class TowerBlock extends Sprite
	{
		
		public static const BLOCK_HEIGHT:int = 65;
		public static const FLOOR_HEIGHT:int = 71;
		
		public static const TYPE_FLOOR:int = -1;
		public static const TYPE_A:int = 1;
		public static const TYPE_B:int = 2;
		public static const TYPE_C:int = 3;
		public static const TYPE_D:int = 4;
		
		private var textFirst:TextField;
		private var textSecond:TextField;
		private var textThird:TextField;
		private var textSign:TextField;
		private var textSign2:TextField;
		public var bg:Bitmap;
		public var question:MathQuestion;
		
		[Embed(source="../../Assets/segmentFloor.png")]
		private var segmentFloor:Class;
		public var blockType:int;
		
		public function TowerBlock(type:int, count:int)
		{
			if (!segs)
			{
				InitSegments();
			}
			
			blockType = type;
			mouseChildren = false;
			bg = GetBgImage(type, count);
			addChild(bg);
			
			
			textFirst = BuildTextField(true, 23);
			textSecond = BuildTextField(true, 23);
			textThird = BuildTextField(true, 23);
			textSign = BuildTextField(false, 22);
			textSign2 = BuildTextField(true, 20);
			
			addChild(textFirst);
			addChild(textSecond);
			addChild(textThird);
			addChild(textSign);
			addChild(textSign2);
			
			textSign.text = "x";
			textSign2.text = "=";
			bg.x = -bg.width / 2;
			bg.y = -bg.height + GetSegmentHeight();

			if (blockType == TYPE_FLOOR)
			{
				bg.x -= 4;
			}
		}
		
		private function BuildTextField(useBold:Boolean, fontSize:int):TextField
		{
			var tmp:TextField = new TextField();
			var fontName:String = "MReg";
			if (useBold)
			{
				fontName = "MBold";
			}
			
			var tf:TextFormat = new TextFormat(fontName, fontSize);
			tmp.defaultTextFormat = tf;
			tmp.autoSize = TextFieldAutoSize.LEFT;
			tmp.selectable = false;
			tmp.embedFonts = true;
			tmp.cacheAsBitmap = true;
			
			return tmp;
		}
		
		private function GetBgImage(type:int, count:int):Bitmap
		{
			
			switch (type)
			{
				case TYPE_FLOOR: 
					var floorSeg:Bitmap = new segmentFloor() as Bitmap;
					floorSeg.smoothing = true;
					floorSeg.name = Math.random().toString();
					return floorSeg;
				case TYPE_A: 
				case TYPE_B: 
				case TYPE_C: 
				case TYPE_D: 
					return GetSegment(type, count);
			}
			
			return null;
		}
		
		public function GetSegmentHeight():int
		{
			if (this.blockType == TYPE_FLOOR)
			{
				return FLOOR_HEIGHT;
			}
			else
			{
				return BLOCK_HEIGHT;
			}
		}
		
		public function GetSegmentId():int
		{
			return int(bg.name);
		}
		
		public function SetQuestion(q:MathQuestion):void
		{
			question = q;
			
			QuestionUpdate();
			//DrawBackground();
		}
		
		public function QuestionUpdate():void
		{
			var values:Array = question.ToSplicedString();
			textFirst.text = values[0];
			textSecond.text = values[1];
			textThird.text = values[2];
			
			// hardcode arrange textfields. bah!
			switch (blockType)
			{
				case TYPE_FLOOR: 
					textFirst.x = -66 - textFirst.width / 2;
					textFirst.y = 13;
					textSecond.x = -19 - textSecond.width / 2;
					textSecond.y = 13;
					textThird.x = 35 - textThird.width / 2;
					textThird.y = 13;
					textSign.x = -49;
					textSign.y = 13;
					textSign2.x = -3;
					textSign2.y = 14;
					break;
				case TYPE_A: 
				case TYPE_B: 
				case TYPE_C: 
				case TYPE_D: 
					textFirst.x = -67 - textFirst.width / 2;
					textFirst.y = 19;
					textSecond.x = -20 - textSecond.width / 2;
					textSecond.y = 19;
					textThird.x = 34 - textThird.width / 2;
					textThird.y = 19;
					textSign.x = -50;
					textSign.y = 19;
					textSign2.x = -4;
					textSign2.y = 20;
					break;
			}
		}
		
		//// SEGMENT FUNCTIONALITY
		[Embed(source="../../Assets/segment1_1.png")]
		private var segment1_1:Class;
		[Embed(source="../../Assets/segment1_2.png")]
		private var segment1_2:Class;
		[Embed(source="../../Assets/segment1_3.png")]
		private var segment1_3:Class;
		[Embed(source="../../Assets/segment1_4.png")]
		private var segment1_4:Class;
		[Embed(source="../../Assets/segment2_1.png")]
		private var segment2_1:Class;
		[Embed(source="../../Assets/segment2_2.png")]
		private var segment2_2:Class;
		[Embed(source="../../Assets/segment2_3.png")]
		private var segment2_3:Class;
		[Embed(source="../../Assets/segment2_4.png")]
		private var segment2_4:Class;
		[Embed(source="../../Assets/segment2_5.png")]
		private var segment2_5:Class;
		[Embed(source="../../Assets/segment2_6.png")]
		private var segment2_6:Class;
		[Embed(source="../../Assets/segment3_1.png")]
		private var segment3_1:Class;
		[Embed(source="../../Assets/segment3_2.png")]
		private var segment3_2:Class;
		[Embed(source="../../Assets/segment3_3.png")]
		private var segment3_3:Class;
		[Embed(source="../../Assets/segment3_4.png")]
		private var segment3_4:Class;
		[Embed(source="../../Assets/segment3_5.png")]
		private var segment3_5:Class;
		[Embed(source="../../Assets/segment3_6.png")]
		private var segment3_6:Class;
		[Embed(source="../../Assets/segment4_1.png")]
		private var segment4_1:Class;
		[Embed(source="../../Assets/segment4_2.png")]
		private var segment4_2:Class;
		[Embed(source="../../Assets/segment4_3.png")]
		private var segment4_3:Class;
		
		private static var segs:Array = null;
		
		private function InitSegments():void
		{
			segs = [];
			segs["segment1_1"] = segment1_1;
			segs["segment1_2"] = segment1_2;
			segs["segment1_3"] = segment1_3;
			segs["segment1_4"] = segment1_4;
			segs["segment2_1"] = segment2_1;
			segs["segment2_2"] = segment2_2;
			segs["segment2_3"] = segment2_3;
			segs["segment2_4"] = segment2_4;
			segs["segment2_5"] = segment2_5;
			segs["segment2_6"] = segment2_6;
			segs["segment3_1"] = segment3_1;
			segs["segment3_2"] = segment3_2;
			segs["segment3_3"] = segment3_3;
			segs["segment3_4"] = segment3_4;
			segs["segment3_5"] = segment3_5;
			segs["segment3_6"] = segment3_6;
			segs["segment4_1"] = segment4_1;
			segs["segment4_2"] = segment4_2;
			segs["segment4_3"] = segment4_3;
		}
		
		public function GetSegment(type:int, count:int):Bitmap
		{
			var rnd:Number = Math.random();
			switch (type)
			{
				case TYPE_A: 
					rnd *= 4;
					break;
				case TYPE_B: 
				case TYPE_C: 
					rnd *= 3;
					if (count > 4)
					{
						rnd += 3;
					}
					break;
				case TYPE_D: 
					rnd *= 3;
					break;
			}
			rnd = Math.floor(rnd) + 1;
			var segname:String = "segment" + type + "_" + rnd;
			var cl:Class = segs[segname];
			if (cl == null)
			{
				throw new Error("Bitmap not found: " + segname);
			}
			var bmp:Bitmap = new cl();
			bmp.smoothing = true;
			bmp.name = rnd.toString();
			
			return bmp;
		}
	
	}

}