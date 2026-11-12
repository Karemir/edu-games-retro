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
using System.Windows.Navigation;
using QuestionsSL.Models;
using System.IO;
using System.Text;
using Newtonsoft.Json;

namespace QuestionsSL {
	public partial class QuestionList : UserControl {
		public QuestionList(string lookupTag = "") {
			InitializeComponent();
			questionList.Children.Clear();
			searchTag.Text = lookupTag;

			if (string.IsNullOrWhiteSpace(lookupTag)) {
				GetAllQuestions();
			} else {
				GetFilteredQuestions(lookupTag, "");
			}
		}

		private void GetAllQuestions() {
			Random rnd = new Random();
			HttpWebRequest req = HttpWebRequest.CreateHttp(App.GetHostPath() + "/Question/GetAllQuestions?rnd=" + rnd.Next(1000));
			req.BeginGetResponse(new AsyncCallback(GetQuestionsCallback), req);
		}

		private void GetFilteredQuestions(string tag, string text) {
			Random rnd = new Random();
			HttpWebRequest req = HttpWebRequest.CreateHttp(App.GetHostPath() + "/Question/GetFilteredQuestions?text=" + text + "&tag=" + tag + "&rnd=" + rnd.Next(1000));
			req.BeginGetResponse(new AsyncCallback(GetQuestionsCallback), req);
		}

		private void GetQuestionsCallback(IAsyncResult res) {
			HttpWebRequest request = (HttpWebRequest)res.AsyncState;
			HttpWebResponse response = (HttpWebResponse)request.EndGetResponse(res);

			if (response.StatusCode != HttpStatusCode.OK) {
				System.Windows.Browser.HtmlPage.Window.Alert("Blad pobierania. " + response.StatusDescription);
			}

			List<QQuestion> resList;
			using (var ms = new MemoryStream()) {
				response.GetResponseStream().CopyTo(ms);
				ms.Seek(0, SeekOrigin.Begin);
				var data = ms.ToArray();
				string serData = Encoding.UTF8.GetString(data, 0, data.Length);
				resList = JsonConvert.DeserializeObject<List<QQuestion>>(serData);

				Dispatcher.BeginInvoke(delegate { FillQuestions(resList); });
			}
		}

		private void FillQuestions(List<QQuestion> questionsToShow) {
			questionList.Children.Clear();
			foreach (var q in questionsToShow) {
				AddListEntry(q);
			}
		}

		private void AddListEntry(QQuestion q) {
			var qItem = new QuestionListEntry(q);
			questionList.Children.Add(qItem);

			qItem.OnDelete += qItem_OnDelete;
			qItem.OnEdit += qItem_OnEdit;
		}

		void qItem_OnEdit(object sender, EventArgs e) {
			ShowQuestionEdit((sender as QuestionListEntry).Question);
		}

		void qItem_OnDelete(object sender, EventArgs e) {
			questionList.Children.Remove(sender as UIElement);
		}

		private void GoBack(object sender, RoutedEventArgs e) {
			var q = new MainPage();
			((UserControlContainer)Application.Current.RootVisual).SwitchControl(q);
		}

		private void AddNewQuestion(object sender, RoutedEventArgs e) {
			ShowQuestionEdit(null);
		}

		private void ShowQuestionEdit(QQuestion question) {
			QuestionEdit qe;
			if (question == null) {
				qe = new QuestionEdit();
			} else {
				qe = new QuestionEdit(question);
			}

			Grid.SetRowSpan(qe, 2);
			qe.OnCancel += editor_OnCancel;
			qe.OnSave += editor_OnSave;

			LayoutRoot.Children.Add(qe);
		}

		void editor_OnSave(object sender, EventArgs e) {
			var editor = sender as QuestionEdit;
			if (!editor.IsInEditMode) {
				AddListEntry(editor.QuestionData);
			} else {
				// this sux, but i dont want to do PropertyChanged.
				foreach (QuestionListEntry line in questionList.Children) {
					if (line.Question.QuestionId == editor.QuestionData.QuestionId) {
						line.Question = editor.QuestionData;
						line.tagName.Text = editor.QuestionData.QuestionText;
					}
				}
			}
			LayoutRoot.Children.Remove(editor);
		}

		void editor_OnCancel(object sender, EventArgs e) {
			LayoutRoot.Children.Remove(sender as UIElement);
		}

		private void DoFilter(object sender, RoutedEventArgs e) {
			GetFilteredQuestions(searchTag.Text, searchTxt.Text);
		}

	}
}
