using Newtonsoft.Json;
using QuestionsSL.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;

namespace QuestionsSL {
	public partial class QuestionEdit : UserControl {
		public QQuestion QuestionData { get; set; }
		public bool IsInEditMode;
		private ImageList imageSelector;

		public event EventHandler OnSave;
		public event EventHandler OnCancel;

		public QuestionEdit() {
			InitializeComponent();
			IsInEditMode = false;
			QuestionData = new QQuestion() { QuestionId = Guid.NewGuid().ToString() };
			DataContext = QuestionData;
			epochs.ItemsSource = App.Epochs;
		}

		public QuestionEdit(QQuestion question) {
			InitializeComponent();
			IsInEditMode = true;
			QuestionData = question;
			question.EpochId -= 1; // indexing! doh.
			DataContext = question;
			epochs.ItemsSource = App.Epochs;

			img1.Source = new BitmapImage(new Uri(QImage.BuildUrl(question.Ans1Id)));
			img2.Source = new BitmapImage(new Uri(QImage.BuildUrl(question.Ans2Id)));
			img3.Source = new BitmapImage(new Uri(QImage.BuildUrl(question.Ans3Id)));
		}

		private ImageList PrepareImageList() {
			if (imageSelector != null) {
				HideImageList(null, null);
			}

			imageSelector = new ImageList("", true);
			Grid.SetColumn(imageSelector, 2);
			Grid.SetRow(imageSelector, 1);
			Grid.SetRowSpan(imageSelector, 7);
			imageSelector.OnImageSelected += HideImageList;
			return imageSelector;
		}

		private void HideImageList(object sender, ImgSelectionEventArgs e) {
			LayoutRoot.Children.Remove(imageSelector);
			imageSelector = null;
		}

		private void AddImg1(object sender, RoutedEventArgs e) {
			var il = PrepareImageList();
			il.OnImageSelected += OnImage1Selected;
			LayoutRoot.Children.Add(il);
		}

		private void DelImg1(object sender, RoutedEventArgs e) {
			img1.Source = null;
			QuestionData.Ans1Id = null;
		}

		private void AddImg2(object sender, RoutedEventArgs e) {
			var il = PrepareImageList();
			il.OnImageSelected += OnImage2Selected;
			LayoutRoot.Children.Add(il);
		}

		private void DelImg2(object sender, RoutedEventArgs e) {
			img2.Source = null;
			QuestionData.Ans2Id = null;
		}

		private void AddImg3(object sender, RoutedEventArgs e) {
			var il = PrepareImageList();
			il.OnImageSelected += OnImage3Selected;
			LayoutRoot.Children.Add(il);
		}

		private void DelImg3(object sender, RoutedEventArgs e) {
			img3.Source = null;
			QuestionData.Ans3Id = null;
		}

		void OnImage1Selected(object sender, ImgSelectionEventArgs e) {
			img1.Source = new BitmapImage(new Uri(e.ImageUrl));
			QuestionData.Ans1Id = e.ImageId;
		}

		void OnImage2Selected(object sender, ImgSelectionEventArgs e) {
			img2.Source = new BitmapImage(new Uri(e.ImageUrl));
			QuestionData.Ans2Id = e.ImageId;
		}

		void OnImage3Selected(object sender, ImgSelectionEventArgs e) {
			img3.Source = new BitmapImage(new Uri(e.ImageUrl));
			QuestionData.Ans3Id = e.ImageId;
		}

		private void SaveClick(object sender, RoutedEventArgs e) {
			if (string.IsNullOrWhiteSpace(QuestionData.SimiliarTags)) {
				System.Windows.Browser.HtmlPage.Window.Alert("Wpisz co najmniej jeden tag");
				return;
			}

			var client = new WebClient();
			client.Headers[HttpRequestHeader.ContentType] = "application/json";
			client.OpenWriteCompleted += (sender1, e1) => {
				QuestionData.EpochId += 1; // index is broken.
				string serData = JsonConvert.SerializeObject(QuestionData);
				try {
					using (var ms = new MemoryStream(Encoding.UTF8.GetBytes(serData))) {
						ms.CopyTo(e1.Result);
					}
					e1.Result.Close();
				} catch (Exception ex) {
					System.Windows.Browser.HtmlPage.Window.Alert("Blad wysylania, sprobuj jeszcze raz. " + ex.Message);
				}
			};

			client.WriteStreamClosed += (sender2, e2) => {
				if (e2.Error != null) {
					System.Windows.Browser.HtmlPage.Window.Alert("blad konczenia wysylania, sprobuj jeszcze raz. " + e2.Error.Message);
				}
				if (OnSave != null) {
					OnSave(this, EventArgs.Empty);
				}
			};

			// get uri from params
			string path;
			if (IsInEditMode) {
				path = App.GetHostPath() + "/Question/UpdateQuestion";
			} else {
				path = App.GetHostPath() + "/Question/CreateQuestion";
			}
			var uri = new UriBuilder(path);
			client.OpenWriteAsync(uri.Uri, "POST");
		}

		private void CancelClick(object sender, RoutedEventArgs e) {
			if (OnCancel != null) {
				OnCancel(this, EventArgs.Empty);
			}
		}
	}
}
