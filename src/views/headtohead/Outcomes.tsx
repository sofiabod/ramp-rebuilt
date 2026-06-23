import styles from "./Outcomes.module.css";

interface OutcomesProps {
  leftName: string;
  rightName: string;
  outcomes: {
    both: number;
    leftOnly: number;
    rightOnly: number;
    neither: number;
  };
  sharedMisses: string[];
}

export function Outcomes({
  leftName,
  rightName,
  outcomes,
  sharedMisses,
}: OutcomesProps) {
  const segments = [
    {
      key: "both",
      label: "Both",
      value: outcomes.both,
      color: "#7cbd98",
    },
    {
      key: "leftOnly",
      label: `${leftName} only`,
      value: outcomes.leftOnly,
      color: "#a0b4e4",
    },
    {
      key: "rightOnly",
      label: `${rightName} only`,
      value: outcomes.rightOnly,
      color: "#e7ac96",
    },
    {
      key: "neither",
      label: "Neither",
      value: outcomes.neither,
      color: "#dcdcd4",
    },
  ];
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Task outcomes</h2>
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
      <div className={styles.bar}>
        {segments.map((segment) => {
          const pct = total > 0 ? (segment.value / total) * 100 : 0;
          if (pct <= 0) {
            return null;
          }
          return (
            <span
              key={segment.key}
              className={styles.segment}
              style={{ width: `${pct}%`, background: segment.color }}
              title={`${segment.label} ${segment.value}`}
            >
              <span className={styles.segmentValue}>{segment.value}</span>
            </span>
          );
        })}
      </div>
      <div className={styles.misses}>
        <h3 className={styles.missesHeading}>
          {sharedMisses.length} shared misses
        </h3>
        <div className={styles.chips}>
          {sharedMisses.map((miss) => (
            <span key={miss} className={styles.chip}>
              <svg
                className={styles.chipIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M7 3h7l4 4v13H7zM14 3v4h4" />
              </svg>
              {miss}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
