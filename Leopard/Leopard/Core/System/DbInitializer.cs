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
        }
    }
}
