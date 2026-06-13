import { getMoistureDryingSpeedByPeriod } from "../utils/soil";

import { getTemperatureRange } from "../utils/environment";

export default function PlantBlock({ metrics, latest, history }) {
  if (!metrics || !latest) {
    return null;
  }

  const { moisture, waterForecast } = metrics;

  const dryRateByPeriod = getMoistureDryingSpeedByPeriod(history);

  const tempRange = getTemperatureRange(history);

  const moistureStatus = {
    emoji: moisture.emoji,

    label: moisture.label,

    percent: moisture.percent,

    color:
      moisture.status === "wet"
        ? "#2a7fff"
        : moisture.status === "optimal"
          ? "#34c759"
          : moisture.status === "dry"
            ? "#ff9f0a"
            : "#ff453a",
  };

  const drySpeed = {
    rate: dryRateByPeriod.full,

    unit: "raw/day",

    trend: dryRateByPeriod.full > 0 ? "↓" : "→",

    emoji: dryRateByPeriod.full > 300 ? "☀️" : "💧",
  };

  const evapCoef = {
    coefficient:
      tempRange.delta > 0
        ? (Math.abs(dryRateByPeriod.full) / tempRange.delta).toFixed(0)
        : 0,

    unit: "raw/°",

    emoji: "🌡️",
  };

  return (
    <div className="block plant-block">
      <h2>🌱 Plant</h2>

      <div className="moisture-bar-full">
        <div className="bar-label">
          {moistureStatus.emoji} {moistureStatus.label}
        </div>

        <div className="bar-container">
          <div
            className="bar-fill"
            style={{
              width: `${100 - moistureStatus.percent}%`,
            }}
          />
        </div>

        <div className="bar-value">
          {moistureStatus.percent}% • {latest.soil_raw}
        </div>
      </div>

      <div className="metrics-row">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-emoji">{drySpeed.emoji}</span>

            <span className="metric-title">Drying speed</span>
          </div>

          <div className="metric-main">
            {drySpeed.trend} {dryRateByPeriod.full > 0 ? "+" : "−"} {Math.abs(drySpeed.rate)} {drySpeed.unit}
          </div>

          <div className="metric-detail" style={{ fontSize: "0.7rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px", marginTop: "6px" }}>
            <div style={{ 
              padding: "4px 6px", 
              borderRadius: "4px", 
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: dryRateByPeriod["3h"] > 0 ? "#34c759" : "#ff453a",
            }}>
              3h: {dryRateByPeriod["3h"] > 0 ? "+" : "−"}{Math.abs(dryRateByPeriod["3h"])}
            </div>
            <div style={{ 
              padding: "4px 6px", 
              borderRadius: "4px", 
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: dryRateByPeriod["6h"] > 0 ? "#34c759" : "#ff453a",
            }}>
              6h: {dryRateByPeriod["6h"] > 0 ? "+" : "−"}{Math.abs(dryRateByPeriod["6h"])}
            </div>
            <div style={{ 
              padding: "4px 6px", 
              borderRadius: "4px", 
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: dryRateByPeriod["12h"] > 0 ? "#34c759" : "#ff453a",
            }}>
              12h: {dryRateByPeriod["12h"] > 0 ? "+" : "−"}{Math.abs(dryRateByPeriod["12h"])}
            </div>
            <div style={{ 
              padding: "4px 6px", 
              borderRadius: "4px", 
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: dryRateByPeriod["24h"] > 0 ? "#34c759" : "#ff453a",
            }}>
              24h: {dryRateByPeriod["24h"] > 0 ? "+" : "−"}{Math.abs(dryRateByPeriod["24h"])}
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-emoji">💧</span>

            <span className="metric-title">Water left</span>
          </div>

          <div className="metric-main">~ {waterForecast ?? "—"} days</div>

          <div className="metric-detail">Forecast</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-emoji">🌡️</span>

            <span className="metric-title">Temp range</span>
          </div>

          <div className="metric-main">
            {tempRange.min}° – {tempRange.max}°
          </div>

          <div className="metric-detail">
            Δ {tempRange.delta}
            °C
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-emoji">{evapCoef.emoji}</span>

            <span className="metric-title">Evaporation</span>
          </div>

          <div className="metric-main">
            {evapCoef.coefficient} {evapCoef.unit}
          </div>

          <div className="metric-detail">Drying per °C</div>
        </div>
      </div>
    </div>
  );
}
