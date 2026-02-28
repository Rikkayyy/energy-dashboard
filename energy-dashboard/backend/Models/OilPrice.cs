namespace backend.Models;

public record OilPrice(
    string Date,
    string ProductName,
    decimal Price,
    string Unit
);
