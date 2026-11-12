using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HistoryQuestions.Models {
	public class DisplayedQuestion {
		public string QuestionId { get; set; }
		public int EpochId { get; set; }
		/// <summary>
		/// Difficulty is an amount of good answers. 1 answer - 0 dif, 2 answers - 1 dif, 3 answers (max) is 2 difficulty
		/// </summary>
		public int Difficulty { get; set; }
		public string QuestionText { get; set; }
		public List<string> CorrectImages { get; set; }
		public List<string> BadImages { get; set; }
	}
}