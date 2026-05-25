const SOIL = {
  wet: 500,
  optimalLow: 12000,
  optimalHigh: 28000,
  dry: 47000,
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function normalize(raw) {
  return clamp(
    ((raw - SOIL.wet) / (SOIL.dry - SOIL.wet)) * 100,
    0,
    100
  );
}

export function getMoistureStatus(raw) {
  if (
    raw == null ||
    Number.isNaN(raw) ||
    !Number.isFinite(raw)
  ) {
    return {
      status: 'unknown',
      label: 'No data',
      emoji: '⚪',
      color: '#8b949e',
      percent: null,
    };
  }

  const percent = normalize(raw);

  let result;

  if (raw >= SOIL.dry) {
    result = {
      status: 'critical-dry',
      label: 'Very Dry',
      emoji: '🔴',
      color: '#f85149',
    };
  } else if (raw >= SOIL.optimalHigh) {
    result = {
      status: 'dry',
      label: 'Dry',
      emoji: '🟠',
      color: '#d29922',
    };
  } else if (raw >= SOIL.optimalLow) {
    result = {
      status: 'optimal',
      label: 'Optimal',
      emoji: '🟢',
      color: '#3fb950',
    };
  } else if (raw >= SOIL.wet) {
    result = {
      status: 'wet',
      label: 'Wet',
      emoji: '🔵',
      color: '#58a6ff',
    };
  } else {
    result = {
      status: 'saturated',
      label: 'Too Wet',
      emoji: '🟣',
      color: '#a371f7',
    };
  }

  return {
    raw,
    percent: Math.round(percent),
    ...result,
  };
}

export function soilPercent(raw) {
  // For visual progress bar (0-100%)
  const p = ((SOIL.dry - raw) / (SOIL.dry - SOIL.wet)) * 100;
  return Math.max(0, Math.min(100, Math.round(p)));
}

export function batteryDrop(latest) {
  if (!latest) return 0;
  return (latest.battery_idle - latest.battery_load).toFixed(3);
}

export function batteryStatus(latest) {
  if (latest.battery_idle < 3.4) {
    return "critical";
  }
  if (latest.battery_idle < 3.7) {
    return "low";
  }
  return "good";
}

export function batteryHealth(latest) {
  const status = batteryStatus(latest);
  const statusMap = {
    good: '🟢 Good',
    low: '🟡 Low',
    critical: '🔴 Critical'
  };
  return statusMap[status] || 'Unknown';
}

export function estimatedBatteryDays(latest) {
  // Formula: (Voltage - MinVoltage) / DailyDrain
  // Assuming 0.03V/day typical drain
  const minVoltage = 3.0;
  const dailyDrain = 0.03;
  
  const remaining = latest.battery_idle - minVoltage;
  const days = (remaining / dailyDrain).toFixed(1);
  
  return Math.max(0, days);
}

export function batteryTrendPerDay(latest) {
  // Simplified: assume drop is from sleep cycle
  // This is an estimate based on cycle
  return (0.03).toFixed(3); // V/day
}

export function activeTimePerHour(latest) {
  if (!latest) return { seconds: 0, percent: '0%' };
  
  // cycle_ms is total cycle time, sleep_minutes is sleep time
  // Awake time = cycle_ms - (sleep_minutes * 60000)
  const awakeMs = latest.cycle_ms - (latest.sleep_minutes * 60000);
  const awakeSeconds = Math.round(awakeMs / 1000);
  const percent = ((awakeMs / (latest.sleep_minutes * 60000)) * 100).toFixed(2);
  
  return {
    seconds: awakeSeconds,
    percent
  };
}

export function connectionTimeSeconds(latest) {
  // wifi_ms is the WiFi connection time
  return (latest.wifi_ms / 1000).toFixed(1);
}

export function getPlantHealth(latest) {
  // Overall health based on multiple factors
  const battery = batteryStatus(latest);
  const moisture = getMoistureStatus(latest.soil_raw).status;
  const temp = latest.temperature;
  
  let health = 'Healthy';
  let issues = [];
  
  if (battery === 'critical') {
    health = 'Critical';
    issues.push('Battery critical');
  } else if (battery === 'low') {
    health = 'Warning';
    issues.push('Low battery');
  }
  
  if (moisture === 'wet') {
    issues.push('Too wet');
  }
  
  if (temp < 15 || temp > 28) {
    issues.push('Temp out of range');
  }
  
  if (issues.length > 0 && health === 'Healthy') {
    health = 'Warning';
  }
  
  return { health, issues };
}

export function getNextWakeTime(latest) {
  const date = new Date(latest.created_at);
  date.setHours(date.getHours() + latest.sleep_minutes / 60);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
