import {
  batteryDrop,
  batteryTrendPerDay,
  estimatedBatteryDays,
  getBatteryStress,
  batteryPercent,
  getEnergyScore,
} from "../utils/battery";
import { BATTERY } from "../utils/constants";

export default function BatteryBlock({ latest, history }) {
  if (!latest) {
    return null;
  }

  const discharge = batteryTrendPerDay(history);

  const runtime = estimatedBatteryDays(latest, history);

  const stress = getBatteryStress(latest);

  const drop = batteryDrop(latest);

  const energyScore = getEnergyScore(latest);

  const batteryPercentValue = batteryPercent(latest.battery_idle);

  const dischargeData = {
    emoji: discharge > 0.08 ? "🔴" : discharge > 0.04 ? "🟡" : "🟢",

    rate: Math.round(discharge * 1000) ?? 0,

    unit: "mV/day",
  };

  const runtimeData = {
    emoji: runtime > 20 ? "🟢" : runtime > 7 ? "🟡" : "🔴",

    days: runtime ?? "—",

    voltage: latest.battery_idle,
  };

  const stressData = {
    emoji: stress.includes("Excellent")
      ? "🟢"
      : stress.includes("Normal")
        ? "🟡"
        : "🔴",

    drop: Math.round(drop * 1000),

    unit: "mV/day",

    status: stress,
  };

  return (
    <div className="block battery-block">
      <h2>🔋 Battery</h2>

      <div className="battery-bar-full">
        <div className="bar-label">
          Battery: {latest.battery_idle.toFixed(2)}V
        </div>

        <div className="bar-container">
          <div
            className="bar-fill battery"
            style={{
              width: `${batteryPercentValue}%`,
            }}
          />
        </div>

        <div className="bar-value">
          {batteryPercentValue}% •{" "}
          {(latest.battery_idle - BATTERY.cutoff).toFixed(2)}V usable
        </div>
      </div>

      <div className="metrics-row">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-emoji">{dischargeData.emoji}</span>

            <span className="metric-title">Discharge</span>
          </div>

          <div className="metric-main">
            {dischargeData.rate} {dischargeData.unit}
          </div>

          <div className="metric-detail">Battery loss per day</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-emoji">{runtimeData.emoji}</span>

            <span className="metric-title">Runtime</span>
          </div>

          <div className="metric-main">{runtimeData.days} days</div>

          <div className="metric-detail">~{runtimeData.voltage}V</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-emoji">{stressData.emoji}</span>

            <span className="metric-title">Stress</span>
          </div>

          <div className="metric-main">
            Load drop {stressData.drop} {stressData.unit}
          </div>

          <div className="metric-detail">{stressData.status}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-emoji">⚡</span>

            <span className="metric-title">Efficiency</span>
          </div>

          <div className="metric-main">{energyScore.efficiency}%</div>

          <div className="metric-detail">{energyScore.status}</div>
        </div>
      </div>
    </div>
  );
}
