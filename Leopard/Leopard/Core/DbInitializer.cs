using Leopard.DataContexts;
using Leopard.DbTables;
using Leopard.DmServices;
using Leopard.DomainModels;
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
            if (dc.Bundles.Count(x => x.EntityName == "User Profile") > 0) return;

            BundleEntity bundle = dc.Bundles.Add(new BundleEntity { Id = "b24a146f-c2b1-40bd-9b0f-665e2546017b", Name = "User Profile", EntityName = "User", Status = EntityStatus.Active }).Entity;
            dc.Bundles.Add(bundle);

            dc.SaveChanges();

            var rootUser = dc.Users.Find("8a9fd693-9038-4083-87f7-08e45eff61d2");
            new DmAccount
            {
                Id = "8a9fd693-9038-4083-87f7-08e45eff61d2",
                BundleId = bundle.Id,
                UserName = "info@yaya.ai",
                CreatedUserId = "8a9fd693-9038-4083-87f7-08e45eff61d2",
                ModifiedUserId = "8a9fd693-9038-4083-87f7-08e45eff61d2",
                FirstName = "Yaya",
                Email = "info@yaya.ai",
                Password = "Yayabot123",
                Description = "丫丫人工智能聊天机器人"
            }.Create(dc);

            rootUser = dc.Users.Find("265d804d-0073-4a50-bd07-98a28e10f9fb");
            new DmAccount
            {
                Id = "265d804d-0073-4a50-bd07-98a28e10f9fb",
                BundleId = bundle.Id,
                UserName = "yrdrylcyp@163.com",
                CreatedUserId = "265d804d-0073-4a50-bd07-98a28e10f9fb",
                ModifiedUserId = "265d804d-0073-4a50-bd07-98a28e10f9fb",
                FirstName = "东瑞实业",
                Email = "yrdrylcyp@163.com",
                Password = "Yayabot123",
                Description = "鹰潭东瑞实业有限公司"
            }.Create(dc);

            dc.SaveChanges();
        }

    }
}
