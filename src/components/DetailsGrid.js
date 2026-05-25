import { batteryDrop, batteryTrendPerDay } from '../utils/calculations';

export default function DetailsGrid({ latest }) {
  return (
    <div className="details-grid">
      <div className="detail">
        <span className="detail-label">Battery Idle</span>
        <span className="detail-value">{latest.battery_idle.toFixed(2)}V</span>
      </div>

      <div className="detail">
        <span className="detail-label">Battery Load</span>
        <span className="detail-value">{latest.battery_load.toFixed(2)}V</span>
      </div>

      <div className="detail">
        <span className="detail-label">Cycle Drop</span>
        <span className="detail-value">{batteryDrop(latest)}V</span>
      </div>

      <div className="detail">
        <span className="detail-label">Trend</span>
        <span className="detail-value">{batteryTrendPerDay(latest)}V/day</span>
      </div>

      <div className="detail">
        <span className="detail-label">Cycle Time</span>
        <span className="detail-value">{latest.cycle_ms}ms</span>
      </div>

      <div className="detail">
        <span className="detail-label">Sleep Interval</span>
        <span className="detail-value">{latest.sleep_minutes}min</span>
      </div>
    </div>
  );
}
