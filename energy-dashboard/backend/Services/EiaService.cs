using System.Text.Json;
using Microsoft.Extensions.Options;
using backend.Configuration;
using backend.Models;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.Extensions.Caching.Memory;

namespace backend.Services;

public class EiaService
{
    private readonly HttpClient _httpClient;
    private readonly EiaSettings _settings;
    private readonly IMemoryCache _cache;

    public EiaService(HttpClient httpClient, IOptions<EiaSettings> settings, IMemoryCache cache)
    {
        _httpClient = httpClient;
        _settings = settings.Value;
        _cache = cache;
    }

    public async Task<List<OilPrice>> GetOilPricesAsync()
    {
        var cacheKey = "oil-prices";

        // Check cache first
        if (_cache.TryGetValue(cacheKey, out List<OilPrice>? cached) && cached != null)
        {
            // Console.WriteLine("Cache hit for oil prices");
            return cached;
        }

        // Console.WriteLine("Cache miss for oil prices, fetching from API");
        // Cache miss, fetch from API
        var url = $"{_settings.BaseUrl}petroleum/pri/spt/data/" +
                  $"?api_key={_settings.ApiKey}" +
                  $"&frequency=daily" +
                  $"&data[0]=value" +
                  $"&facets[product][]=EPCWTI" +
                  $"&sort[0][column]=period" +
                  $"&sort[0][direction]=desc" +
                  $"&length=30";

        var response = await _httpClient.GetAsync(url);
        response.EnsureSuccessStatusCode();

        var json = await response.Content.ReadAsStringAsync();
        // return JsonSerializer.Deserialize<JsonElement>(json);

        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        var eiaResponse = JsonSerializer.Deserialize<EiaApiResponse>(json, options);

        var prices = new List<OilPrice>();

        if (eiaResponse?.Response?.Data != null)
        {
            foreach (var item in eiaResponse.Response.Data)
            {
                var date = item.GetValueOrDefault("period")?.ToString() ?? "";
                var productName = item.GetValueOrDefault("product-name")?.ToString() ?? "";
                var valueStr = item.GetValueOrDefault("value")?.ToString() ?? "0";
                var unit = item.GetValueOrDefault("unit")?.ToString() ?? "";

                if (decimal.TryParse(valueStr, out var price))
                {
                    prices.Add(new OilPrice(date, productName, price, unit));
                }
            }
        }

        _cache.Set(cacheKey, prices, TimeSpan.FromMinutes(30)); // Cache for 30 minutes

        return prices;
    }

    public async Task<List<ElectricityGeneration>> GetElectricityGenerationsAsync()
    {
        var cacheKey = "electricity-generations";

        // Check cache first
        if (_cache.TryGetValue(cacheKey, out List<ElectricityGeneration>? cached) && cached != null)
        {
            return cached;
        }

        var url = $"{_settings.BaseUrl}electricity/electric-power-operational-data/data/" +
                  $"?api_key={_settings.ApiKey}" +
                  $"&frequency=monthly" +
                  $"&data[0]=generation" +
                  $"&facets[fueltypeid][]=ALL" +
                  $"&facets[fueltypeid][]=SUN" +
                  $"&facets[fueltypeid][]=WND" +
                  $"&facets[fueltypeid][]=NG" +
                  $"&facets[fueltypeid][]=COL" +
                  $"&facets[fueltypeid][]=NUC" +
                  $"&facets[fueltypeid][]=HYC" +
                  $"&facets[fueltypeid][]=AOR" +
                  $"&facets[sectorid][]=99" +
                  $"&facets[location][]=US" +
                  $"&sort[0][column]=period" +
                  $"&sort[0][direction]=desc" +
                  $"&length=60";

            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var eiaResponse = JsonSerializer.Deserialize<EiaApiResponse>(json, options);

            var results = new List<ElectricityGeneration>();

            if (eiaResponse?.Response?.Data != null)
            {
                foreach (var item in eiaResponse.Response.Data)
                {
                    Console.WriteLine(string.Join(", ", item.Select(k => $"{k.Key}: {k.Value}")));
                    var period = item.GetValueOrDefault("period")?.ToString() ?? "";
                    var state = item.GetValueOrDefault("stateDescription")?.ToString() ?? "";
                    var fuelTypeId = item.GetValueOrDefault("fueltypeid")?.ToString() ?? "";
                    var fuelType = item.GetValueOrDefault("fuelTypeDescription")?.ToString() ?? "";
                    var generationStr = item.GetValueOrDefault("generation")?.ToString() ?? "0";
                    var generationUnits = item.GetValueOrDefault("generation-units")?.ToString() ?? "";

                    if (decimal.TryParse(generationStr, out var generation))
                    {
                        results.Add(new ElectricityGeneration(period, state, fuelTypeId, fuelType, generation, generationUnits));
                    }
                }
            }

        _cache.Set(cacheKey, results, TimeSpan.FromMinutes(60)); // Cache for 60 minutes

        return results;
    }

    public async Task<List<NaturalGasStorage>> GetNaturalGasStorageAsync()
    {

        var cacheKey = "natural-gas-storage";
        // Check cache first
        if (_cache.TryGetValue(cacheKey, out List<NaturalGasStorage>? cached) && cached != null)
        {
            return cached;
        }
        
        var url = $"{_settings.BaseUrl}natural-gas/stor/wkly/data/" +
                $"?api_key={_settings.ApiKey}" +
                $"&frequency=weekly" +
                $"&data[0]=value" +
                $"&facets[process][]=SWO" +
                $"&facets[duoarea][]=R48" +
                $"&sort[0][column]=period" +
                $"&sort[0][direction]=desc" +
                $"&length=52";

        var response = await _httpClient.GetAsync(url);
        response.EnsureSuccessStatusCode();

        var json = await response.Content.ReadAsStringAsync();
        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        var eiaResponse = JsonSerializer.Deserialize<EiaApiResponse>(json, options);

        var results = new List<NaturalGasStorage>();

        if (eiaResponse?.Response?.Data != null)
        {
            foreach (var item in eiaResponse.Response.Data)
            {
                var period = item.GetValueOrDefault("period")?.ToString() ?? "";
                var valueStr = item.GetValueOrDefault("value")?.ToString() ?? "0";
                var unit = item.GetValueOrDefault("units")?.ToString() ?? "";

                if (decimal.TryParse(valueStr, out var storage))
                {
                    results.Add(new NaturalGasStorage(period, storage, unit));
                }
            }
        }

        _cache.Set(cacheKey, results, TimeSpan.FromMinutes(60)); // Cache for 60 minutes

        return results;
    }
}