import { BATTERY } from "./constants";

export function batteryDrop(latest) {
  if (!latest) {
    return 0;
  }

  return Number((latest.battery_idle - latest.battery_load).toFixed(3));
}

export function batteryStatus(latest) {
  if (latest.battery_idle < BATTERY.critical) {
    return "critical";
  }

  if (latest.battery_idle < BATTERY.low) {
    return "low";
  }

  return "good";
}

export function batteryHealth(latest) {
  const s = batteryStatus(latest);

  return {
    good: "🟢 Good",

    low: "🟡 Low",

    critical: "🔴 Critical",
  }[s];
}

export function batteryTrendPerDay(history) {
  if (!history || history.length < 2) {
    return null;
  }

  const oldest = history[history.length - 1];

  const newest = history[0];

  const delta = oldest.battery_idle - newest.battery_idle;

  const hours =
    (new Date(newest.created_at) - new Date(oldest.created_at)) / 3600000;

  return Number(((delta / hours) * 24).toFixed(3));
}

export function estimatedBatteryDays(latest, history) {
  const drain = batteryTrendPerDay(history);

  if (!drain || drain <= 0) {
    return null;
  }

  return Number(((latest.battery_idle - BATTERY.cutoff) / drain).toFixed(1));
}

export function getBatteryStress(latest) {
  const drop = batteryDrop(latest);

  if (drop > BATTERY.criticalDrop) {
    return "🔴 Weak";
  }

  if (drop > BATTERY.warningDrop) {
    return "🟡 Normal";
  }

  return "🟢 Excellent";
}

export function batteryPercent(voltage) {
  const FULL = BATTERY.full;

  const LOW = BATTERY.low;

  const EMPTY = BATTERY.cutoff;

  if (voltage <= EMPTY) {
    return 0;
  }

  if (voltage >= FULL) {
    return 100;
  }

  // 3.4–3.7V
  // нижня зона швидше падає
  if (voltage < LOW) {
    const ratio = (voltage - EMPTY) / (LOW - EMPTY);

    return Math.round(ratio * 40);
  }

  // 3.7–4.2V
  // верхня зона повільніше
  const ratio = (voltage - LOW) / (FULL - LOW);

  return Math.round(40 + ratio * 60);
}
