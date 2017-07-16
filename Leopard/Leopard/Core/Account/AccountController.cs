using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Leopard.DataContexts;
using Leopard.DbTables;
using Microsoft.AspNetCore.Authorization;

namespace Leopard.Core.Account
{
    public class AccountController : CoreController
    {
        [HttpGet]
        public async Task<IActionResult> GetUser()
        {
            var user = dc.Users.FirstOrDefault(x => x.Id == GetCurrentUser().Id);

            return Ok(user);
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("Exist")]
        public async Task<IActionResult> UserExist([FromQuery] String userName)
        {
            var user = dc.Users.Any(x => x.UserName == userName);

            return Ok(user);
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> GetUser([FromRoute] String id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = dc.Users.FirstOrDefault(x => x.Id == id);

            return Ok(user);
        }

        [HttpPut]
        [Route("{id}")]
        public async Task<IActionResult> UpdateUser([FromRoute] String id, UserEntity accountModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            return CreatedAtAction("UpdateUser", new { id = accountModel.Id }, accountModel.Id);
        }

        // POST: api/Account
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> CreateUser(UserEntity accountModel)
        {
            if (dc.Users.Count(x => x.UserName == accountModel.UserName) > 0) {
                return BadRequest("User already exists.");
            }

            accountModel.Id = Guid.NewGuid().ToString();
            accountModel.BundleId = dc.Bundles.First(x => x.Name == "User Profile").Id;
            accountModel.CreatedUserId = accountModel.Id;
            accountModel.CreatedDate = DateTime.UtcNow;
            accountModel.ModifiedUserId = accountModel.Id;
            accountModel.ModifiedDate = DateTime.UtcNow;
            accountModel.FirstName = accountModel.UserName.Split('@').First();

            dc.Users.Add(accountModel);
            await dc.SaveChangesAsync();

            //return CreatedAtAction("CreateUser", new { id = accountModel.Id }, accountModel.Id);
            return Ok(new { id = accountModel.Id });
        }
    }
}


