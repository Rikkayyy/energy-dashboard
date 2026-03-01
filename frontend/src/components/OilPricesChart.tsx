import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { api } from '../services/api';
import type { OilPrice } from '../types/energy';

interface ChartDataPoint {
  date: string;
  wti?: number;
  brent?: number;
}

function transformPrices(prices: OilPrice[]): ChartDataPoint[] {
  const byDate = new Map<string, ChartDataPoint>();

  for (const p of prices) {
    const existing = byDate.get(p.date) || { date: p.date };

    if (p.productName.includes('WTI')) {
      existing.wti = p.price;
    } else if (p.productName.includes('Brent')) {
      existing.brent = p.price;
    }

    byDate.set(p.date, existing);
  }

  return Array.from(byDate.values()).sort((a, b) => a.date.localeCompare(b.date));
}

export function OilPricesChart() {
  const [prices, setPrices] = useState<OilPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getOilPrices()
      .then((data) => setPrices(data as OilPrice[]))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-gray-500">Loading oil prices...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  const chartData = transformPrices(prices);
  const latestWti = chartData[chartData.length - 1]?.wti;
  const previousWti = chartData[chartData.length - 2]?.wti;
  const change = latestWti && previousWti ? latestWti - previousWti : null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Crude Oil Prices</h2>
          <p className="text-sm text-gray-500">WTI vs Brent — Daily spot prices</p>
        </div>
        {latestWti && (
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">${latestWti.toFixed(2)}</p>
            {change !== null && (
              <p className={`text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change >= 0 ? '+' : ''}{change.toFixed(2)} from previous day
              </p>
            )}
          </div>
        )}
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickFormatter={(d: string) => {
              const date = new Date(d);
              return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            }}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(v: number) => `$${v}`}
            domain={['auto', 'auto']}
          />
          <Tooltip
            formatter={(value: number | undefined) => [value != null ? `$${value.toFixed(2)}` : 'N/A', '']}
            labelFormatter={(label) =>
              new Date(String(label)).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })
            }
          />
          <Legend />
          <Line type="monotone" dataKey="wti" name="WTI Crude" stroke="#2563eb" strokeWidth={2} dot={false} connectNulls />
          <Line type="monotone" dataKey="brent" name="Brent Crude" stroke="#dc2626" strokeWidth={2} dot={false} connectNulls />
        </LineChart>
      </ResponsiveContainer>

      <p className="text-xs text-gray-400 mt-3">Source: U.S. Energy Information Administration</p>
    </div>
  );
}