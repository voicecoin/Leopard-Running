using log4net;
using log4net.Config;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;

namespace Leopard.Utility
{
    public static class MyLogger
    {
        private static readonly ILog logger = LogManager.GetLogger(typeof(MyLogger));

        public static void Log(this Object log, MyLogLevel level = MyLogLevel.INFO)
        {
            if (!logger.Logger.Repository.Configured)
            {
                var logRepository = LogManager.GetRepository(Assembly.GetEntryAssembly());
                XmlConfigurator.Configure(logRepository, new FileInfo("log4net.config"));

                //log4net.Config.XmlConfigurator.Configure();
            }

            string json = JsonConvert.SerializeObject(log, Formatting.None,
                        new JsonSerializerSettings()
                        {
                            ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                        });

            switch (level)
            {
                case MyLogLevel.DEBUG:
                    logger.Debug(json);
                    break;
                case MyLogLevel.INFO:
                    logger.Info(json);
                    break;
                case MyLogLevel.WARN:
                    logger.Warn(json);
                    break;
                case MyLogLevel.ERROR:
                    logger.Error(json);
                    break;
                case MyLogLevel.FATAL:
                    logger.Fatal(json);
                    break;
                default:
                    break;
            }
        }
    }

    public enum MyLogLevel
    {
        ALL = 1,
        DEBUG = 2,
        INFO = 4,
        WARN = 8,
        ERROR = 16,
        FATAL = 32,
        OFF = 0
    }
}