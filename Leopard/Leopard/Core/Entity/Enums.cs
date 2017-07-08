using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Leopard.Enums
{
    public enum EntityStatus
    {
        /// <summary>
        /// Initializing, default
        /// </summary>
        Initial = 0,
        /// <summary>
        /// Funcational, Readable/ Writable/ Deletable
        /// </summary>
        Active = 1,
        /// <summary>
        /// Readonly
        /// </summary>
        Freezing = 2,
        /// <summary>
        /// Will be purged from system
        /// </summary>
        Purge = 14,
        /// <summary>
        /// Mark as deleted
        /// </summary>
        Deleted = 12,
        /// <summary>
        /// Invisible to user
        /// </summary>
        Hidden = 11
    }
}



