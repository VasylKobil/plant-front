import { formatDate } from "../utils/dateTime";
import StatusHeader from "./StatusHeader";
import MetricsGrid from "./MetricsGrid";
import DetailsGrid from "./DetailsGrid";

export default function StatusCard({ latest, onRefresh }) {
  return (
    <div className="status-card">
      <StatusHeader latest={latest} />

      <p className="update-time">
        Last updated: {formatDate(latest.created_at)}
      </p>

      <MetricsGrid latest={latest} />

      <hr />

      <DetailsGrid latest={latest} />

      <button onClick={onRefresh}>🔄 Refresh Now</button>
    </div>
  );
}
