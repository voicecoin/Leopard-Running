using AutoMapper;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Leopard.Utility
{
    public static class ObjectExtensions
    {
        public static T Map<T>(this Object source)
        {
            return Mapper.Map<T>(source);
        }

        public static T MapByJsonString<T>(this Object Source)
        {
            string json = JsonConvert.SerializeObject(Source);
            return JsonConvert.DeserializeObject<T>(json);
        }
    }
}
