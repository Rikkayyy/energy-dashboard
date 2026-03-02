using Microsoft.AspNetCore.Mvc;
using backend.Services;

namespace backend.Controllers;

[ApiController]
[Route("api/oil-prices")]
public class OilPricesController : ControllerBase
{
    private readonly EiaService _eiaService;

    public OilPricesController(EiaService eiaService)
    {
        _eiaService = eiaService;
    }

    [HttpGet]
    public async Task<IActionResult> GetOilPrices()
    {
        try
        {
            var result = await _eiaService.GetOilPricesAsync();
            return Ok(result);
        }
        catch (HttpRequestException ex)
        {
            return StatusCode(502, new { error = "Failed to fetch data from EIA API", details = ex.Message });
        }
    }
}