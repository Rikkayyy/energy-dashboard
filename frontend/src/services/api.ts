import type { OilPrice, ElectricityGeneration, NaturalGasStorage } from '../types/energy';

const BASE_URL = '/api';

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export const api = {
  getOilPrices() {
    return fetchJson<OilPrice[]>(`${BASE_URL}/oil-prices`);
  },

  getElectricityGeneration() {
    return fetchJson<ElectricityGeneration[]>(`${BASE_URL}/electricity-generation`);
  },

  getNaturalGasStorage() {
    return fetchJson<NaturalGasStorage[]>(`${BASE_URL}/natural-gas/storage`);
  },
};