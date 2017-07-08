using RestSharp;
using System;
using System.Threading.Tasks;
using Leopard.Utility;
using System.Xml.Linq;
using Leopard.Core;
using Senparc.Weixin.MP.MessageHandlers;
using Senparc.Weixin.MP.Entities.Request;
using Senparc.Weixin.MP.Entities;
using Senparc.Weixin.Context;

namespace Leopard.Apps.WeChat
{
    public class WexinMessageHandler : MessageHandler<CustomMessageContext>
    {
        public WexinMessageHandler(XDocument inputStream, PostModel postModel, int maxRecordCount = 0)
            : base(inputStream, postModel, maxRecordCount)
        {

        }

        
        public override IResponseMessageBase DefaultResponseMessage(IRequestMessageBase requestMessage)
        {
            //ResponseMessageText也可以是News等其他类型
            var responseMessage = CreateResponseMessage<ResponseMessageText>();
            responseMessage.Content = "默认回复。";
            return responseMessage;
        }

        public override IResponseMessageBase OnTextRequest(RequestMessageText requestMessage)
        {
            requestMessage.Log(MyLogLevel.DEBUG);

            var client = new RestClient(CoreController.Configuration.GetSection("NlpWebHost:url").Value);

            string clientAccessToken = "dcab96ca3f844d029f145b085dabe2c7"; // Default as Yaya

            if (requestMessage.ToUserName.Equals("gh_c96a6311ab6d"))
            {
                clientAccessToken = "4e0cf80467fa4536be57b358a6d54368"; // Lingxihuagu
            }

            var request = new RestRequest("v1/Conversation/Text", Method.GET);
            //request.AddUrlSegment("sessionId", requestMessage.FromUserName);
            request.AddParameter("sessionId", requestMessage.FromUserName);
            request.AddParameter("text", requestMessage.Content);
            request.AddParameter("clientAccessToken", clientAccessToken);

            /*
            var response = client.Execute(request);

            client.ExecuteAsync(request, (response) => {
                var result = Senparc.Weixin.MP.AdvancedAPIs.CustomApi.SendText("wx12b178fb4ffd4560", WeixinOpenId, response.Content);
            });

            return DefaultResponseMessage(requestMessage);*/

            var responseMessage = CreateResponseMessage<ResponseMessageText>();
            responseMessage.Content = "Test";

            responseMessage.Log(MyLogLevel.DEBUG);

            return responseMessage;
        }

        public override IResponseMessageBase OnVoiceRequest(RequestMessageVoice requestMessage)
        {
            return null;
        }
    }

    public class CustomMessageContext : MessageContext<IRequestMessageBase, IResponseMessageBase>
    {
        public CustomMessageContext()
        {
            base.MessageContextRemoved += CustomMessageContext_MessageContextRemoved;
        }

        /// <summary>
        /// 当上下文过期，被移除时触发的时间
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        void CustomMessageContext_MessageContextRemoved(object sender, Senparc.Weixin.Context.WeixinContextRemovedEventArgs<IRequestMessageBase, IResponseMessageBase> e)
        {
            /* 注意，这个事件不是实时触发的（当然你也可以专门写一个线程监控）
             * 为了提高效率，根据WeixinContext中的算法，这里的过期消息会在过期后下一条请求执行之前被清除
             */

            var messageContext = e.MessageContext as CustomMessageContext;
            if (messageContext == null)
            {
                return;//如果是正常的调用，messageContext不会为null
            }

            //TODO:这里根据需要执行消息过期时候的逻辑，下面的代码仅供参考

            //Log.InfoFormat("{0}的消息上下文已过期",e.OpenId);
            //api.SendMessage(e.OpenId, "由于长时间未搭理客服，您的客服状态已退出！");
        }
    }
}
