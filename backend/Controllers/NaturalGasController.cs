using Microsoft.AspNetCore.Mvc;
using backend.Services;

namespace backend.Controllers;

[ApiController]
[Route("api/natural-gas")]
public class NaturalGasController : ControllerBase
{
    private readonly EiaService _eiaService;

    public NaturalGasController(EiaService eiaService)
    {
        _eiaService = eiaService;
    }

    [HttpGet("storage")]
    public async Task<IActionResult> GetStorage()
    {
        try
        {
            var result = await _eiaService.GetNaturalGasStorageAsync();
            return Ok(result);
        }
        catch (HttpRequestException ex)
        {
            return StatusCode(502, new { error = "Failed to fetch data from EIA API", details = ex.Message });
        }
    }
}