import { useState, useEffect } from "react";

import {
  connectionTimeSeconds,
  getNextWakeTime,
  getSleepEfficiency,
  getWakeSuccessRate,
} from "../utils/device";

export default function DeviceBlock({ latest, history }) {
  function buildCountdown(device) {
    if (!device) {
      return {
        hours: "00",

        minutes: "00",

        seconds: "00",

        emoji: "⏰",

        nextWakeTime: "--:--",

        status: "Waiting",
      };
    }

    const next = new Date(device.created_at);

    next.setMinutes(next.getMinutes() + device.sleep_minutes);

    const diff = Math.max(0, next.getTime() - Date.now());

    const total = Math.floor(diff / 1000);

    return {
      hours: String(Math.floor(total / 3600)).padStart(2, "0"),

      minutes: String(Math.floor((total % 3600) / 60)).padStart(2, "0"),

      seconds: String(total % 60).padStart(2, "0"),

      emoji: total > 300 ? "😴" : "⏰",

      nextWakeTime: getNextWakeTime(device),

      status: total > 0 ? "Sleeping" : "Wake soon",
    };
  }

  const [countdown, setCountdown] = useState(() => buildCountdown(latest));

  useEffect(() => {
    setCountdown(buildCountdown(latest));

    const id = setInterval(
      () => {
        setCountdown(buildCountdown(latest));
      },

      1000
    );

    return () => clearInterval(id);
  }, [latest]);

  if (!latest || !history?.length) {
    return null;
  }

  const wakeSuccess = getWakeSuccessRate(latest, history);

  const sleepEfficiency = getSleepEfficiency(latest);

  const uploadReliability = {
    successful: Number.isFinite(wakeSuccess.percent) ? wakeSuccess.percent : 0,

    emoji:
      wakeSuccess.percent >= 95
        ? "🟢"
        : wakeSuccess.percent >= 80
          ? "🟡"
          : "🔴",

    note: `${wakeSuccess.received}/${wakeSuccess.expected}`,
  };

  return (
    <div className="block device-block">
      <h2>📡 Device</h2>

      <div className="metrics-row">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-emoji">{uploadReliability.emoji}</span>

            <span className="metric-title">Wake success</span>
          </div>

          <div className="metric-main">{wakeSuccess.percent}%</div>

          <div className="metric-detail">
            Expected: {wakeSuccess.expected}
            {" • "}
            Received: {wakeSuccess.received}
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-emoji">{sleepEfficiency.emoji}</span>

            <span className="metric-title">Awake ratio</span>
          </div>

          <div className="metric-main">{sleepEfficiency.ratio}%</div>

          <div className="metric-detail">{sleepEfficiency.awake}s awake</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-emoji">{countdown.emoji}</span>

            <span className="metric-title">Next wake</span>
          </div>

          <div className="metric-main timer">
            {countdown.hours}:{countdown.minutes}:{countdown.seconds}
          </div>

          <div className="metric-detail">at {countdown.nextWakeTime}</div>

          <div className="metric-detail-small">{countdown.status}</div>
        </div>
      </div>

      <div className="device-info">
        <div className="info-row">
          <span className="info-label">Sleep interval:</span>

          <span className="info-value">{latest.sleep_minutes} min</span>
        </div>

        <div className="info-row">
          <span className="info-label">WiFi time:</span>

          <span className="info-value">{connectionTimeSeconds(latest)}s</span>
        </div>

        <div className="info-row">
          <span className="info-label">Cycle time:</span>

          <span className="info-value">
            {(latest.cycle_ms / 1000).toFixed(1)}s
          </span>
        </div>
      </div>
    </div>
  );
}
