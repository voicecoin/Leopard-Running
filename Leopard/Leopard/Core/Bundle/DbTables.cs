using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using Leopard.Enums;

namespace Leopard.DbTables
{
    public class BundleEntity : NamedEntity
    {
        [Required]
        public string EntityName { get; set; }
        [ForeignKey("BundleId")]
        public List<BundleFieldEntity> Fields { get; set; }
    }

    public class BundleFieldEntity : NamedEntity
    {
        [Required]
        public string BundleId { get; set; }
        [Required]
        public FieldTypes FieldTypeId { get; set; }
    }

    public class BundleFieldSettingEntity : NamedEntity
    {
        [Required]
        public string BundleFieldId { get; set; }
        [Required]
        public string Value { get; set; }
    }
}