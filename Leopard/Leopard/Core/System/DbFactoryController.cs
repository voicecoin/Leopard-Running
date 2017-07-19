using Leopard.Utility;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace Leopard.Core
{
    [Route("api")]
    public class DbFactoryController : CoreController
    {
        /*public IEnumerable<Object> Query(string from, EfQueryModel filter)
        {
            return Dc.Query(typeof(Mercury.DbExtension.DbExtension), from, filter);
        }*/

        [HttpGet("{table}/{id}")]
        public Object Find(string table, string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Type tableType = Assembly.GetEntryAssembly()
                .GetTypes()
                .FirstOrDefault(t => t.Name == table);

            var result = dc.Find(tableType, id);

            return result;
        }

        /// <summary>
        /// Update multiple columns
        /// </summary>
        /// <param name="table"></param>
        /// <param name="id"></param>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPut("{table}/{id}")]
        public async Task<IActionResult> UpdateById([FromRoute] string table, [FromRoute] string id, [FromBody] JObject model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Type tableType = Assembly.GetEntryAssembly()
                .GetTypes()
                .FirstOrDefault(t => t.Name == table);

            var row = dc.Find(tableType, id);

            var dic = model.ToDictionary();

            var user = GetCurrentUser();
#if DEBUG
            if (user.Id == Guid.Empty.ToString() && dic.ContainsKey("currentUserId"))
            {
                user.Id = dic["currentUserId"].ToString();
            }
#endif
            if (row.GetValue("CreatedUserId").ToString() != user.Id)
            {
                return BadRequest();
            }

            if (row.GetValue("Id").ToString() != dic["id"].ToString())
            {
                return BadRequest();
            }

            int ret = dc.Transaction(delegate
            {
                var data = dc.Find(tableType, id);

                // Exclude non-editable filed
                dic.Where(x => !x.Key.Equals("Id", StringComparison.CurrentCultureIgnoreCase)
                            && !x.Key.Equals("CreatedUserId", StringComparison.CurrentCultureIgnoreCase)
                            && !x.Key.Equals("CreatedDate", StringComparison.CurrentCultureIgnoreCase)
                            && !x.Key.Equals("BundleId", StringComparison.CurrentCultureIgnoreCase)
                            && !x.Key.Equals("CurrentUserId", StringComparison.CurrentCultureIgnoreCase))
                .ToList()
                .ForEach(field =>
                {
                    data.SetValue(field.Key, field.Value);
                });

                data.SetValue("ModifiedDate", DateTime.UtcNow);
                data.SetValue("ModifiedUserId", user.Id);
            });

            return Ok(ret);
        }

        /// <summary>
        /// Update one column
        /// </summary>
        /// <param name="table"></param>
        /// <param name="id"></param>
        /// <param name="field"></param>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPut("{table}/{id}/{field}")]
        public async Task<IActionResult> UpdateById([FromRoute] string table, [FromRoute] string id, [FromRoute] string field, [FromBody] DbFactoryUpdateModel model)
        {
            Type tableType = Assembly.GetEntryAssembly()
                .GetTypes()
                .FirstOrDefault(t => t.Name == table);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var row = dc.Find(tableType, id);

            var user = GetCurrentUser();
#if DEBUG
            user.Id = model.CurrentUserId;
#endif
            if (row.GetValue("CreatedUserId").ToString() != user.Id)
            {
                return BadRequest();
            }

            if (row.GetValue("Id").ToString() != model.Id)
            {
                return BadRequest();
            }

            int ret = dc.Transaction(delegate
            {
                var data = dc.Find(tableType, id);
                data.SetValue(model.Field, model.Value);
                data.SetValue("ModifiedDate", DateTime.UtcNow);
                data.SetValue("ModifiedUserId", user.Id);
            });

            return Ok(ret);
        }

        /*public int UpdateByWhere(string from, int id, DbFactoryUpdateModel model)
        {
            int ret = 0;

            Dc.Transaction<IMySqlGsmpTable>(delegate {
                var data = Dc.Table(from).Find(id);
                data.SetPropertyValue(model.FieldName, model.Value);
                data.SetPropertyValue("ModifyDate", DateTime.UtcNow);
                data.SetPropertyValue("ModifyUserId", model.CurrentUserId);
                ret = Dc.Save();
            });

            return ret;
        }

        public int Insert(string from, DbFactoryUpdateModel model)
        {
            int ret = 0;

            Dc.Transaction<IMySqlGsmpTable>(delegate {
                var table = Dc.Table(from);
                var data = table.Create();
                data.SetPropertyValue(model.FieldName, model.Value);
                data.SetPropertyValue("CreateDate", DateTime.UtcNow);
                data.SetPropertyValue("CreateUserId", model.CurrentUserId);
                table.Add(data);
                ret = Dc.Save();
            });

            return ret;
        }

        public int DeleteById(string from, int id, DbFactoryUpdateModel model)
        {
            int ret = 0;

            Dc.Transaction<IMySqlGsmpTable>(delegate {
                var data = Dc.Table(from).Find(id);
                Dc.Table(from).Remove(data);
                ret = Dc.Save();
            });

            $"Deleted id: {id} from {from} by user: {model.CurrentUserId}".Log();
            return ret;
        }

        public string Export(string from, SmsQueryModel filter)
        {
            IEnumerable<object> list = Query(from, filter);
            string url = list.ExportToExcel(from + " " + DateTime.UtcNow.ToString("MMddyyyyhhmmss"));
            return url;
        }*/
    }

    public class DbFactoryUpdateModel
    {
        public string Id { get; set; }
        public string Field { get; set; }
        public object Value { get; set; }
        public string CurrentUserId { get; set; }
        public string Version { get; set; }
        public string Where { get; set; }
    }

}
