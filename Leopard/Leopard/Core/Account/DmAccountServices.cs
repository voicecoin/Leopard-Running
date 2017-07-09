using Leopard.DataContexts;
using Leopard.DbTables;
using Leopard.DomainModels;
using Leopard.Utility;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Leopard.DmServices
{
    public static class DmAccountServices
    {
        public static void Create(this DmAccount agentRequestModel, CoreDbContext dc)
        {
            var user = dc.Users.Find(agentRequestModel.Id);
            if (user != null) return;

            var accountRecord = agentRequestModel.Map<UserEntity>();
            agentRequestModel.CreatedDate = DateTime.UtcNow;
            agentRequestModel.ModifiedDate = DateTime.UtcNow;

            dc.Users.Add(accountRecord);
        }
    }
}
