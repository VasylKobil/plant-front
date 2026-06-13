import { getMoistureStatus } from "../utils/soil";
import { batteryPercent } from "../utils/battery";
import { BATTERY } from "../utils/constants";

export default function HistoryTable({ history }) {
  return (
    <div className="history">
      <h2>📊 Last {history.length} Readings</h2>

      <div className="history-table">
        <div className="history-header">
          <span>Time</span>
          <span>🌡️ Temp</span>
          <span>💧 Moisture</span>
          <span>🔋 Battery</span>
        </div>

        {history.map((item) => {
          const moistureStatus = getMoistureStatus(item.soil_raw);
          const batteryPercentValue = batteryPercent(item.battery_idle);
          const batteryColor =
            item.battery_idle < BATTERY.low
              ? "low"
              : item.battery_idle < BATTERY.critical
                ? "critical"
                : "good";

          return (
            <div key={item.id} className="history-row">
              <span className="time">
                {new Date(item.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>

              <span className="temp">{item.temperature}°C</span>

              <span className="moisture">
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                  {moistureStatus.emoji}
                  <div style={{ 
                  fontSize: "0.7rem", 
                  display: "inline-block",
                  padding: "3px 8px",
                  borderRadius: "14px",
                  background: "rgba(52, 199, 89, 0.1)",
                  border: "1px solid rgba(52, 199, 89, 0.4)",
                  color: "#34c759",
                  fontWeight: "500",
                  letterSpacing: "0.5px",
                }}>
                  {item.soil_raw}
                </div>
                </div>
                
              </span>

              <span className={`battery ${batteryColor}`}>
                {item.battery_idle.toFixed(2)}V ({batteryPercentValue}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
