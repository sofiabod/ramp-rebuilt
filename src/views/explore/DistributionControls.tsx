import { models } from "../../data/models";
import { metricDefs } from "./metrics";
import type { MetricKey } from "./metrics";
import styles from "./DistributionControls.module.css";

interface DistributionControlsProps {
  metric: MetricKey;
  onMetricChange: (m: MetricKey) => void;
  selectedIds: string[];
  onToggle: (id: string) => void;
  bins: number;
  onBinsChange: (b: number) => void;
}

function Chevron() {
  return (
    <svg
      className={styles.chevron}
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="8 9 12 5 16 9" />
      <polyline points="8 15 12 19 16 15" />
    </svg>
  );
}

export function DistributionControls({
  metric,
  onMetricChange,
  selectedIds,
  onToggle,
  bins,
  onBinsChange,
}: DistributionControlsProps) {
  const available = models.filter((m) => !selectedIds.includes(m.id));
  const min = 5;
  const max = 20;
  const pct = ((bins - min) / (max - min)) * 100;

  return (
    <div className={styles.controls}>
      <div className={styles.topRow}>
        <label className={styles.combo}>
          <span className={styles.fieldLabel}>Metric</span>
          <select
            className={styles.select}
            value={metric}
            onChange={(e) => onMetricChange(e.target.value as MetricKey)}
          >
            {metricDefs.map((d) => (
              <option key={d.key} value={d.key}>
                {d.label}
              </option>
            ))}
          </select>
          <Chevron />
        </label>

        <div className={styles.binsField}>
          <span className={styles.fieldLabel}>Bins</span>
          <div className={styles.binsSlider}>
            <span className={styles.binsValue} style={{ left: `${pct}%` }}>
              {bins}
            </span>
            <input
              className={styles.slider}
              type="range"
              min={min}
              max={max}
              step={1}
              value={bins}
              style={{
                background: `linear-gradient(to right, var(--color-text-muted) ${pct}%, var(--color-border) ${pct}%)`,
              }}
              onChange={(e) => onBinsChange(Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      <div className={styles.combo}>
        <span className={styles.fieldLabel}>Models</span>
        <div className={styles.chipRow}>
          {selectedIds.map((id) => {
            const m = models.find((x) => x.id === id);
            if (!m) return null;
            return (
              <span key={id} className={styles.chip}>
                {m.name}
                <button
                  type="button"
                  className={styles.remove}
                  aria-label={`Remove ${m.name}`}
                  onClick={() => onToggle(id)}
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
        <select
          className={styles.add}
          value=""
          aria-label="Add model"
          onChange={(e) => {
            if (e.target.value) onToggle(e.target.value);
          }}
          disabled={available.length === 0}
        >
          <option value="">Add model</option>
          {available.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
        <Chevron />
      </div>
    </div>
  );
}
