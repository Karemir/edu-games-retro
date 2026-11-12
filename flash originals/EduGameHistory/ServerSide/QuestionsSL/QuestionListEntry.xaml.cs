using QuestionsSL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Shapes;

namespace QuestionsSL {
	public partial class QuestionListEntry : UserControl {
		public QQuestion Question { get; set; }
		public event EventHandler OnEdit;
		public event EventHandler OnDelete;

		private bool isDeleting;

		public QuestionListEntry() {
			InitializeComponent();
			isDeleting = false;
		}

		public QuestionListEntry(QQuestion question) {
			InitializeComponent();
			this.Question = question;
			DataContext = question;
			isDeleting = false;
		}

		private void DoDelete(object sender, RoutedEventArgs e) {
			if (isDeleting) return;
			isDeleting = true;
			HttpWebRequest req = HttpWebRequest.CreateHttp(App.GetHostPath() + "/Question/DeleteQuestion?questionId=" + Question.QuestionId);
			req.BeginGetResponse(new AsyncCallback(DelResponse), req);
		}

		private void DelResponse(IAsyncResult res) {
			var me = this;
			HttpWebRequest request = (HttpWebRequest)res.AsyncState;
			HttpWebResponse response = (HttpWebResponse)request.EndGetResponse(res);
			if (response.StatusCode == HttpStatusCode.OK) {
				if (OnDelete != null) {
					Dispatcher.BeginInvoke(delegate {
						OnDelete(me, EventArgs.Empty);
					});
				}
			} else {
				System.Windows.Browser.HtmlPage.Window.Alert("Blad wysylania, sprobuj jeszcze raz. " + response.StatusDescription);
			}
			isDeleting = false;
		}

		private void DoEdit(object sender, RoutedEventArgs e) {
			if (OnEdit != null) {
				OnEdit(this, EventArgs.Empty);
			}
		}
	}
}
