import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { api } from '../services/api';
import type { OilPrice } from '../types/energy';

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

  if (loading) return <p>Loading oil prices...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Crude Oil Prices (WTI)</h2>
      <p>Daily spot price — $/barrel</p>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={prices}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={['auto', 'auto']} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#2563eb"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}