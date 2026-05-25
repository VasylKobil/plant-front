const SOIL_DRY = 47000;
const SOIL_WET = 500;
const SOIL_NORMAL_MIN = 25000;

export function getMoistureStatus(raw) {
  if (raw >= SOIL_DRY) {
    return { status: 'dry', label: 'Dry', emoji: '🟢', color: '#d4d158' };
  } else if (raw >= SOIL_NORMAL_MIN) {
    return { status: 'normal', label: 'Normal', emoji: '🟡', color: '#3fb950' };
  } else {
    return { status: 'wet', label: 'Wet', emoji: '🔵', color: '#58a6ff' };
  }
}

export function soilPercent(raw) {
  // For visual progress bar (0-100%)
  const p = ((SOIL_DRY - raw) / (SOIL_DRY - SOIL_WET)) * 100;
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
  // Calculate next wake time based on sleep_minutes
  const now = new Date();
  const nextWake = new Date(now.getTime() + latest.sleep_minutes * 60000);
  
  return nextWake.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}
