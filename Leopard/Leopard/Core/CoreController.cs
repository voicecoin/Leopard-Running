using Leopard.DataContexts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Leopard.Core
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class CoreController : ControllerBase
    {
        protected readonly CoreDbContext dc;

        public CoreController()
        {
            dc = new CoreDbContext(new DbContextOptions<CoreDbContext>() { });
        }
    }

}    