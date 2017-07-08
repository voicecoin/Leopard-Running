using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Leopard.DbTables;

namespace Leopard.DataContexts
{
    public partial class CoreDbContext
    {
        public DbSet<BundleEntity> Bundles { get; set; }
        public DbSet<BundleFieldEntity> BundleFields { get; set; }
        public DbSet<BundleFieldSettingEntity> BundleFieldSettings { get; set; }
    }
}