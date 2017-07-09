using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace Leopard.Utility
{
    public static class TypeHelper
    {
        public static bool SetValue(this object obj, string propName, object value)
        {
            Type type = obj.GetType();
            PropertyInfo property = type.GetProperties().FirstOrDefault(x => x.Name.ToLower().Equals(propName.ToLower()));
            if (property == null) return false;

            if (property.PropertyType.Equals(typeof(String)))
            {
                property.SetValue(obj, value.ToString(), null);
            }
            /*else if (property.PropertyType.IsEnum)
            {
                property.SetValue(obj, int.Parse(value.ToString()), null);
            }
            else if (property.PropertyType.IsGenericType && Nullable.GetUnderlyingType(property.PropertyType) != null && Nullable.GetUnderlyingType(property.PropertyType).IsEnum)
            {
                var enumType = Nullable.GetUnderlyingType(property.PropertyType);
                var enumValue = Enum.ToObject(enumType, value);
                property.SetValue(obj, enumValue, null);
            }
            else if (property.PropertyType.IsGenericType && Nullable.GetUnderlyingType(property.PropertyType) != null && Nullable.GetUnderlyingType(property.PropertyType).Equals(typeof(int)))
            {
                property.SetValue(obj, int.Parse(value.ToString()), null);
            }
            else if (property.PropertyType.IsGenericType && Nullable.GetUnderlyingType(property.PropertyType) != null && Nullable.GetUnderlyingType(property.PropertyType).Equals(typeof(decimal)))
            {
                property.SetValue(obj, decimal.Parse(value.ToString()), null);
            }*/
            else if (property.PropertyType.Equals(typeof(Decimal)))
            {
                property.SetValue(obj, decimal.Parse(value.ToString()), null);
            }
            else
            {
                property.SetValue(obj, value, null);
            }

            return true;
        }

        public static object GetValue(this object obj, string propName)
        {
            Type type = obj.GetType();
            PropertyInfo property = type.GetProperty(propName);
            if (property == null) return null;
            return property.GetValue(obj);
        }

        public static object InvokeMethod(this object obj, string methodName, object[] parameters)
        {
            Type type = obj.GetType();
            MethodInfo method = type.GetMethod(methodName);
            return method.Invoke(obj, parameters);
        }
    }

}
