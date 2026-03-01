export interface OilPrice {
  date: string;
  productName: string;
  price: number;
  unit: string;
}

export interface ElectricityGeneration {
  date: string;
  state: string;
  fuelTypeId: string;
  fuelTypeDescription: string;
  generation: number;
  generationUnits: string;
}

export interface NaturalGasStorage {
  weekEnding: string;
  storageLevel: number;
  unit: string;
}