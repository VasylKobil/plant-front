import { TEMP } from "./constants";
import { getMoistureStatus } from "./soil";

import { batteryStatus } from "./battery";

export function getTemperatureRange(history) {
  if (!history || history.length === 0) {
    return {
      min: 0,
      max: 0,
      delta: 0,
    };
  }

  const temps = history.map((x) => x.temperature);

  const min = Math.min(...temps);

  const max = Math.max(...temps);

  return {
    min: Number(min.toFixed(1)),

    max: Number(max.toFixed(1)),

    delta: Number((max - min).toFixed(1)),
  };
}

export function getPlantHealth(latest) {
  if (!latest) {
    return {
      score: 0,

      health: "Unknown",
    };
  }

  let score = 100;

  const issues = [];

  if (latest.temperature < TEMP.min) {
    score -= 20;

    issues.push("Cold");
  }

  if (latest.temperature > TEMP.max) {
    score -= 20;

    issues.push("Hot");
  }

  const moisture = getMoistureStatus(latest.soil_raw);

  if (moisture.status === "critical-dry") {
    score -= 40;

    issues.push("Dry");
  }

  if (moisture.status === "wet") {
    score -= 20;

    issues.push("Wet");
  }

  const battery = batteryStatus(latest);

  if (battery === "low") {
    score -= 10;
  }

  if (battery === "critical") {
    score -= 25;
  }

  return {
    score: Math.max(0, score),

    health:
      score > 85
        ? "Excellent"
        : score > 70
          ? "Good"
          : score > 50
            ? "Warning"
            : "Critical",

    issues,
  };
}

export function getDayNightTemps(history) {
  if (!history) {
    return null;
  }

  const day = [];

  const night = [];

  history.forEach((x) => {
    const h = new Date(x.created_at).getHours();

    if (h >= 6 && h < 18) {
      day.push(x.temperature);
    } else {
      night.push(x.temperature);
    }
  });

  const avg = (arr) =>
    arr.length ? arr.reduce((a, b) => a + b) / arr.length : 0;

  const dayAvg = avg(day);

  const nightAvg = avg(night);

  return {
    day: Number(dayAvg.toFixed(1)),

    night: Number(nightAvg.toFixed(1)),

    delta: Number(Math.abs(dayAvg - nightAvg).toFixed(1)),
  };
}

export function getEnvironmentScore(latest, history) {
  const plant = getPlantHealth(latest);

  const temp = getTemperatureRange(history);

  const tempScore = Math.max(
    0,

    100 - Math.abs(temp.delta - 8) * 5
  );

  const total = Math.round(plant.score * 0.7 + tempScore * 0.3);

  return {
    score: total,

    emoji: total > 80 ? "🟢" : total > 60 ? "🟡" : "🔴",
  };
}
