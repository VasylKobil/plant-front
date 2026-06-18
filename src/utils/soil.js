import { SOIL } from "./constants";

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function normalize(raw) {
  return Math.round(
    clamp(
      ((raw - SOIL.wet) / (SOIL.dry - SOIL.wet)) * 100,

      0,
      100
    )
  );
}

export function soilPercent(raw) {
  return Math.max(
    0,
    Math.min(100, Math.round(((SOIL.dry - raw) / (SOIL.dry - SOIL.wet)) * 100))
  );
}

export function getMoistureStatus(raw) {
  if (raw == null || Number.isNaN(raw)) {
    return {
      status: "unknown",
      label: "No data",
      emoji: "⚪",
      percent: null,
    };
  }

  const percent = normalize(raw);

  if (raw >= SOIL.dry) {
    return {
      status: "critical-dry",
      label: "Very Dry",
      emoji: "🔴",
      percent,
    };
  }

  if (raw >= SOIL.optimalHigh) {
    return {
      status: "dry",
      label: "Dry",
      emoji: "🟠",
      percent,
    };
  }

  if (raw >= SOIL.optimalLow) {
    return {
      status: "optimal",
      label: "Optimal",
      emoji: "🟢",
      percent,
    };
  }

  return {
    status: "wet",
    label: "Wet",
    emoji: "🔵",
    percent,
  };
}

export function getMoistureDryingSpeed(history) {
  if (!history || history.length < 2) {
    return 0;
  }

  const oldest = history[history.length - 1];

  const newest = history[0];

  const delta = oldest.soil_raw - newest.soil_raw;

  const hours =
    (new Date(newest.created_at) - new Date(oldest.created_at)) / 3600000;

  return Number(((delta / hours) * 24).toFixed(0));
}

export function getMoistureDryingSpeedByPeriod(history) {
  if (!history || history.length < 2) {
    return {
      "3h": 0,
      "6h": 0,
      "12h": 0,
      "24h": 0,
      full: 0,
    };
  }

  const newest = new Date(history[0].created_at);
  const periods = {
    "3h": 3,
    "6h": 6,
    "12h": 12,
    "24h": 24,
  };

  const results = {};

  for (const [label, hours] of Object.entries(periods)) {
    const targetTime = new Date(newest.getTime() - hours * 3600000);
    
    // Find record closest to targetTime (going back)
    let bestIdx = history.length - 1;
    let bestDiff = Infinity;
    
    for (let i = 0; i < history.length; i++) {
      const itemTime = new Date(history[i].created_at);
      const diff = Math.abs(itemTime - targetTime);
      
      if (itemTime <= targetTime && diff < bestDiff) {
        bestDiff = diff;
        bestIdx = i;
      }
    }

    if (bestIdx !== 0) {
      const delta = history[0].soil_raw - history[bestIdx].soil_raw;
      results[label] = delta;
    } else {
      results[label] = 0;
    }
  }

  results.full = getMoistureDryingSpeed(history);

  return results;
}

export function getWaterLeftForecast(latest, history) {
  const drying = getMoistureDryingSpeed(history);

  if (!drying || drying <= 0) {
    return null;
  }

  const remaining = SOIL.warning - latest.soil_raw;

  const days = remaining / drying;

  return Math.max(0, Number(days.toFixed(1)));
}
