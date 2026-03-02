using Microsoft.AspNetCore.Mvc;
using backend.Services;

namespace backend.Controllers;

[ApiController]
[Route("api/electricity-generation")]
public class ElectricityController : ControllerBase
{
    private readonly EiaService _eiaService;

    public ElectricityController(EiaService eiaService)
    {
        _eiaService = eiaService;
    }

    [HttpGet]
    public async Task<IActionResult> GetElectricityGeneration()
    {
        try
        {
            var result = await _eiaService.GetElectricityGenerationsAsync();
            return Ok(result);
        }
        catch (HttpRequestException ex)
        {
            return StatusCode(502, new { error = "Failed to fetch data from EIA API", details = ex.Message });
        }
        
    }


}