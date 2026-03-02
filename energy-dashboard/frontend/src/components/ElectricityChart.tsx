import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { api } from '../services/api';
import type { ElectricityGeneration } from '../types/energy';

const FUEL_COLORS: Record<string, string> = {
  ALL: '#6b7280',
  NG: '#f97316',
  COL: '#374151',
  NUC: '#8b5cf6',
  SUN: '#eab308',
  WND: '#06b6d4',
  HYC: '#3b82f6',
  AOR: '#22c55e',
};

const FUEL_LABELS: Record<string, string> = {
  ALL: 'All Fuels',
  NG: 'Natural Gas',
  COL: 'Coal',
  NUC: 'Nuclear',
  SUN: 'Solar',
  WND: 'Wind',
  HYC: 'Hydro',
  AOR: 'All Renewables',
};

export function ElectricityChart() {
  const [data, setData] = useState<ElectricityGeneration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getElectricityGeneration()
      .then((d) => setData(d))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-gray-500">Loading electricity data...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  // Filter out ALL so we don't double count
  const filtered = data.filter((d) => d.fuelTypeId !== 'ALL');

  // Get the latest period
  const latestPeriod = filtered[0]?.date;
  const latestData = filtered.filter((d) => d.date === latestPeriod);

  // Shape data for the chart
  const chartData = latestData
    .map((d) => ({
      fuelType: FUEL_LABELS[d.fuelTypeId] || d.fuelTypeDescription,
      generation: d.generation,
      fuelTypeId: d.fuelTypeId,
    }))
    .sort((a, b) => b.generation - a.generation);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Electricity Generation by Source</h2>
        <p className="text-sm text-gray-500">
          U.S. monthly generation — {latestPeriod} (thousand MWh)
        </p>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="fuelType" tick={{ fontSize: 12 }} />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(v: number) =>
              v >= 1000 ? `${(v / 1000).toFixed(0)}M` : `${v}K`
            }
          />
          <Tooltip
            formatter={(value: number | undefined) => [
              value != null ? `${value.toLocaleString()} thousand MWh` : 'N/A',
              'Generation',
            ]}
          />
          <Bar dataKey="generation" radius={[4, 4, 0, 0]}>
            {chartData.map((entry) => (
              <Cell key={entry.fuelTypeId} fill={FUEL_COLORS[entry.fuelTypeId] || '#9ca3af'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <p className="text-xs text-gray-400 mt-3">Source: U.S. Energy Information Administration</p>
    </div>
  );
}