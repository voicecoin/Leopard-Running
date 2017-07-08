using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using Leopard.Core;
using Leopard.DataContexts;

namespace Leopard.DbTables
{
    public class UserEntity : DbTable, IBundle
    {
        [Required]
        public string BundleId { get; set; }
        [NotMapped]
        public List<Object> FieldRecords { get; set; }
        public void LoadFieldRecords(CoreDbContext dc)
        {
            FieldRecords = new List<object>();

            List<BundleFieldEntity> fields = dc.BundleFields.Where(x => x.BundleId == BundleId).ToList();
            foreach (BundleFieldEntity field in fields)
            {
                /*if (field.FieldTypeName.Equals("Address"))
                {
                    var records = dc.LocationAddressRecords.Where(x => x.EntityId == Id && x.BundleId == field.BundleId);
                    FieldRecords.AddRange(records);
                }
                else if (field.FieldTypeName.Equals("Email"))
                {
                    var records = dc.LocationEmailRecords.Where(x => x.EntityId == Id && x.BundleId == field.BundleId);
                    FieldRecords.AddRange(records);
                }
                else if (field.FieldTypeName.Equals("Phone"))
                {
                    var records = dc.LocationPhoneRecords.Where(x => x.EntityId == Id && x.BundleId == field.BundleId);
                    FieldRecords.AddRange(records);
                }*/
            }
        }

        [Required]
        [StringLength(32)]
        public String UserName { get; set; }
        [Required]
        [StringLength(128)]
        public String Password { get; set; }
        [StringLength(64)]
        public String Email { get; set; }
        [StringLength(32)]
        public String FirstName { get; set; }
        [StringLength(50)]
        public String MiddleName { get; set; }
        [StringLength(32)]
        public String LastName { get; set; }
        /// <summary>
        /// 用户头像 image/base64
        /// </summary>
        [StringLength(4096)]
        public String Avatar { get; set; }

        public bool EmailConfirmed { get; set; }
        [StringLength(128)]
        public String Description { get; set; }
    }
}



