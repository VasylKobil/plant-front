export function formatTime(date) {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getSunTimes() {
  const today = new Date();
  const month = today.getMonth();

  let sunrise, sunset;

  if (month >= 4 && month <= 7) {
    // May-August
    sunrise = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      5,
      30
    );
    sunset = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      21,
      0
    );
  } else if (month >= 2 && month <= 4) {
    // March-May
    sunrise = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      6,
      0
    );
    sunset = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      20,
      0
    );
  } else if (month >= 8 && month <= 10) {
    // September-November
    sunrise = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      6,
      30
    );
    sunset = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      18,
      30
    );
  } else {
    // December-February
    sunrise = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      7,
      30
    );
    sunset = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      17,
      0
    );
  }

  return { sunrise, sunset };
}
