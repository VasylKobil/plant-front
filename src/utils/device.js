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

  const first = new Date(history[history.length - 1].created_at);

  const last = new Date(history[0].created_at);

  const elapsedMinutes = (last - first) / 60000;

  const expected = Math.max(
    1,

    Math.round(elapsedMinutes / latest.sleep_minutes) + 1
  );

  const received = history.length;

  const missing = Math.max(
    0,

    expected - received
  );

  const percent = Math.round((received / expected) * 100);

  return {
    expected,

    received,

    missing,

    percent,
  };
}
