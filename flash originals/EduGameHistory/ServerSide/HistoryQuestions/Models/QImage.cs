using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace HistoryQuestions.Models {
	public class QImageGroup {
		public string Name { get; set; }
		public IEnumerable<QImage> Images { get; set; }
	}

	public class QImage {
		[Key]
		public string ImageId { get; set; }

		public int EpochId { get; set; }
		public virtual QEpoch Epoch { get; set; }

		private List<string> tagString;
		public virtual ICollection<QTag> Tagnames { get; set; }

		public string Link { get; set; }
		public string Description { get; set; }
		public string Filepath { get; set; }

		[NotMapped]
		public string TagStrings {
			get {
				if (tagString != null) {
					return string.Join(",", tagString);
				} else if (Tagnames != null) {
					return string.Join(",", from t in Tagnames select t.Name);
				} else {
					return "";
				}
			}
			set {
				if (value == null) return;
				tagString = new List<string>();
				var splits = value.Split(new char[] { ' ', ',', ';' });
				foreach (string s in splits) {
					if (!string.IsNullOrWhiteSpace(s)) {
						tagString.Add(s.ToLower());
					}
				}
			}
		}

		public List<String> GetSplitTagStrings() {
			return tagString;
		}
	}
}