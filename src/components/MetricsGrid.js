import { soilPercent, batteryStatus } from '../utils/calculations';

export default function MetricsGrid({ latest }) {
  return (
    <div className="grid">
      <div className="metric-card">
        <div className="metric-icon">🌡️</div>
        <div className="metric-label">Temperature</div>
        <div className="metric-value">
          {latest.temperature}°C
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-icon">💧</div>
        <div className="metric-label">Soil Moisture</div>
        <div className="metric-value">
          {soilPercent(latest.soil_raw)}%
        </div>
        <div className="metric-bar">
          <div 
            className="bar-fill moisture"
            style={{
              width: `${soilPercent(latest.soil_raw)}%`
            }}
          ></div>
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-icon">🔋</div>
        <div className="metric-label">Battery</div>
        <div className="metric-value">
          {latest.battery_idle.toFixed(2)}V
        </div>
        <div className={`status-badge ${batteryStatus(latest).toLowerCase()}`}>
          {batteryStatus(latest)}
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-icon">📡</div>
        <div className="metric-label">WiFi Signal</div>
        <div className="metric-value">
          {latest.wifi_ms}ms
        </div>
      </div>
    </div>
  );
}
