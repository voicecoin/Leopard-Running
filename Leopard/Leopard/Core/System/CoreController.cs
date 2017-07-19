using Leopard.DataContexts;
using Leopard.DomainModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Leopard.Core
{
    [Authorize]
    [Produces("application/json", "application/xml")]
    [Route("api/[controller]")]
    [ServiceFilter(typeof(ApiExceptionFilter))]
    public class CoreController : ControllerBase
    {
        public static IConfigurationRoot Configuration { get; set; }
        protected readonly CoreDbContext dc;

        public CoreController()
        {
            dc = new CoreDbContext(new DbContextOptions<CoreDbContext>() { });
        }

        protected DmAccount GetCurrentUser()
        {
            if (this.User != null)
            {
                return new DmAccount
                {
                    Id = this.User.Claims.First(x => x.Type.Equals("UserId")).Value,
                    UserName = this.User.Identity.Name
                };
            }
            else
            {
                return new DmAccount
                {
                    Id = Guid.Empty.ToString(),
                    UserName = "Anonymous"
                };
            }
        }
    }
}    