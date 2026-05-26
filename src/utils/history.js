export function getPeakMoments(history) {
  if (!history || history.length === 0) {
    return null;
  }

  const hottest = history.reduce((a, b) =>
    a.temperature > b.temperature ? a : b
  );

  const coldest = history.reduce((a, b) =>
    a.temperature < b.temperature ? a : b
  );

  const wettest = history.reduce((a, b) => (a.soil_raw < b.soil_raw ? a : b));

  const driest = history.reduce((a, b) => (a.soil_raw > b.soil_raw ? a : b));

  const lowestBattery = history.reduce((a, b) =>
    a.battery_idle < b.battery_idle ? a : b
  );

  return {
    hottest: {
      value: hottest.temperature,

      time: hottest.created_at,
    },

    coldest: {
      value: coldest.temperature,

      time: coldest.created_at,
    },

    wettest: {
      value: wettest.soil_raw,

      time: wettest.created_at,
    },

    driest: {
      value: driest.soil_raw,

      time: driest.created_at,
    },

    battery: {
      value: lowestBattery.battery_idle,

      time: lowestBattery.created_at,
    },
  };
}
