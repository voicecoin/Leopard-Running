using AutoMapper;
using Newtonsoft.Json;
using RestSharp;
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

        public static String GetVerifyCode()
        {
            Random verifycodeGenerator = new Random();
            return verifycodeGenerator.Next(100000, 999999).ToString();
        }

        public static Task<IRestResponse> Execute(this IRestClient restClient, RestRequest restRequest)
        {
            var tcs = new TaskCompletionSource<IRestResponse>();
            restClient.ExecuteAsync(restRequest, (restResponse, asyncHandle) =>
            {
                if (restResponse.ResponseStatus == ResponseStatus.Error)
                    tcs.SetException(restResponse.ErrorException);
                else
                    tcs.SetResult(restResponse);
            });
            return tcs.Task;
        }
    }
}
