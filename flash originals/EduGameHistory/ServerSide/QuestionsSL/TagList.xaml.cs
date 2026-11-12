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
using System.IO;
using System.Text;
using Newtonsoft.Json;

namespace QuestionsSL {
	public partial class TagList : UserControl {
		public TagList() {
			InitializeComponent();

            tagList.Children.Clear();
            GetTags();
		}

        private void GetTags()
        {
			HttpWebRequest wr = HttpWebRequest.CreateHttp(App.GetHostPath() + "/Question/GetTagsAll?rnd"+Guid.NewGuid());
			wr.BeginGetResponse(new AsyncCallback(GetTagsCallback), wr);
		}

        private void GetTagsCallback(IAsyncResult asynchronousResult)
        {
            HttpWebRequest request =
              (HttpWebRequest)asynchronousResult.AsyncState;
            HttpWebResponse response =
              (HttpWebResponse)request.EndGetResponse(asynchronousResult);

            Stream respStream = response.GetResponseStream();
            string respData;
            using (MemoryStream ms = new MemoryStream())
            {
                respStream.CopyTo(ms);
                var bytes = ms.ToArray();
                respData = Encoding.UTF8.GetString(ms.ToArray(), 0, bytes.Count());
            }

            List<string> tags = JsonConvert.DeserializeObject<List<String>>(respData);
            Dispatcher.BeginInvoke(delegate
            {
                foreach (var t in tags)
                {
                    AddTag(t);
                }
            });
        }

        private void AddTag(string tag)
        {
            var tagEntry = new TagListEntry(tag);
            tagEntry.OnShowImage += tagEntry_OnShowImage;
            tagEntry.OnShowQuestion += tagEntry_OnShowQuestion;
            tagList.Children.Add(tagEntry);
        }

        void tagEntry_OnShowQuestion(object sender, EventArgs e)
        {
			string tagvalue = "";
			if (sender != null) {
				tagvalue = sender as string;
			}
            QuestionList ql = new QuestionList(tagvalue);
            ((UserControlContainer)Application.Current.RootVisual).SwitchControl(ql);            
        }

        void tagEntry_OnShowImage(object sender, EventArgs e)
        {
            ImageList il = new ImageList(sender as string);
            
            ((UserControlContainer)Application.Current.RootVisual).SwitchControl(il);
        }

		private void GoBack(object sender, RoutedEventArgs e) {
			var q = new MainPage();
			((UserControlContainer)Application.Current.RootVisual).SwitchControl(q);
		}

	}
}
