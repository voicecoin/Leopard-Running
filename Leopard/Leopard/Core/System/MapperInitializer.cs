using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Leopard.Core
{
    public class MapperInitializer
    {
        public static void Initialize()
        {
            Mapper.Initialize(cfg =>
            {

            });
        }
    }
}
