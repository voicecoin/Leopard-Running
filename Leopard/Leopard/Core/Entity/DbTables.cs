using EntityFrameworkCore.Triggers;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using Leopard.Enums;

namespace Leopard.DbTables
{
    /// <summary>
    /// All other model must derive from EntityModel
    /// https://docs.microsoft.com/en-us/ef/core/miscellaneous/cli/powershell
    /// https://docs.microsoft.com/en-us/ef/core/get-started/aspnetcore/new-db
    /// We are using TPH model, https://docs.microsoft.com/en-us/aspnet/core/data/ef-mvc/inheritance
    /// Add-Migration Initial -context "VDbContext"
    /// Update-Database -context "VDbContext"
    /// </summary>
    public abstract class DbTable
    {
        static DbTable()
        {
            Triggers<DbTable>.Inserting += entry =>
            {
                entry.Entity.CreatedDate = DateTime.UtcNow;
                entry.Entity.ModifiedDate = entry.Entity.CreatedDate;
            };

            Triggers<DbTable>.Inserted += entry =>
            {

            };

            Triggers<DbTable>.Deleting += entry =>
            {

            };

            Triggers<DbTable>.Deleted += entry =>
            {

            };

            Triggers<DbTable>.Updating += entry =>
            {
                entry.Entity.ModifiedDate = DateTime.UtcNow;
            };

            Triggers<DbTable>.Updated += entry =>
            {

            };

            Triggers<DbTable>.UpdateFailed += entry =>
            {

            };
        }

        [Key]
        [StringLength(36)]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public String Id { get; set; }

        public EntityStatus Status { get; set; }

        /// <summary>
        /// https://docs.microsoft.com/en-us/aspnet/core/data/ef-mvc/concurrency
        /// </summary>
        [Timestamp]
        public byte[] RowVersion { get; set; }
        //[Required]
        public DateTime CreatedDate { get; set; }
        //[Required]
        public string CreatedUserId { get; set; }
        //[Required]
        public DateTime ModifiedDate { get; set; }
        //[Required]
        public string ModifiedUserId { get; set; }
    }

    public abstract class NamedEntity : DbTable
    {
        [Required]
        [MaxLength(50, ErrorMessage = "Entity Name cannot be longer than 50 characters.")]
        public String Name { get; set; }
    }
}



