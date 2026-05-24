import { soilPercent } from '../utils/calculations';

export default function HistoryTable({ history }) {
  return (
    <div className="history">
      <h2>📊 Last 10 Readings</h2>

      <div className="history-table">
        <div className="history-header">
          <span>Time</span>
          <span>Temperature</span>
          <span>Moisture</span>
          <span>Battery</span>
        </div>

        {
          history
            .slice(0, 10)
            .map((item) => (
              <div
                key={item.id}
                className="history-row"
              >
                <span className="time">
                  {new Date(item.created_at).toLocaleTimeString()}
                </span>

                <span className="temp">
                  {item.temperature}°C
                </span>

                <span className="moisture">
                  {soilPercent(item.soil_raw)}%
                </span>

                <span className={`battery ${item.battery_idle < 3.7 ? 'low' : 'good'}`}>
                  {item.battery_idle.toFixed(2)}V
                </span>
              </div>
            ))
        }
      </div>
    </div>
  );
}
