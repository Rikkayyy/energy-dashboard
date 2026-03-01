namespace backend.Models;

public record NaturalGasStorage(
    string WeekEnding,
    decimal StorageLevel,
    string Unit
);