using Leopard.DbTables;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Leopard.DomainModels
{
    public class DmAccount : UserEntity
    {
        public string FullName
        {
            get { return LastName + ", " + FirstName; }
        }
    }
}
