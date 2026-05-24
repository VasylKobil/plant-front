const SOIL_DRY = 47000;
const SOIL_WET = 35000;

export function soilPercent(raw) {
  const p = ((SOIL_DRY - raw) / (SOIL_DRY - SOIL_WET)) * 100;
  return Math.max(0, Math.min(100, Math.round(p)));
}

export function batteryDrop(latest) {
  if (!latest) return 0;
  return (latest.battery_idle - latest.battery_load).toFixed(2);
}

export function batteryStatus(latest) {
  if (latest.battery_idle < 3.4) {
    return "Critical";
  }
  if (latest.battery_idle < 3.7) {
    return "Low";
  }
  return "Good";
}

export function activePercent(latest) {
  if (!latest) return 0;
  return (
    (latest.cycle_ms / (latest.sleep_minutes * 60000)) * 100
  ).toFixed(2);
}
