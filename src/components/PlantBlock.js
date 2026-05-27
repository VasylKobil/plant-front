import { getMoistureDryingSpeed } from "../utils/soil";

import { getTemperatureRange } from "../utils/environment";

export default function PlantBlock({ metrics, latest, history }) {
  if (!metrics || !latest) {
    return null;
  }

  const { moisture, waterForecast } = metrics;

  const dryRate = getMoistureDryingSpeed(history);

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
    rate: dryRate,

    unit: "raw/day",

    trend: dryRate > 0 ? "↓" : "→",

    emoji: dryRate > 300 ? "☀️" : "💧",

    soilDelta: Math.abs(dryRate),

    hours: 24,
  };

  const evapCoef = {
    coefficient:
      tempRange.delta > 0
        ? (Math.abs(dryRate) / tempRange.delta).toFixed(0)
        : 0,

    unit: "raw/°",

    emoji: "🌡️",
  };

  return (
    <div className="block plant-block">
      <h2>🌱 Рослина</h2>

      <div className="moisture-bar-full">
        <div className="bar-label">
          {moistureStatus.emoji} {moistureStatus.label}
        </div>

        <div className="bar-container">
          <div
            className="bar-fill"
            style={{
              width: `${moistureStatus.percent}%`,

              backgroundColor: moistureStatus.color,
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
            {drySpeed.trend} {Math.abs(drySpeed.rate)} {drySpeed.unit}
          </div>

          <div className="metric-detail">
            {drySpeed.soilDelta} raw за {drySpeed.hours}h
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
