export interface Insight {
  label: string;
  value: string;
}

interface InsightsListProps {
  items: Insight[];
}

export default function InsightsList({ items }: InsightsListProps) {
  return (
    <div className="insights-list">
      {items.map((item) => (
        <div className="insight-item" key={item.label}>
          <span>{item.label}</span>
          <strong>{item.value}</strong>
        </div>
      ))}
    </div>
  );
}
