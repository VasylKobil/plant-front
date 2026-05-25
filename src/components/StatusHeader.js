import { estimatedBatteryDays, getPlantHealth, getNextWakeTime } from '../utils/calculations';

export default function StatusHeader({ latest }) {
  const { health, issues } = getPlantHealth(latest);
  const batteryDays = estimatedBatteryDays(latest);
  const nextWake = getNextWakeTime(latest);
  
  const healthEmoji = health === 'Healthy' ? '🟢' : '🟡';
  const healthColor = health === 'Healthy' ? '#3fb950' : '#ffa657';

  return (
    <div className="status-header">
      <div className="plant-info">
        <div className="plant-name">
          🌱 Balcony Plant
        </div>
        <div className="health-status" style={{ color: healthColor }}>
          {healthEmoji} {health}
        </div>
        {issues.length > 0 && (
          <div className="issues-list">
            {issues.map((issue, idx) => (
              <span key={idx} className="issue-tag">{issue}</span>
            ))}
          </div>
        )}
      </div>

      <div className="quick-stats">
        <div className="quick-stat">
          <span className="stat-label">Battery</span>
          <span className="stat-value">{(latest.battery_idle / 4.2 * 100).toFixed(0)}%</span>
          <span className="stat-detail">~{batteryDays}d left</span>
        </div>
        
        <div className="quick-stat">
          <span className="stat-label">Next wake</span>
          <span className="stat-value">{nextWake}</span>
        </div>
      </div>
    </div>
  );
}
