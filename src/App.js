import { useState, useEffect, useMemo, useCallback, useRef } from "react";

import "./App.css";

import packageJson from "../package.json";

import LoadingScreen from "./components/LoadingScreen";
import ErrorBanner from "./components/ErrorBanner";

import DayNightContainer from "./components/DayNightContainer";

import PlantBlock from "./components/PlantBlock";
import BatteryBlock from "./components/BatteryBlock";
import DeviceBlock from "./components/DeviceBlock";
import HistoryBlock from "./components/HistoryBlock";
import HistoryTable from "./components/HistoryTable";

import { getDashboardMetrics } from "./utils/dashboard";

export const API_BASE = "https://plant-server-863h.onrender.com";

function App() {
  const [latest, setLatest] = useState(null);

  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const hasInitialized = useRef(false);

  const metrics = useMemo(
    () => (latest ? getDashboardMetrics(latest, history) : null),

    [latest, history]
  );

  const fetchData = useCallback(
    async (silent = false) => {
      try {
        if (!silent) {
          setLoading(true);
        }

        const [latestRes, historyRes] = await Promise.all([
          fetch(`${API_BASE}/api/device/balcony/latest`),

          fetch(`${API_BASE}/api/device/balcony?limit=24`),
        ]);

        if (!latestRes.ok) {
          throw new Error("Latest request failed");
        }

        if (!historyRes.ok) {
          throw new Error("History request failed");
        }

        const [latestData, historyData] = await Promise.all([
          latestRes.json(),

          historyRes.json(),
        ]);

        setLatest(latestData);

        setHistory(historyData);

        setError(null);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    },

    []
  );

  useEffect(() => {
    let mounted = true;

    if (!hasInitialized.current && mounted) {
      hasInitialized.current = true;
      fetchData();
    }

    const id = setInterval(
      () => {
        if (mounted) {
          fetchData(true);
        }
      },

      5 * 60 * 1000
    );

    return () => {
      mounted = false;

      clearInterval(id);
    };
  }, [fetchData]);

  if (loading && !latest) {
    return <LoadingScreen />;
  }

  return (
    <div className="App">
      <h1>🌿 Plant Monitor</h1>

      <DayNightContainer history={history} metrics={metrics} />

      <ErrorBanner error={error} />

      {latest && metrics && (
        <>
          <div className="dashboard">
            <PlantBlock latest={latest} history={history} metrics={metrics} />

            <BatteryBlock latest={latest} history={history} />

            <DeviceBlock latest={latest} history={history} />

            <HistoryBlock latest={latest} history={history} />
          </div>

          <HistoryTable history={history} />
        </>
      )}

      <button className="refresh-btn" onClick={() => fetchData()}>
        🔄 Refresh Now
      </button>

      <div className="footer">
        <small>
          Last updated:{" "}
          {latest ? new Date(latest.created_at).toLocaleTimeString() : "-"} • v{packageJson.version}
        </small>
      </div>
    </div>
  );
}

export default App;
