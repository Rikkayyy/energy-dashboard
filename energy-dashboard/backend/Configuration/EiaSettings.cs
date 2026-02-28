namespace backend.Configuration;

public class EiaSettings
{
    public const string SectionName = "EIA";

    public string ApiKey { get; set; } = string.Empty;
    public string BaseUrl { get; set; } = "https://api.eia.gov/v2/";
}