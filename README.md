# Energy Dashboard

A full-stack dashboard for visualizing U.S. energy market data — oil prices, electricity generation by fuel type, and natural gas storage — sourced from the [EIA (U.S. Energy Information Administration) Open Data API](https://www.eia.gov/opendata/).

- **Backend:** ASP.NET Core (.NET 10) Web API that proxies and caches EIA data
- **Frontend:** React 19 + TypeScript + Vite, styled with Tailwind CSS, charts via Recharts

## Project Structure

```
energy-dashboard/
├── Energy-Projects.sln        # Visual Studio solution
├── backend/                   # ASP.NET Core Web API
│   ├── Controllers/           # API endpoints
│   ├── Services/              # EiaService — fetches & caches EIA data
│   ├── Models/                # Response DTOs
│   ├── Configuration/         # EiaSettings (API key, base URL)
│   └── Program.cs
└── frontend/                  # React + Vite SPA
    └── src/
        ├── components/        # Chart components per data type
        ├── services/api.ts    # Fetch wrapper for backend endpoints
        └── types/energy.ts    # Shared TypeScript types
```

## Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) (v18+) and npm
- A free [EIA API key](https://www.eia.gov/opendata/register.php)

## Setup

### 1. Backend

Configure your EIA API key using .NET user secrets (keeps it out of source control):

```bash
cd backend
dotnet user-secrets set "EIA:ApiKey" "your-eia-api-key"
```

Then run the API:

```bash
dotnet run
```

The API starts on `http://localhost:5121`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

The app starts on `http://localhost:5173` and proxies `/api/*` requests to the backend at `http://localhost:5121` (see `vite.config.ts`).

Open `http://localhost:5173` in your browser.

## API Endpoints

All endpoints return JSON and cache results in memory to reduce EIA API calls.

| Method | Route | Description | Cache TTL |
|---|---|---|---|
| GET | `/api/oil-prices` | Daily spot prices for WTI and Brent crude | 30 min |
| GET | `/api/electricity-generation` | Monthly U.S. electricity generation by fuel type | 60 min |
| GET | `/api/natural-gas/storage` | Weekly U.S. natural gas storage levels | 60 min |
| GET | `/health` | Health check | — |

## Building for Production

**Backend:**
```bash
cd backend
dotnet build -c Release
```

**Frontend:**
```bash
cd frontend
npm run build
```

## Notes

- The EIA API key is required for all data endpoints to function; without it, requests to the EIA API will fail and the corresponding endpoint returns a `502`.
- In-memory caching means data resets on backend restart. There's no persistent database — this project fetches live from EIA on cache miss.
