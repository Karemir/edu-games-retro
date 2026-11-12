using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
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
	public partial class MainPage : UserControl {
		public MainPage() {
			InitializeComponent();
			SetStats();
		}

		private void SetStats() {
			Random rnd = new Random();
			HttpWebRequest wr = HttpWebRequest.CreateHttp(App.GetHostPath() + "/Question/GetStats?rnd=" + rnd.Next(1999));
			wr.BeginGetResponse(new AsyncCallback(SetStatsEnd), wr);
		}

		private void SetStatsEnd(IAsyncResult res) {
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
				ms.Seek(0, SeekOrigin.Begin);

				var bytes = ms.ToArray();
				var serdata = Encoding.UTF8.GetString(bytes, 0, bytes.Length);

				Dispatcher.BeginInvoke(delegate {
					JObject stats = JObject.Parse(serdata);
					txtTags.Text = (string)stats["tags"];
					txtImages.Text = (string)stats["imgs"];
					txtQuestions.Text = (string)stats["questions"];
				});
			}
		}

		private void OpenQuestions(object sender, RoutedEventArgs e) {
			var q = new QuestionList();
			((UserControlContainer)Application.Current.RootVisual).SwitchControl(q);
		}

		private void OpenTags(object sender, RoutedEventArgs e) {
			var q = new TagList();
			((UserControlContainer)Application.Current.RootVisual).SwitchControl(q);
		}

		private void OpenImages(object sender, RoutedEventArgs e) {
			var q = new ImageList();
			((UserControlContainer)Application.Current.RootVisual).SwitchControl(q);
		}
	}
}
