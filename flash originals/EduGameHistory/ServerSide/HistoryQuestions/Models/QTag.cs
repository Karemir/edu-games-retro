using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace HistoryQuestions.Models
{
    public class QTag
    {
		[Key]
        public int TagId { get; set; }
        public string Name { get; set; }
		public virtual ICollection<QImage> Images { get; set; }
		public virtual ICollection<QQuestion> Questions { get; set; }
    }

    public class QTagLookup
    {
		public string Tags { get; set; }
    }
}