import { useState, useEffect } from "react";
import { estimatedBatteryDays, getPlantHealth } from "../utils/calculations";

export default function StatusHeader({ latest }) {
  const { health, issues } = getPlantHealth(latest);
  const batteryDays = estimatedBatteryDays(latest);
  const [countdown, setCountdown] = useState("00:00:00");

  useEffect(() => {
    const updateCountdown = () => {
      // Calculate next wake time
      const nextWakeDate = new Date(latest.created_at);
      nextWakeDate.setHours(
        nextWakeDate.getHours() + latest.sleep_minutes / 60
      );

      // Calculate time difference
      const now = new Date();
      const diff = nextWakeDate - now;

      if (diff <= 0) {
        setCountdown("00:00:00");
        return;
      }

      // Convert to hours, minutes, seconds
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown(
        `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
      );
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [latest]);

  const healthEmoji = health === "Healthy" ? "🟢" : "🟡";
  const healthColor = health === "Healthy" ? "#3fb950" : "#ffa657";

  return (
    <div className="status-header">
      <div className="plant-info">
        <div className="plant-name">🌱 Balcony Plant</div>
        <div className="health-status" style={{ color: healthColor }}>
          {healthEmoji} {health}
        </div>
        {issues.length > 0 && (
          <div className="issues-list">
            {issues.map((issue, idx) => (
              <span key={idx} className="issue-tag">
                {issue}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="quick-stats">
        <div className="quick-stat">
          <span className="stat-label">Battery</span>
          <span className="stat-value">
            {((latest.battery_idle / 4.2) * 100).toFixed(0)}%
          </span>
          <span className="stat-detail">~{batteryDays}d left</span>
        </div>

        <div className="quick-stat">
          <span className="stat-label">Next wake in</span>
          <span className="stat-value">{countdown}</span>
        </div>
      </div>
    </div>
  );
}
