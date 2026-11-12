using Newtonsoft.Json;
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
using System.Windows.Shapes;

namespace QuestionsSL {
	public class ImgSelectionEventArgs : EventArgs {
		public string ImageUrl;
		public string ImageId;
		public ImgSelectionEventArgs(string id, string url) {
			ImageId = id;
			ImageUrl = url;
		}
	}

	public partial class ImageList : UserControl {
		private ImageEdit editControl;
		private UIElement grayBg;
		public string ImagesTag { get; set; }
		public bool IsSelectionMode { get; set; }
		public List<string> DisplayedImages { get; set; }
		public List<ImageItem> VisualImages { get; set; }

		public event EventHandler<ImgSelectionEventArgs> OnImageSelected;

		public ImageList(string initialTag = "", bool selectionMode = false) {
			InitializeComponent();
			LayoutRoot.Children.Clear();
			ImagesTag = "";
			IsSelectionMode = selectionMode;

			grayBg = new Grid();
			Color bgcol = Colors.LightGray;
			bgcol.A = 100;
			(grayBg as Grid).Background = new SolidColorBrush(bgcol);

			DownloadTags();
			if (!string.IsNullOrWhiteSpace(initialTag)) {
				ImagesTag = initialTag;
				DownloadImageList(initialTag);
			}

			if (IsSelectionMode) {
				btnGoBack.Visibility = System.Windows.Visibility.Collapsed;
			}
		}

		private void DownloadTags() {
			HttpWebRequest wr = HttpWebRequest.CreateHttp(App.GetHostPath() + "/Question/GetTagsWithImages?rnd" + Guid.NewGuid());
			wr.BeginGetResponse(new AsyncCallback(GetTagsCallback), wr);
		}

		private void GetTagsCallback(IAsyncResult asynchronousResult) {
			HttpWebRequest request = (HttpWebRequest)asynchronousResult.AsyncState;
			HttpWebResponse response = (HttpWebResponse)request.EndGetResponse(asynchronousResult);

			Stream respStream = response.GetResponseStream();
			string respData;
			using (MemoryStream ms = new MemoryStream()) {
				respStream.CopyTo(ms);
				var bytes = ms.ToArray();
				respData = Encoding.UTF8.GetString(ms.ToArray(), 0, bytes.Count());
			}

			List<string> tags = JsonConvert.DeserializeObject<List<String>>(respData);
			Dispatcher.BeginInvoke(delegate {
				tagEntry.ItemsSource = tags;

				for (int i = 0; i < tags.Count; ++i) {
					if (tags[i] == ImagesTag) {
						tagEntry.SelectedIndex = i;
					}
				}
			});
		}

		private void GoBack(object sender, RoutedEventArgs e) {
			var q = new MainPage();
			((UserControlContainer)Application.Current.RootVisual).SwitchControl(q);
		}

		private void AddImage(object sender, RoutedEventArgs e) {
			rootGrid.Children.Add(grayBg);

			editControl = new ImageEdit();
			editControl.HorizontalAlignment = System.Windows.HorizontalAlignment.Center;
			editControl.VerticalAlignment = System.Windows.VerticalAlignment.Center;
			editControl.OnSave += editControl_OnSave;
			editControl.OnCancel += editControl_OnCancel;
			rootGrid.Children.Add(editControl);
		}

		void editControl_OnCancel(object sender, EventArgs e) {
			if (editControl == null) return;
			rootGrid.Children.Remove(editControl);
			rootGrid.Children.Remove(grayBg);
			editControl = null;
		}

		void editControl_OnSave(object sender, EventArgs e) {
			if (!string.IsNullOrEmpty(ImagesTag) && editControl.ImageData.TagStrings.Contains(ImagesTag) && !editControl.EditMode) {
				PutNewImageItem(editControl.ImageData.ImageId, editControl.ImageData.Description);
			} else {
				DownloadTags();
			}
			rootGrid.Children.Remove(editControl);
			rootGrid.Children.Remove(grayBg);
			editControl = null;
		}

		private void PutNewImageItem(string imageId, string desc) {
			var imgItm = new ImageItem(imageId, desc);
			imgItm.OnItemRemoved += imgItm_OnItemRemoved;
			LayoutRoot.Children.Add(imgItm);

			imgItm.Cursor = Cursors.Hand;
			imgItm.MouseLeftButtonDown += visImg_MouseLeftButtonDown;
		}

		void visImg_MouseLeftButtonDown(object sender, MouseButtonEventArgs e) {
			ImageItem selectedItem = sender as ImageItem;
			if (IsSelectionMode) {
				if (OnImageSelected != null) {
					OnImageSelected(this, new ImgSelectionEventArgs(selectedItem.imageId, selectedItem.imageUrl));
				}
			} else {
				rootGrid.Children.Add(grayBg);

				editControl = new ImageEdit(selectedItem.imageId);
				editControl.HorizontalAlignment = System.Windows.HorizontalAlignment.Center;
				editControl.VerticalAlignment = System.Windows.VerticalAlignment.Center;
				editControl.OnSave += editControl_OnSave;
				editControl.OnCancel += editControl_OnCancel;
				rootGrid.Children.Add(editControl);
			}
		}

		void imgItm_OnItemRemoved(object sender, EventArgs e) {
			LayoutRoot.Children.Remove(sender as ImageItem);
		}

		private void DownloadImageList(string tag, string filter = null) {
			Random rnd = new Random();
			HttpWebRequest wr = null;
			if (string.IsNullOrEmpty(filter)) {
				wr = HttpWebRequest.CreateHttp(App.GetHostPath() + "/Question/GetImageListByTag?tag=" + tag + "&rnd=" + rnd.Next(9999).ToString());
			} else {
				wr = HttpWebRequest.CreateHttp(App.GetHostPath() + "/Question/GetImageListByTag?tag=" + tag + "&filter=" + filter + "&rnd=" + rnd.Next(9999).ToString());
			}
			wr.BeginGetResponse(new AsyncCallback(DownloadImageListCallback), wr);
		}

		private void DownloadImageListCallback(IAsyncResult asynchronousResult) {
			HttpWebRequest request = (HttpWebRequest)asynchronousResult.AsyncState;
			HttpWebResponse response = (HttpWebResponse)request.EndGetResponse(asynchronousResult);

			Stream respStream = response.GetResponseStream();
			string respData;
			using (MemoryStream ms = new MemoryStream()) {
				respStream.CopyTo(ms);
				var bytes = ms.ToArray();
				respData = Encoding.UTF8.GetString(ms.ToArray(), 0, bytes.Count());
			}

			var imagesIds = JsonConvert.DeserializeObject<List<String>>(respData);
			this.Dispatcher.BeginInvoke(delegate {
				ClearAndSetImages(imagesIds);
			});
		}

		private void ClearAndSetImages(List<string> imagesIds) {
			LayoutRoot.Children.Clear();
			foreach (var id in imagesIds) {
				PutNewImageItem(id, null);
			}
		}

		private void TagChoosen(object sender, SelectionChangedEventArgs e) {
			if (e.AddedItems.Count == 0) { return; }
			ImagesTag = e.AddedItems[0].ToString();
			DownloadImageList(ImagesTag);
		}

		private void FilterImages(object sender, RoutedEventArgs e) {
			DownloadImageList(ImagesTag, filterTxt.Text);
		}
	}
}
