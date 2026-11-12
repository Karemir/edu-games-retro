using HistoryQuestions.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace HistoryQuestions
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            WebApiConfig.Register(GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            AuthConfig.RegisterAuth();

            Database.SetInitializer(new QuestionDbInitializer());
			QuestionContext ctx = new QuestionContext();
			ctx.Database.Initialize(false);

			if (ctx.Epochs.Count() == 0) {
				ctx.Epochs.Add(new QEpoch() { Id = 1, Name = "Starożytność" });
				ctx.Epochs.Add(new QEpoch() { Id = 2, Name = "Średniowiecze" });
				ctx.Epochs.Add(new QEpoch() { Id = 3, Name = "Nowożytność" });
				ctx.Epochs.Add(new QEpoch() { Id = 4, Name = "XIX Wiek" });
				ctx.Epochs.Add(new QEpoch() { Id = 5, Name = "XX Wiek" });
				ctx.SaveChanges();
			}

        }
    }
}