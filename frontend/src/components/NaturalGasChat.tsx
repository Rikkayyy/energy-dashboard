import { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { api } from '../services/api';
import type { NaturalGasStorage } from '../types/energy';

export function NaturalGasChart() {
  const [data, setData] = useState<NaturalGasStorage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getNaturalGasStorage()
      .then((d) => setData(d))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-gray-500">Loading natural gas data...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  // Sort by date ascending so the chart reads left to right
  const chartData = [...data].sort((a, b) =>
    a.weekEnding.localeCompare(b.weekEnding)
  );

  const latest = chartData[chartData.length - 1];
  const previous = chartData[chartData.length - 2];
  const change = latest && previous ? latest.storageLevel - previous.storageLevel : null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Natural Gas Storage</h2>
          <p className="text-sm text-gray-500">
            Weekly U.S. working gas in underground storage (BCF)
          </p>
        </div>
        {latest && (
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">
              {latest.storageLevel.toLocaleString()} BCF
            </p>
            {change !== null && (
              <p className={`text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change >= 0 ? '+' : ''}{change.toLocaleString()} from prior week
              </p>
            )}
          </div>
        )}
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="storageGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f97316" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="weekEnding"
            tick={{ fontSize: 12 }}
            tickFormatter={(d: string) => {
              const date = new Date(d);
              return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            }}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(v: number) => `${v.toLocaleString()}`}
          />
          <Tooltip
            formatter={(value) => [
              typeof value === 'number' ? `${value.toLocaleString()} BCF` : `${value} BCF`,
              'Storage',
            ]}
            labelFormatter={(label) =>
              new Date(String(label)).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })
            }
          />
          <Area
            type="monotone"
            dataKey="storageLevel"
            stroke="#f97316"
            strokeWidth={2}
            fill="url(#storageGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>

      <p className="text-xs text-gray-400 mt-3">Source: U.S. Energy Information Administration</p>
    </div>
  );
}