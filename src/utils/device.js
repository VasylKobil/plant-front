export function activeTimePerHour(latest) {
  if (!latest) {
    return {
      seconds: 0,

      percent: 0,
    };
  }

  const awake = latest.cycle_ms;

  const sleep = latest.sleep_minutes * 60000;

  return {
    seconds: Math.round(awake / 1000),

    percent: Number(((awake / sleep) * 100).toFixed(2)),
  };
}

export function connectionTimeSeconds(latest) {
  return Number((latest.wifi_ms / 1000).toFixed(1));
}

export function getSleepEfficiency(latest) {
  const active = activeTimePerHour(latest);

  return {
    ratio: active.percent,

    awake: active.seconds,

    emoji: active.percent < 1 ? "🟢" : active.percent < 2 ? "🟡" : "🔴",
  };
}

export function getNextWakeTime(latest) {
  const d = new Date(latest.created_at);

  d.setMinutes(d.getMinutes() + latest.sleep_minutes);

  return d.toLocaleTimeString(
    [],

    {
      hour: "2-digit",

      minute: "2-digit",
    }
  );
}

export function getWakeSuccessRate(latest, history) {
  if (!latest || !history?.length) {
    return {
      expected: 0,
      received: 0,
      missing: 0,
      percent: 0,
    };
  }

  // Calculate expected readings based on actual sleep intervals from history
  let expectedCount = 1; // Start with the most recent reading

  for (let i = 0; i < history.length - 1; i++) {
    const current = new Date(history[i].created_at);
    const next = new Date(history[i + 1].created_at);
    const elapsedMinutes = (current - next) / 60000;

    // Use the sleep interval from the next (older) reading
    const sleepMinutes = history[i + 1].sleep_minutes;

    // Calculate expected readings in this gap
    const expectedInGap = Math.max(
      1,
      Math.round(elapsedMinutes / sleepMinutes)
    );

    expectedCount += expectedInGap;
  }

  const received = history.length;

  const missing = Math.max(
    0,

    expectedCount - received
  );

  const percent = Math.round((received / expectedCount) * 100);

  return {
    expected: expectedCount,

    received,

    missing,

    percent,
  };
}
