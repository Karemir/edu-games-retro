using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace HistoryQuestions.Models {
	public class QuestionDbInitializer : CreateDatabaseIfNotExists<QuestionContext> {
		protected override void Seed(QuestionContext context) {
			context.Epochs.Add(new QEpoch() { Id= 1, Name = "Starożytność"});
			context.Epochs.Add(new QEpoch() { Id= 2, Name = "Średniowiecze" });
			context.Epochs.Add(new QEpoch() { Id= 3, Name = "Nowożytność"});
			context.Epochs.Add(new QEpoch() { Id= 4, Name = "XIX Wiek"});
			context.Epochs.Add(new QEpoch() { Id= 5, Name = "XX Wiek"});
			context.SaveChanges();

			base.Seed(context);
		}
	}

	public class QuestionContext : DbContext {
		public QuestionContext()
			: base("DefaultConnection") {

		}

		protected override void OnModelCreating(DbModelBuilder modelBuilder) {
			base.OnModelCreating(modelBuilder);
			modelBuilder.Entity<QTag>().HasMany(t => t.Images)
				.WithMany(c => c.Tagnames) // = Customer.Templates
				.Map(x => x.MapLeftKey("TagId")
				.MapRightKey("ImageId")
				.ToTable("ImageTags"));
		}

		public DbSet<QQuestion> Questions { get; set; }
		public DbSet<QEpoch> Epochs { get; set; }
		public DbSet<QImage> Images { get; set; }
		public DbSet<QTag> Tags { get; set; }
		public DbSet<Achievement> Achievements { get; set; }
		public DbSet<GardenSlot> GardenSlots { get; set; }
	}

	public class QQuestion {
		[Key]
		public string QuestionId { get; set; }
		[Required]
		[Display(Name = "Pytanie")]
		public string QuestionText { get; set; }

		[Display(Name = "Epoka")]
		public int EpochId { get; set; }
		public virtual QEpoch Epoch { get; set; }

		[Required]
		[Display(Name = "Tagi zdjęć podobnych")]
		public string SimiliarTags { get; set; }

		[Display(Name="Id obrazka 1")]
		public string Ans1Id { get; set; }
		[Display(Name = "Id obrazka 2")]
		public string Ans2Id { get; set; }
		[Display(Name = "Id obrazka 3")]
		public string Ans3Id { get; set; }

		public bool HasTag(string tag) {
			if(string.IsNullOrWhiteSpace(tag)) return true;

			var tags = SimiliarTags.Split(new char[] { ' ', ',', ';' });
			foreach (var t in tags) {
				if (t == tag) { return true; }
			}
			return false;
		}

		public override string ToString() {
			return string.Format("qid: {0} text: {1} epoch: {2} tags: {3}", QuestionId, QuestionText, EpochId, SimiliarTags);
		}
	}
}