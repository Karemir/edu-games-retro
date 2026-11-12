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
	public partial class TagListEntry : UserControl {
        public event EventHandler OnShowImage;
        public event EventHandler OnShowQuestion;

        public string TagValue { get; set; }

        public TagListEntry()
        {
            InitializeComponent();
        }

        public TagListEntry(string tag = "")
        {
            InitializeComponent();
            TagValue = tag;
            tagName.Text = TagValue;
        }

        private void ShowQuestions(object sender, RoutedEventArgs e)
        {
            if (OnShowQuestion != null)
            {
                OnShowQuestion(TagValue, EventArgs.Empty);
            }
        }

        private void ShowImages(object sender, RoutedEventArgs e)
        {
            if (OnShowImage != null)
            {
                OnShowImage(TagValue, EventArgs.Empty);
            }
        }
	}
}
