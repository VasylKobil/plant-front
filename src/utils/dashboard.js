import { getPlantHealth, getEnvironmentScore } from "./environment";

import {
  batteryHealth,
  estimatedBatteryDays,
  getBatteryStress,
} from "./battery";

import { getWaterLeftForecast, getMoistureStatus } from "./soil";

import { getSleepEfficiency, connectionTimeSeconds } from "./device";

import { getPeakMoments } from "./history";

export function getDashboardMetrics(latest, history) {
  if (!latest) {
    return null;
  }

  return {
    plant: getPlantHealth(latest),

    battery: batteryHealth(latest),

    batteryDays: estimatedBatteryDays(latest, history),

    batteryStress: getBatteryStress(latest),

    moisture: getMoistureStatus(latest.soil_raw),

    waterForecast: getWaterLeftForecast(latest, history),

    environment: getEnvironmentScore(latest, history),

    sleep: getSleepEfficiency(latest),

    wifi: connectionTimeSeconds(latest),

    peaks: getPeakMoments(history),
  };
}
