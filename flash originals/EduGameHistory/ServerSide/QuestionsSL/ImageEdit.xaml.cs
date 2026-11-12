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
using System.Windows.Media.Effects;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;

namespace QuestionsSL {
	public partial class ImageEdit : UserControl {
		public event EventHandler<EventArgs> OnCancel;
		public event EventHandler<EventArgs> OnSave;

		public QImage ImageData { get; set; }
		public FileInfo ImageFileInfo { get; set; }
		public bool EditMode { get; set; }

		public ImageEdit() {
			InitializeComponent();
			EditMode = false;
			epochs.ItemsSource = App.Epochs;
			ImageFileInfo = null;

			ImageData = new QImage() { ImageId = Guid.NewGuid().ToString() };
			DataContext = ImageData;
		}

		public ImageEdit(string imageId) {
			InitializeComponent();
			EditMode = true;
			epochs.ItemsSource = App.Epochs;
			ImageFileInfo = null;

			//ImageData = toEdit;
			//DataContext = ImageData;

			Random r = new Random();
			HttpWebRequest imgReq = HttpWebRequest.CreateHttp(App.GetHostPath() + "/Question/GetImageData?imageId=" + imageId + "&rnd=" + r.Next(1000));
			imgReq.BeginGetResponse(new AsyncCallback(GetImgDataEnd), imgReq);
		}

		private void GetImgDataEnd(IAsyncResult res) {
			HttpWebRequest request = (HttpWebRequest)res.AsyncState;
			HttpWebResponse response = (HttpWebResponse)request.EndGetResponse(res);

			if (response.StatusCode != HttpStatusCode.OK) {
				System.Windows.Browser.HtmlPage.Window.Alert("Wystapil blad, sprawdz dostepnosc API. " + response.StatusCode.ToString());
				return;
			}

			using (var ms = new MemoryStream()) {
				var s = response.GetResponseStream();
				s.CopyTo(ms);
				s.Close();

				var bytes = ms.ToArray();
				var serdata = Encoding.UTF8.GetString(bytes, 0, bytes.Length);
				Dispatcher.BeginInvoke(delegate {
					ImageData = JsonConvert.DeserializeObject<QImage>(serdata);
					ImageData.EpochId -= 1;
					DataContext = ImageData;
					img.Source = new BitmapImage(new Uri(QImage.BuildUrl(ImageData.ImageId)));
				});
			}
		}

		private void AddImg(object sender, RoutedEventArgs e) {
			OpenFileDialog dlg = new OpenFileDialog();
			dlg.Multiselect = false;
			dlg.Filter = "All files (*.*)|*.*";

			bool? retval = dlg.ShowDialog();
			if (retval != null && retval == true) {
				ImageFileInfo = dlg.File;
				FileStream fs = dlg.File.OpenRead();
				BitmapImage bi = new BitmapImage();
				bi.SetSource(fs);
				img.Source = bi;
				fs.Close();
			}
		}

		private void Button_Click_1(object sender, RoutedEventArgs e) {
			if (string.IsNullOrWhiteSpace(ImageData.TagStrings)) {
				System.Windows.Browser.HtmlPage.Window.Alert("Wpisz co najmniej jeden tag");
				return;
			}
			ImageData.EpochId = epochs.SelectedIndex + 1;
			CommitImage();
		}

		private void CancelClick(object sender, RoutedEventArgs e) {
			ImageData = null;
			if (OnCancel != null) {
				OnCancel(this, e);
			}
		}

		public void CommitImage() {
			var client = new WebClient();
			client.Headers[HttpRequestHeader.ContentType] = "multipart/form-data";
			client.OpenWriteCompleted += (sender1, e1) => {
				try {
					if (ImageFileInfo == null) {
						e1.Result.Close();
					} else {
						using (FileStream fs = ImageFileInfo.OpenRead()) {
							PushData(fs, e1.Result);
							e1.Result.Close();
						}
					}
				} catch (Exception e) {
					System.Windows.Browser.HtmlPage.Window.Alert("Blad wysylania, sprobuj jeszcze raz. " + e.Message);
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

			// prepare url string
			var paramList = new List<String>();
			paramList.Add("EpochId=" + ImageData.EpochId);
			paramList.Add("ImageId=" + ImageData.ImageId);
			paramList.Add("Link=" + ImageData.Link);
			paramList.Add("TagStrings=" + ImageData.TagStrings);
			paramList.Add("Description=" + ImageData.Description);

			// get uri from params
			var uri = new UriBuilder(App.GetHostPath() + "/Question/PutImage?" + string.Join("&", paramList));
			client.OpenWriteAsync(uri.Uri, "POST");
		}

		private void PushData(Stream input, Stream output) {
			var wb = ImageHelper.GetImageSource(input, 200, 200);
			using (Stream src = JpgEncoder.Encode(wb, 90)) {
				src.CopyTo(output);
			}
		}
	}
}
