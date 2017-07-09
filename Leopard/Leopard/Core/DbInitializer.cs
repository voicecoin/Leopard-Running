using Leopard.DataContexts;
using Leopard.DbTables;
using Leopard.Enums;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Leopard.Core
{
    public class DbInitializer
    {
        public static void Initialize(IHostingEnvironment env)
        {
            CoreDbContext context = new CoreDbContext(new DbContextOptions<CoreDbContext>());
            //var dbContexts = serviceProvider.GetService<DataContexts>();

            context.Database.EnsureCreated();

            InitUser(context);
        }

        private static void InitUser(CoreDbContext dc)
        {
            if (dc.Bundles.Count(x => x.EntityName == "User") > 0) return;

            BundleEntity bundle = dc.Bundles.Add(new BundleEntity { Name = "User Profile", EntityName = "User", Status = EntityStatus.Active }).Entity;
            dc.Bundles.Add(bundle);

            dc.SaveChanges();

            var rootUser = dc.Users.Find("8a9fd693-9038-4083-87f7-08e45eff61d2");
            if (rootUser == null)//means app need create an root user
            {
                UserEntity accountModel = new UserEntity();
                accountModel.Id = Guid.NewGuid().ToString();
                accountModel.BundleId = bundle.Id;
                accountModel.CreatedUserId = accountModel.Id;
                accountModel.CreatedDate = DateTime.UtcNow;
                accountModel.ModifiedUserId = accountModel.Id;
                accountModel.ModifiedDate = DateTime.UtcNow;
                accountModel.UserName = "info@yaya.ai";
                accountModel.FirstName = "Yaya";
                accountModel.Email = "info@yaya.ai";
                accountModel.Password = "Yayabot123";
                accountModel.Description = "丫丫人工智能聊天机器人";
                dc.Users.Add(accountModel);
            }

            rootUser = dc.Users.Find("265d804d-0073-4a50-bd07-98a28e10f9fb");
            if (rootUser == null)
            {
                UserEntity accountModel = new UserEntity();
                accountModel.Id = Guid.NewGuid().ToString();
                accountModel.BundleId = bundle.Id;
                accountModel.CreatedUserId = accountModel.Id;
                accountModel.CreatedDate = DateTime.UtcNow;
                accountModel.ModifiedUserId = accountModel.Id;
                accountModel.ModifiedDate = DateTime.UtcNow;
                accountModel.UserName = "yrdrylcyp@163.com";
                accountModel.FirstName = "灵溪山谷";
                accountModel.Email = "yrdrylcyp@163.com";
                accountModel.Password = "Yayabot123";
                accountModel.Description = "鹰潭东瑞实业有限公司";
                dc.Users.Add(accountModel);
            }

            dc.SaveChanges();
        }

    }
}
