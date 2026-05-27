import { useState } from "react";

import { API_BASE } from "../App";

import { getPeakMoments } from "../utils/history";

import { getDayNightTemps, getEnvironmentScore } from "../utils/environment";

export default function HistoryBlock({ latest, history }) {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const [allHistory, setAllHistory] = useState([]);

  async function fetchData() {
    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/api/history`);

      if (!res.ok) {
        throw new Error("API Error");
      }

      const data = await res.json();

      setAllHistory(data);

      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (!latest || !history?.length) {
    return null;
  }

  const peakMoments = getPeakMoments(allHistory.length ? allHistory : history);

  const dayNightTemps = getDayNightTemps(
    allHistory.length ? allHistory : history
  );

  const envScore = getEnvironmentScore(
    latest,

    allHistory.length ? allHistory : history
  );

  return (
    <div className="block history-block">
      <h2>📈 History</h2>

      <button className="fetch-history-btn" onClick={fetchData}>
        {loading ? "Fetching..." : "Fetch all History"}
      </button>

      {error && <div className="metric-warning">{error}</div>}

      <div className="metrics-row">
        <div className="metric-card">
          <div className="metric-header">
            <span>🌡️</span>

            <span>Day vs Night</span>
          </div>

          <div className="metric-detail">
            Day avg: <strong>{dayNightTemps.day}°C</strong>
          </div>

          <div className="metric-detail">
            Night avg: <strong>{dayNightTemps.night}°C</strong>
          </div>

          <div className="metric-detail">Δ {dayNightTemps.delta}°C</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span>📍</span>

            <span>Peak moments</span>
          </div>

          <div className="metric-detail">🔥 {peakMoments.hottest.value}°</div>

          <div className="metric-detail">💧 {peakMoments.wettest.value}</div>

          <div className="metric-detail">🔋 {peakMoments.battery.value}V</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span>{envScore.emoji}</span>

            <span>Environment</span>
          </div>

          <div className="metric-main">{envScore.score}%</div>

          <div className="metric-breakdown">
            <div>🌱 {Math.round(envScore.score * 0.7)}</div>

            <div>🌡️ {Math.round(envScore.score * 0.3)}</div>
          </div>
        </div>
      </div>

      <div className="score-bar-full">
        <div className="bar-label">Environment Health</div>

        <div className="bar-container">
          <div
            className="bar-fill score"
            style={{
              width: `${envScore.score}%`,
            }}
          />
        </div>

        <div className="bar-value">{envScore.score}/100</div>
      </div>
    </div>
  );
}
