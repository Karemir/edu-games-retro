using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HistoryQuestions.Models {
	public class Achievement {
	
		public int Id { get; set; }
		public string Player { get; set; }
		/// <summary>
		/// Actual achievement id, id is just for db mapping.
		/// </summary>
		public int Code { get; set; }
		public DateTime Date { get; set; }
	}
}