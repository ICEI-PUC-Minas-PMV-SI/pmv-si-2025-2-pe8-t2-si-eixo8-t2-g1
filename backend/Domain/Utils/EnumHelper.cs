using System;
using System.ComponentModel;
using System.Linq;
using System.Reflection;

namespace Domain.Utils;

public static class EnumHelper
{
    public static string? GetDescription<TEnum>(this TEnum value) where TEnum : struct, Enum
    {
        var fi = typeof(TEnum).GetField(value.ToString());
        var attr = fi?.GetCustomAttribute<DescriptionAttribute>(inherit: false);
        return attr?.Description ?? string.Empty;
    }

    public static TEnum? ParseFromStringOrDescription<TEnum>(string? input) where TEnum : struct, Enum
    {
        if (string.IsNullOrWhiteSpace(input))
            return null;

        var normalized = input.Trim();

        // 1) Try parse by enum name
        if (Enum.TryParse<TEnum>(normalized, ignoreCase: true, out var byName))
            return byName;

        // 2) Try match by Description attribute
        var values = Enum.GetValues(typeof(TEnum)).Cast<TEnum>();
        foreach (var v in values)
        {
            var desc = v.GetDescription();
            if (!string.IsNullOrEmpty(desc) && string.Equals(desc, normalized, StringComparison.OrdinalIgnoreCase))
                return v;
        }

        // Not found
        return null;
    }

    public static string? GetDescriptionFromString<TEnum>(string? input) where TEnum : struct, Enum
    {
        var enumVal = ParseFromStringOrDescription<TEnum>(input);
        if (enumVal == null)
            return null;

        return enumVal.Value.GetDescription();
    }
}
