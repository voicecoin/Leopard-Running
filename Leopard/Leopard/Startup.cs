using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using System.IO;
using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using AutoMapper;
using Microsoft.Extensions.Options;
using Leopard.Core;
using Leopard.DataContexts;

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

            CoreDbContext.ConnectionString = Configuration.GetConnectionString("DefaultConnection");

            // Add framework services.
            services.AddMvc();

            services.AddScoped<ApiExceptionFilter>();
            //services.AddScoped<ITodoRepository, TodoRepository>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();

            app.UseCors(builder => builder.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin().AllowCredentials());

            ConfigureAuth(app);

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "API",
                    template: "api/{controller=Home}/{action=Index}/{id?}");
            });

            // for wwwroot
            app.UseDefaultFiles();
            
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


            // Initialize AutoMapper
            MapperInitializer.Initialize();
            DbInitializer.Initialize(env);
        }
    }
}



