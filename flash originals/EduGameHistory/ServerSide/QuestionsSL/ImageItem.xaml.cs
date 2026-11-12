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
	public partial class ImageItem : UserControl {
		public string imageId;
		public string imageUrl;
		public string description;
		public event EventHandler OnItemRemoved;

		public ImageItem() {
			InitializeComponent();
		}

		public ImageItem(string imageId, string description) {
			InitializeComponent();
			this.imageId = imageId;
			this.imageUrl = QImage.BuildUrl(imageId);
			visImg.Source = new BitmapImage(new Uri(imageUrl));

			this.description = description;
			if (description != null) {
				ToolTipService.SetToolTip(this, description);
			} else {
				HttpWebRequest descreq = HttpWebRequest.CreateHttp(App.GetHostPath() + "/Question/GetImageDescription?imageId=" + imageId);
				descreq.BeginGetResponse(new AsyncCallback(DescCallback), descreq);
			}
		}

		private void DoRemove(object sender, RoutedEventArgs e) {
			HttpWebRequest wr = HttpWebRequest.CreateHttp(App.GetHostPath() + "/Question/DeleteImage?imageId=" + imageId);
			wr.BeginGetResponse(new AsyncCallback(ReadCallback), wr);
		}

		private void ReadCallback(IAsyncResult asynchronousResult) {
			HttpWebRequest request = (HttpWebRequest)asynchronousResult.AsyncState;
			HttpWebResponse response = (HttpWebResponse)request.EndGetResponse(asynchronousResult);

			if (response.StatusCode == HttpStatusCode.OK) {
				if (OnItemRemoved != null) {
					this.Dispatcher.BeginInvoke(delegate {
						OnItemRemoved.Invoke(this, EventArgs.Empty);
					});
				}
			} else {
				System.Windows.Browser.HtmlPage.Window.Alert("Wystapil blad, sprobuj jeszcze raz. " + response.StatusCode.ToString());
				return;
			}
		}

		private void DescCallback(IAsyncResult asyncRes) {
			HttpWebRequest request = (HttpWebRequest)asyncRes.AsyncState;
			HttpWebResponse response = (HttpWebResponse)request.EndGetResponse(asyncRes);

			if (response.StatusCode == HttpStatusCode.OK) {
				if (OnItemRemoved != null) {
					using ( var ms = new MemoryStream()){
						response.GetResponseStream().CopyTo(ms);
						byte[] data = ms.ToArray();
						this.description = Encoding.UTF8.GetString(data, 0, data.Length);
						this.Dispatcher.BeginInvoke(delegate {
							ToolTipService.SetToolTip(this, description);
						});
					}
				}
			}
		}
	}
}
