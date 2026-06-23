import type { HeadToHeadStat } from "../../data/types";
import styles from "./StatsGrid.module.css";

interface StatsGridProps {
  leftName: string;
  rightName: string;
  stats: HeadToHeadStat[];
}

export function StatsGrid({ leftName, rightName, stats }: StatsGridProps) {
  return (
    <div className={styles.grid}>
      {stats.map((stat) => (
        <div key={stat.label} className={styles.cell}>
          <div className={styles.head}>
            <span className={styles.label}>{stat.label}</span>
            {stat.hint ? (
              <span
                className={styles.info}
                title={stat.hint}
                aria-label={stat.hint}
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                >
                  <circle
                    cx="8"
                    cy="8"
                    r="6.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                  <circle cx="8" cy="5" r="0.9" fill="currentColor" />
                  <rect
                    x="7.3"
                    y="7"
                    width="1.4"
                    height="4.4"
                    rx="0.7"
                    fill="currentColor"
                  />
                </svg>
              </span>
            ) : null}
          </div>
          <div className={styles.values}>
            <div className={styles.valueRow}>
              <span className={`${styles.dot} ${styles.dotLeft}`} />
              <span className={styles.model}>{leftName}</span>
              <span className={styles.value}>{stat.left}</span>
            </div>
            <div className={styles.valueRow}>
              <span className={`${styles.dot} ${styles.dotRight}`} />
              <span className={styles.model}>{rightName}</span>
              <span className={styles.value}>{stat.right}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
