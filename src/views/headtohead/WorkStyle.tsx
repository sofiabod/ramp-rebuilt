import type { WorkStyle as WorkStyleData } from "../../data/types";
import styles from "./WorkStyle.module.css";

interface WorkStyleProps {
  leftName: string;
  rightName: string;
  left: WorkStyleData;
  right: WorkStyleData;
}

const segments: { key: keyof WorkStyleData; label: string; color: string }[] = [
  { key: "explore", label: "Explore", color: "var(--plot-explore)" },
  { key: "read", label: "Read", color: "var(--plot-read)" },
  { key: "write", label: "Write", color: "var(--plot-write)" },
  { key: "test", label: "Test", color: "var(--plot-test)" },
];

export function WorkStyle({
  leftName,
  rightName,
  left,
  right,
}: WorkStyleProps) {
  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <h2 className={styles.heading}>Work style</h2>
        <LinkIcon />
      </header>
      <ul className={styles.legend}>
        {segments.map((segment) => (
          <li key={segment.key} className={styles.legendItem}>
            <span
              className={styles.swatch}
              style={{ background: segment.color }}
            />
            {segment.label}
          </li>
        ))}
      </ul>
      <div className={styles.rows}>
        <WorkStyleBar name={leftName} style={left} />
        <WorkStyleBar name={rightName} style={right} />
      </div>
    </section>
  );
}

function LinkIcon() {
  return (
    <svg
      className={styles.linkIcon}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10 13a5 5 0 007.07 0l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 00-7.07 0l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
    </svg>
  );
}

function WorkStyleBar({ name, style }: { name: string; style: WorkStyleData }) {
  const total = segments.reduce((sum, segment) => sum + style[segment.key], 0);
  return (
    <div className={styles.barRow}>
      <span className={styles.barLabel}>{name}</span>
      <div className={styles.bar}>
        {segments.map((segment) => {
          const value = style[segment.key];
          const pct = total > 0 ? (value / total) * 100 : 0;
          if (pct <= 0) {
            return null;
          }
          return (
            <span
              key={segment.key}
              className={styles.barSegment}
              style={{ width: `${pct}%`, background: segment.color }}
              title={`${segment.label} ${Math.round(pct)}%`}
            />
          );
        })}
      </div>
    </div>
  );
}
