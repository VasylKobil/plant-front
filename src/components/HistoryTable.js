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
                {moistureStatus.emoji} {moistureStatus.label}
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
