import { isDayTime, getSunTimes, formatTime } from '../utils/dateTime';

export default function DayNightContainer() {
  const isDay = isDayTime();
  const { sunrise, sunset } = getSunTimes();

  return (
    <div className={`day-night-container ${isDay ? 'day' : 'night'}`}>
      <div className="day-night-content">
        <div className="day-night-status">
          <div className="sun-icon">
            {isDay ? '☀️ День' : '🌙 Ніч'}
          </div>
          <div className="day-night-text">
            {isDay ? 'Сонячна погода' : 'Темний період'}
          </div>
        </div>

        <div className="sun-times">
          <div className="sun-info">
            <span className="sun-label">🌅 Схід:</span>
            <span className="sun-value">{formatTime(sunrise)}</span>
          </div>
          <div className="sun-info">
            <span className="sun-label">🌇 Захід:</span>
            <span className="sun-value">{formatTime(sunset)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
