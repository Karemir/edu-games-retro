using System;
using System.Collections.Generic;
using System.Linq;

namespace QuestionsSL.Models {
	public class QQuestion {
		public string QuestionId { get; set; }
		public string QuestionText { get; set; }
		public int EpochId { get; set; }
		public string SimiliarTags { get; set; }

		public string Ans1Id { get; set; }
		public string Ans2Id { get; set; }
		public string Ans3Id { get; set; }
	}
}