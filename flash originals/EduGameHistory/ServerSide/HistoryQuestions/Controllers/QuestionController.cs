using HistoryQuestions.Models;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace HistoryQuestions.Controllers {
	public class QuestionController : Controller {
		QuestionContext context;
		public QuestionController() {
			context = new QuestionContext();
		}

		[HttpPost]
		public ActionResult PutImage(QImage image) {
			bool update = false;
			ICollection<QTag> oldtags = new List<QTag>();
			var oldImg = context.Images.FirstOrDefault(x => x.ImageId == image.ImageId);
			if (oldImg != null) {
				oldtags = oldImg.Tagnames;

				oldImg.Description = image.Description;
				oldImg.EpochId = image.EpochId;
				oldImg.TagStrings = image.TagStrings;
				oldImg.Link = image.Link;
				image = oldImg;
				update = true;
			}

			if (Request.InputStream != null && Request.ContentLength > 0) {
				// delete old image
				if (!string.IsNullOrEmpty(image.Filepath)) {
					string oldpath = Path.Combine(Server.MapPath("~/App_Data"), image.Filepath);
					FileInfo fi = new FileInfo(oldpath);
					try {
						fi.Delete();
					} catch (Exception) { }
				}

				image.Filepath = image.ImageId + ".jpg";
				byte[] buffer = new byte[4096];
				int bytesRead = 0;
				using (FileStream fs = new FileStream(Path.Combine(Server.MapPath("~/App_Data"), image.Filepath), FileMode.OpenOrCreate)) {
					while ((bytesRead = Request.InputStream.Read(buffer, 0, buffer.Length)) != 0) {
						fs.Write(buffer, 0, bytesRead);
					}
				}
			}

			var tags = image.GetSplitTagStrings();
			// first clear all tags, and later add new ones
			foreach (var oldtag in oldtags) {
				oldtag.Images.Remove(oldImg);
			}
			foreach (var tag in tags) {
				QTag existing = context.Tags.FirstOrDefault(x => x.Name == tag);
				if (existing == null) {
					existing = new QTag() { Name = tag, Images = new List<QImage>() };
					context.Tags.Add(existing);
				}
				if (image.Tagnames == null) { image.Tagnames = new List<QTag>(); }
				image.Tagnames.Add(existing);
				existing.Images.Add(image);
			}

			if (!update) {
				context.Images.Add(image);
			} else {
				context.Entry(image).State = System.Data.EntityState.Modified;
			}
			context.SaveChanges();
			return new ContentResult() { Content = image.ImageId, ContentType = "text/plain" };
		}

		public ActionResult DeleteImage(string ImageId) {
			QImage todel = context.Images.FirstOrDefault(x => x.ImageId == ImageId);
			if (todel != null) {
				string oldpath = Path.Combine(Server.MapPath("~/App_Data"), todel.Filepath);
				FileInfo fi = new FileInfo(oldpath);
				try {
					fi.Delete();
				} catch (Exception) { }

				context.Images.Remove(todel);
				context.SaveChanges();
				return new HttpStatusCodeResult(200);
			} else {
				return new HttpStatusCodeResult(404);
			}
		}

		public ActionResult GetImageListByTag(string tag, string filter) {
			var list = new List<string>();
			if (!string.IsNullOrEmpty(filter)) {
				filter = filter.ToLower();
				foreach (var img in context.Images) {
					if (img.Description.ToLower().Contains(filter)) {
						list.Add(img.ImageId);
					}
				}
			} else {
				var qtag = context.Tags.FirstOrDefault(x => x.Name == tag);
				if (qtag != null) {
					foreach (var img in qtag.Images) {
						list.Add(img.ImageId);
					}
				}
			}
			return Json(list, JsonRequestBehavior.AllowGet);
		}

		public ActionResult GetImageDescription(string imageId) {
			QImage img = context.Images.FirstOrDefault(x => x.ImageId == imageId);
			if (img == null) {
				return new HttpStatusCodeResult(404);
			}

			return new ContentResult() { Content = img.Description, ContentType = "text/plain" };
		}

		public ActionResult GetTagsAll() {
			var tags = from t in context.Tags where t.Images.Count > 0 || t.Questions.Count > 0 orderby t.Name select t.Name;
			return Json(tags.ToList(), JsonRequestBehavior.AllowGet);
		}

		public ActionResult GetTagsWithImages() {
			var tags = from t in context.Tags where t.Images.Count > 0 select t.Name;
			return Json(tags.ToList(), JsonRequestBehavior.AllowGet);
		}

		public ActionResult GetTagsWithQuestions() {
			var tags = from t in context.Tags where t.Questions.Count > 0 select t.Name;
			return Json(tags.ToList(), JsonRequestBehavior.AllowGet);
		}

		public ActionResult GetCopyrights() {
			var images = context.Images.ToList();
			StringBuilder sb = new StringBuilder();
			foreach (var img in images) {
				if (string.IsNullOrEmpty(img.Link)) { continue; }
				sb.AppendFormat("{0} \"{1}\" {2}\n", img.ImageId, img.Description, img.Link);
			}
			return new ContentResult() { Content = sb.ToString(), ContentType = "text/plain" };
		}

		public ActionResult Tags(QTagLookup lookup) {
			string[] tags = new string[0];
			if (!string.IsNullOrWhiteSpace(lookup.Tags)) {
				tags = lookup.Tags.Split(new char[] { ' ', ';', ',' });
			}
			List<QImageGroup> imgGroups = new List<QImageGroup>();

			foreach (var img in context.Images) {
				foreach (var tag in tags) {
					if (!img.Tagnames.Any(x => x.Name == tag)) {
						continue;
					}
					QImageGroup group = imgGroups.FirstOrDefault(x => x.Name == img.Epoch.Name);
					if (group == null) {
						group = new QImageGroup() { Name = img.Epoch.Name, Images = new List<QImage>() };
						imgGroups.Add(group);
					}
					(group.Images as List<QImage>).Add(img);
					break;
				}
			}
			ViewBag.Images = imgGroups;
			return View();
		}

		public ActionResult GetImageData(string imageId) {
			QImage img = context.Images.FirstOrDefault(x => x.ImageId == imageId);
			if (img == null) {
				return new HttpStatusCodeResult(404);
			}
			return Json(new QImage() {
				ImageId = img.ImageId,
				Link = img.Link,
				Description = img.Description,
				EpochId = img.EpochId,
				Filepath = img.Filepath,
				TagStrings = img.TagStrings
			}, JsonRequestBehavior.AllowGet);
		}

		public ActionResult GetQuestion(string questionId) {
			QQuestion question = context.Questions.FirstOrDefault(x => x.QuestionId == questionId);
			if (question == null) {
				return new HttpStatusCodeResult(404);
			}

			return Json(question, JsonRequestBehavior.AllowGet);
		}

		public ActionResult GetAllQuestions() {
			var allQs = context.Questions.OrderBy(x => x.QuestionText).ToList();
			return Json(allQs, JsonRequestBehavior.AllowGet);
		}

		public ActionResult GetAllQuestionsByEpoch(int epochId, int minDifficulty) {
			var allQs = context.Questions.Where(x => x.EpochId == epochId);

			List<QQuestion> matchingQs = new List<QQuestion>();
			foreach (var q in allQs) {
				if (minDifficulty == 0) { matchingQs.Add(q); continue; }
				if (minDifficulty == 1 && !string.IsNullOrWhiteSpace(q.Ans1Id) && !string.IsNullOrWhiteSpace(q.Ans2Id)) {
					matchingQs.Add(q);
					continue;
				}
				if (minDifficulty == 2 &&
					!string.IsNullOrWhiteSpace(q.Ans1Id) &&
					!string.IsNullOrWhiteSpace(q.Ans2Id) &&
					!string.IsNullOrWhiteSpace(q.Ans3Id)) {
					matchingQs.Add(q);
					continue;
				}
			}

			return Json(matchingQs, JsonRequestBehavior.AllowGet);
		}

		public ActionResult GetChoicesForImage(string questionId) {
			QQuestion question = context.Questions.FirstOrDefault(x => x.QuestionId == questionId);
			if (question == null) {
				return new HttpStatusCodeResult(404);
			}
			DisplayedQuestion disp = new DisplayedQuestion() {
				EpochId = question.EpochId,
				QuestionText = question.QuestionText,
				QuestionId = question.QuestionId
			};

			disp.CorrectImages = new List<string>();
			disp.BadImages = new List<string>();

			if (!string.IsNullOrWhiteSpace(question.Ans1Id)) { disp.CorrectImages.Add(question.Ans1Id); }
			if (!string.IsNullOrWhiteSpace(question.Ans2Id)) { disp.CorrectImages.Add(question.Ans2Id); }
			if (!string.IsNullOrWhiteSpace(question.Ans3Id)) { disp.CorrectImages.Add(question.Ans3Id); }

			// now get 8 other images
			var tagnames = question.SimiliarTags.Split(',', ' ', ';');
			List<QTag> tagsInQ = context.Tags.Where(x => tagnames.Contains(x.Name)).ToList();
			List<QImage> similiarImages = new List<QImage>();
			List<QImage> sameTagImages = new List<QImage>();

			foreach (var tag in tagsInQ) {
				foreach (var tagimg in tag.Images) {
					// similiar images must not already contain image with this id, secondly this id must not be present in correctImages
					// also they must match epochId.
					if (disp.CorrectImages.FirstOrDefault(x => x == tagimg.ImageId) == null && similiarImages.FirstOrDefault(x => x.ImageId == tagimg.ImageId) == null) {
						if (tagimg.EpochId == disp.EpochId) {
							similiarImages.Add(tagimg);
						} else {
							sameTagImages.Add(tagimg);
						}
					}
				}
			}
			Random r = new Random();
			int iterBlock = 0;
			while (similiarImages.Count < (8 - disp.CorrectImages.Count) && iterBlock++ < 20 && sameTagImages.Count > 0) {
				QImage rnd = sameTagImages[r.Next(sameTagImages.Count)];
				if (similiarImages.FirstOrDefault(x => x.ImageId == rnd.ImageId) == null) {
					similiarImages.Add(rnd);
				}
			}

			// if not enough images are found - add something random with the same epoch.
			iterBlock = 0;
			while (similiarImages.Count < (8 - disp.CorrectImages.Count) && iterBlock++ < 40) {
				var epochImgs = context.Images.Where(x => x.EpochId == disp.EpochId).ToList();
				QImage rndImg = epochImgs[r.Next(epochImgs.Count)];
				if (similiarImages.FirstOrDefault(x => x.ImageId == rndImg.ImageId) == null && disp.CorrectImages.FirstOrDefault(x => x == rndImg.ImageId) == null) {
					similiarImages.Add(rndImg);
				}
			}

			foreach (var img in similiarImages) {
				disp.BadImages.Add(img.ImageId);
			}

			// trim randomly results to have 8 elements
			while (disp.BadImages.Count > (8 - disp.CorrectImages.Count)) {
				disp.BadImages.RemoveAt(r.Next(disp.BadImages.Count));
			}

			disp.Difficulty = disp.CorrectImages.Count;

			return Json(disp, JsonRequestBehavior.AllowGet);
		}

		public ActionResult GetFilteredQuestions(string tag, string text) {
			var filteredQs = context.Questions.Where(x => x.QuestionText.Contains(text)).ToList().Where(x => x.HasTag(tag)).ToList();
			return Json(filteredQs, JsonRequestBehavior.AllowGet);
		}

		[HttpPost]
		public ActionResult CreateQuestion(QQuestion question) {
			if (question == null) {
				return new HttpStatusCodeResult(400, "no data was given");
			}
			var epoch = context.Epochs.FirstOrDefault(x => x.Id == question.EpochId);
			if (epoch == null) {
				string requestBody;
				using (var ms = new MemoryStream()) {
					Request.InputStream.CopyTo(ms);
					requestBody = Encoding.UTF8.GetString(ms.ToArray());
				}
				return new HttpStatusCodeResult(400, "epoch not found." + question.ToString() + " body: " + requestBody);
			}
			question.Epoch = epoch;
			context.Questions.Add(question);
			context.SaveChanges();
			return new HttpStatusCodeResult(200);
		}

		[HttpPost]
		public ActionResult UpdateQuestion(QQuestion question) {
			if (question == null) {
				return new HttpStatusCodeResult(400);
			}
			var origQuestion = context.Questions.FirstOrDefault(x => x.QuestionId == question.QuestionId);
			if (origQuestion == null) {
				return new HttpStatusCodeResult(404);
			}

			origQuestion.SimiliarTags = question.SimiliarTags;
			origQuestion.QuestionText = question.QuestionText;
			origQuestion.EpochId = question.EpochId;
			origQuestion.Ans1Id = question.Ans1Id;
			origQuestion.Ans2Id = question.Ans2Id;
			origQuestion.Ans3Id = question.Ans3Id;

			context.Entry(origQuestion).State = System.Data.EntityState.Modified;
			context.SaveChanges();
			return new HttpStatusCodeResult(200);
		}

		public ActionResult DeleteQuestion(string questionId) {
			var q = context.Questions.FirstOrDefault(x => x.QuestionId == questionId);
			if (q != null) {
				context.Questions.Remove(q);
				context.SaveChanges();
			}
			return new HttpStatusCodeResult(200);
		}

		public ActionResult GetImg(string imageId) {
			var img = context.Images.FirstOrDefault(x => x.ImageId == imageId);
			if (img != null) {
				return File(Path.Combine(Server.MapPath("~/App_Data"), img.Filepath), "image/jpeg");
			} else {
				return new HttpStatusCodeResult(404);
			}
		}

		public ActionResult GetStats() {
			int tagCount = context.Tags.Count();
			int imgCount = context.Images.Count();
			int questionCount = context.Questions.Count();

			return Json(new { tags = tagCount, imgs = imgCount, questions = questionCount }, JsonRequestBehavior.AllowGet);
		}

		public ActionResult GetEpochs() {
			return Json(context.Epochs.ToList(), JsonRequestBehavior.AllowGet);
		}
	}
}
