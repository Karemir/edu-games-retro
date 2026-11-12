using HistoryQuestions.Models;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace HistoryQuestions.Controllers {
	public class GardenController : Controller {
		public QuestionContext context;

		public GardenController() {
			context = new QuestionContext();
		}

		public ActionResult GetSlots(string player) {
			if (string.IsNullOrWhiteSpace(player)) {
				return new HttpStatusCodeResult(404);
			}

			var slots = context.GardenSlots.Where(x => x.Player == player).ToList();
			List<object> items = new List<object>();
			foreach (var slot in slots) {
				items.Add(new { slotId = slot.slotId, itemId = slot.rewardId });
			}
			return Json(items, JsonRequestBehavior.AllowGet);
		}

		public ActionResult ClearSlot(string player, string slotId) {
			if (string.IsNullOrWhiteSpace(player)) {
				return new HttpStatusCodeResult(404);
			}
			if (string.IsNullOrWhiteSpace(slotId)) {
				return new HttpStatusCodeResult(400);
			}

			int intSlotId = 0;
			if (!int.TryParse(slotId, out intSlotId)) {
				return new HttpStatusCodeResult(400, "bad slotId");
			}

			GardenSlot slot = context.GardenSlots.Where(x => x.Player == player && x.slotId == intSlotId).FirstOrDefault();
			if (slot != null) {
				context.GardenSlots.Remove(slot);
				context.SaveChanges();
			}

			return new HttpStatusCodeResult(200);
		}

		public ActionResult SetSlot(string player, string slotId, string rewardId) {
			int intSlotId = 0;
			int intRewardId = 0;
			if (string.IsNullOrWhiteSpace(player)) {
				return new HttpStatusCodeResult(404);
			}
			if (!int.TryParse(rewardId, out intRewardId)) {
				return new HttpStatusCodeResult(400, "bad rewardId");
			}
			if (!int.TryParse(slotId, out intSlotId)) {
				return new HttpStatusCodeResult(400, "bad slotId");
			}

			var placedReward = context.GardenSlots.Where(x => x.Player == player && x.rewardId == intRewardId).FirstOrDefault();
			if (placedReward != null) {
				context.GardenSlots.Remove(placedReward);
			}

			var givenSlot = context.GardenSlots.Where(x => x.Player == player && x.slotId == intSlotId).FirstOrDefault();
			if (givenSlot != null) {
				context.GardenSlots.Remove(placedReward);
			}

			GardenSlot newSlot = new GardenSlot() { slotId = intSlotId, Player = player, rewardId = intRewardId };
			context.GardenSlots.Add(newSlot);
			context.SaveChanges();

			return new HttpStatusCodeResult(200);
		}
	}
}
