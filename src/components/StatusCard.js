import { formatDate } from '../utils/dateTime';
import MetricsGrid from './MetricsGrid';
import DetailsGrid from './DetailsGrid';

export default function StatusCard({ latest, onRefresh }) {
  return (
    <div className="status-card">
      <h2>Balcony</h2>

      <p className="update-time">
        Last updated: {formatDate(latest.created_at)}
      </p>

      <MetricsGrid latest={latest} />

      <hr />

      <DetailsGrid latest={latest} />

      <button onClick={onRefresh}>
        Refresh
      </button>
    </div>
  );
}
