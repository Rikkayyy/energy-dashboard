namespace backend.Models;

public class EiaApiResponse
{
    public EiaResponseData? Response { get; set; }
}

public class EiaResponseData
{
    public string Total { get; set; } = string.Empty;
    public string DateFormat { get; set; } = string.Empty;
    public string Frequency { get; set; } = string.Empty;
    public List<Dictionary<string, object>>? Data { get; set; }
}