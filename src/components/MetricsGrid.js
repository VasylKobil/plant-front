import {
  getMoistureStatus,
  soilPercent,
  batteryHealth,
  estimatedBatteryDays,
  batteryTrendPerDay,
  activeTimePerHour,
  connectionTimeSeconds,
} from "../utils/calculations";

export default function MetricsGrid({ latest }) {
  const moistureStatus = getMoistureStatus(latest.soil_raw);
  const batteryDays = estimatedBatteryDays(latest);
  const awakeTime = activeTimePerHour(latest);
  const connTime = connectionTimeSeconds(latest);

  return (
    <div className="grid">
      <div className="metric-card">
        <div className="metric-icon">🌡️</div>
        <div className="metric-label">Temperature</div>
        <div className="metric-value">{latest.temperature}°C</div>
      </div>

      <div className="metric-card">
        <div className="metric-icon">💧</div>
        <div className="metric-label">Soil Moisture</div>
        <div className="metric-status">
          {moistureStatus.emoji} {moistureStatus.label}
        </div>
        <div className="metric-bar">
          <div
            className="bar-fill moisture"
            style={{
              width: `${soilPercent(latest.soil_raw)}%`,
              backgroundColor: moistureStatus.color,
            }}
          ></div>
        </div>
        <div className="metric-detail">{latest.soil_raw}</div>
      </div>

      <div className="metric-card">
        <div className="metric-icon">🔋</div>
        <div className="metric-label">Battery Health</div>
        <div className="metric-status">{batteryHealth(latest)}</div>
        <div className="metric-detail">
          {latest.battery_idle.toFixed(2)}V (
          {((latest.battery_idle / 4.2) * 100).toFixed(0)}%)
        </div>
        <div className="metric-detail-small">~{batteryDays}d remaining</div>
      </div>

      <div className="metric-card">
        <div className="metric-icon">⏰</div>
        <div className="metric-label">Active Time</div>
        <div className="metric-status">{awakeTime.seconds}s / hour</div>
        <div className="metric-detail-small">{awakeTime.percent}%</div>
      </div>

      <div className="metric-card">
        <div className="metric-icon">📡</div>
        <div className="metric-label">Connection Time</div>
        <div className="metric-value">{connTime}s</div>
        <div className="metric-detail">Wake → Upload</div>
      </div>

      <div className="metric-card">
        <div className="metric-icon">📉</div>
        <div className="metric-label">Discharge Rate</div>
        <div className="metric-detail">{batteryTrendPerDay(latest)} V/day</div>
        <div className="metric-detail-small">
          Drop per cycle:{" "}
          {(latest.battery_idle - latest.battery_load).toFixed(3)}V
        </div>
      </div>
    </div>
  );
}
