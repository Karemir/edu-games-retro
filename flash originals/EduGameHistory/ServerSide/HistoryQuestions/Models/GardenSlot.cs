using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HistoryQuestions.Models {
	public class GardenSlot {
		public int Id { get; set; }
		public string Player { get; set; }
		public int rewardId { get; set; }
		public int slotId { get; set; }
	}
}