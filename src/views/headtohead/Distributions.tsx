import type { DistributionSeries } from "../../data/types";
import { LineChart } from "./LineChart";
import styles from "./Distributions.module.css";

interface DistributionsProps {
  leftName: string;
  rightName: string;
  distributions: DistributionSeries[];
}

export function Distributions({
  leftName,
  rightName,
  distributions,
}: DistributionsProps) {
  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <h2 className={styles.heading}>Distributions</h2>
        <LinkIcon />
      </header>
      <ul className={styles.legend}>
        <li className={styles.legendItem}>
          <span className={`${styles.dot} ${styles.dotLeft}`} />
          {leftName}
        </li>
        <li className={styles.legendItem}>
          <span className={`${styles.dot} ${styles.dotRight}`} />
          {rightName}
        </li>
      </ul>
      <div className={styles.grid}>
        {distributions.map((series) => (
          <article key={series.metric} className={styles.cardChart}>
            <h3 className={styles.metric}>{series.metric}</h3>
            <LineChart
              left={series.left}
              right={series.right}
              axis={series.axis}
            />
          </article>
        ))}
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
