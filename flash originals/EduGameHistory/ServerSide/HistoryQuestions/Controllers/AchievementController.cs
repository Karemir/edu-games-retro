using HistoryQuestions.Models;
using System;
using System.Linq;
using System.Web.Mvc;

namespace HistoryQuestions.Controllers {
	public class AchievementController : Controller {
		public QuestionContext context;

		public AchievementController() {
			context = new QuestionContext();
		}

		public ActionResult GetAll(string player) {
			if (string.IsNullOrWhiteSpace(player)) {
				return new HttpStatusCodeResult(404);
			}

			var list = context.Achievements.Where(x => x.Player == player).ToList();
			return Json(list, JsonRequestBehavior.AllowGet);
		}

		public ActionResult Set(string player, string code) {
			if (string.IsNullOrWhiteSpace(player)) {
				return new HttpStatusCodeResult(404);
			}

			int intCode = 0;
			if (string.IsNullOrWhiteSpace(code) || !int.TryParse(code, out intCode) || intCode == 0) {
				return new HttpStatusCodeResult(400, "bad code");
			}

			context.Achievements.Add(new Achievement() { Player = player, Code = intCode, Date = DateTime.Now });
			context.SaveChanges();
			return new HttpStatusCodeResult(200);
		}

		public ActionResult Clear(string player) {
			if (string.IsNullOrWhiteSpace(player)) {
				return new HttpStatusCodeResult(404);
			}

			var achivs = context.Achievements.Where(x => x.Player == player);
			foreach (var ach in achivs) {
				context.Achievements.Remove(ach);
			}
			context.SaveChanges();
			return new HttpStatusCodeResult(200);
		}

	}
}
