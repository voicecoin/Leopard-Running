using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http;
using Microsoft.Net.Http.Headers;

namespace Leopard
{
    public partial class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public IConfigurationRoot Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // https://docs.microsoft.com/en-us/aspnet/core/security/cors
            services.AddCors();

            services.AddAuthentication();

            // Add framework services.
            services.AddMvc(options =>
            {
                /*options.OutputFormatters.Add(new XmlSerializerOutputFormatter());
                options.OutputFormatters.Add(new XmlDataContractSerializerOutputFormatter());*/
                options.FormatterMappings.SetMediaTypeMappingForFormat("xml", new MediaTypeHeaderValue("application/xml"));
                options.RespectBrowserAcceptHeader = true;
            }).AddXmlSerializerFormatters()
            .AddXmlDataContractSeria‌​lizerFormatters();

            //services.AddScoped<ITodoRepository, TodoRepository>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();

            app.UseCors(builder => builder.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin().AllowCredentials());

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "API",
                    template: "api/{controller=Home}/{action=Index}/{id?}");
            });

            // for wwwroot
            app.UseDefaultFiles();
            app.UseStaticFiles();
            
            // https://docs.microsoft.com/en-us/aspnet/core/fundamentals/static-files
            app.UseStaticFiles(new StaticFileOptions()
            {
                //FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), @"AdminUI")),
                //RequestPath = new PathString("/AdminUI"),
                OnPrepareResponse = ctx =>
                {
                    ctx.Context.Response.Headers.Append("Cache-Control", "public,max-age=600");
                }
            });
        }
    }
}



