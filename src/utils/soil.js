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

  const delta = newest.soil_raw - oldest.soil_raw;

  const hours =
    (new Date(newest.created_at) - new Date(oldest.created_at)) / 3600000;

  return Number(((delta / hours) * 24).toFixed(0));
}

export function getWaterLeftForecast(latest, history) {
  const speed = getMoistureDryingSpeed(history);

  if (speed <= 0) {
    return null;
  }

  return Number(((SOIL.dry - latest.soil_raw) / speed).toFixed(1));
}
