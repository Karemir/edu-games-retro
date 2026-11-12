using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace QuestionsSL.Models {
	public class QImage {
		public string ImageId { get; set; }
		public int EpochId { get; set; }
		public string TagStrings { get; set; }

		public string Link { get; set; }
		public string Description { get; set; }

		public static string BuildUrl(string id) {
			return App.GetHostPath() + "/Question/GetImg?imageId=" + id;
		}
	}
}