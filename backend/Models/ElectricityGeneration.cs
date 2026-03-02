namespace backend.Models;

public record ElectricityGeneration(
    string Date,
    string State,
    string FuelTypeId,
    string FuelTypeDescription,
    decimal Generation,
    string GenerationUnits
);

