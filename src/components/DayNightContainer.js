import "./DayNightContainer.css";

import { getSunTimes } from "../utils/dateTime";

export default function DayNightContainer({ history }) {
  if (!history?.length) {
    return null;
  }

  getSunTimes();

  const data = [...history].reverse();

  const tempMin = Math.min(...data.map((x) => x.temperature));

  const tempMax = Math.max(...data.map((x) => x.temperature));

  const soilMin = Math.min(...data.map((x) => x.soil_raw));

  const soilMax = Math.max(...data.map((x) => x.soil_raw));

  function normalize(value, min, max) {
    return (value - min) / (max - min || 1);
  }

  function getPhase(hour) {
    if (hour >= 5 && hour < 8) {
      return "sunrise";
    }

    if (hour >= 8 && hour < 18) {
      return "day";
    }

    if (hour >= 18 && hour < 21) {
      return "sunset";
    }

    return "night";
  }

  return (
    <div className="day-night-container">
      <h2>🛰️ Last 24 Hours</h2>

      <div className="timeline">
        {data.map((item, index) => {
          const date = new Date(item.created_at);

          const phase = getPhase(date.getHours());

          return (
            <div key={index} className={`timeline-slot ${phase}`}>
              <div className="timeline-temp">{item.temperature}°C</div>

              <div
                className="temp-line"
                style={{
                  height: `${
                    10 + normalize(item.temperature, tempMin, tempMax) * 120
                  }px`,
                }}
              />

              <div
                className="soil-line"
                style={{
                  height: `${
                    10 + normalize(item.soil_raw, soilMin, soilMax) * 80
                  }px`,
                }}
              />

              <div className="timeline-hour">
                {date.toLocaleTimeString(
                  [],

                  {
                    hour: "2-digit",
                  }
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
