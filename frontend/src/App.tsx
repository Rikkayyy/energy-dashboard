import { useState } from 'react';
import { OilPricesChart } from './components/OilPricesChart';
import { ElectricityChart } from './components/ElectricityChart';
import { NaturalGasChart } from './components/NaturalGasChart';

type Tab = 'oil' | 'electricity' | 'naturalGas';

const TABS: { id: Tab; label: string }[] = [
  { id: 'oil', label: 'Oil Prices' },
  { id: 'electricity', label: 'Electricity Generation' },
  { id: 'naturalGas', label: 'Natural Gas Storage' },
];

function App() {

  const [activeTab, setActiveTab] = useState<Tab>('oil');
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <h1 className="text-xl font-bold text-gray-900">⚡ Energy Dashboard</h1>
          <p className="text-sm text-gray-500">Powered by EIA Open Data</p>
        </div>
      </header>

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6">
          <nav className="flex gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {activeTab === 'oil' && <OilPricesChart />}
        {activeTab === 'electricity' && <ElectricityChart />}
        {activeTab === 'naturalGas' && <NaturalGasChart />}
      </main>

      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <p className="text-xs text-gray-400 text-center">
            Data sourced from the U.S. Energy Information Administration (EIA) Open Data API.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
