import { useState, useEffect } from "react";
import "./App.css";

import LoadingScreen from "./components/LoadingScreen";
import ErrorBanner from "./components/ErrorBanner";
import DayNightContainer from "./components/DayNightContainer";
import StatusCard from "./components/StatusCard";
import HistoryTable from "./components/HistoryTable";

const API_BASE =
  "https://plant-server-863h.onrender.com";

function App() {

  const [latest, setLatest] = useState(null);

  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  useEffect(() => {

    fetchData();

    const interval =
      setInterval(
        fetchData,
        5 * 60 * 1000
      );

    return () =>
      clearInterval(
        interval
      );

  }, []);

  async function fetchData() {

    try {

      setLoading(true);

      const [latestRes, historyRes] = await Promise.all([
        fetch(`${API_BASE}/api/device/balcony/latest`),
        fetch(`${API_BASE}/api/device/balcony?limit=24`)
      ]);

      if (!latestRes.ok || !historyRes.ok) {
        throw new Error("API Error");
      }

      const latestData = await latestRes.json();
      const historyData = await historyRes.json();

      setLatest(latestData);
      setHistory(historyData);
      setError(null);

    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }

  }

  if (loading && !latest) {
    return <LoadingScreen />;
  }

  return (

    <div className="App">

      <h1>🌿 Plant Monitor</h1>

      <DayNightContainer />

      <ErrorBanner error={error} />

      {latest && (
        <>
          <StatusCard 
            latest={latest} 
            onRefresh={fetchData}
          />

          <HistoryTable history={history} />
        </>
      )}

    </div>

  );

}

export default App;