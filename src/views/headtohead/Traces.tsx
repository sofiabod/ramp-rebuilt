import type { TraceExample } from "../../data/types";
import styles from "./Traces.module.css";

interface TracesProps {
  traces: TraceExample[];
}

export function Traces({ traces }: TracesProps) {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Trace examples</h2>
      <div className={styles.grid}>
        {traces.map((trace) => (
          <article key={trace.id} className={styles.card}>
            <header className={styles.cardHead}>
              <TraceIcon icon={trace.icon} />
              <h3 className={styles.title}>{trace.title}</h3>
            </header>
            <p className={styles.summary}>{trace.summary}</p>
            <div className={styles.results}>
              <ResultRow result={trace.left} />
              <ResultRow result={trace.right} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ResultRow({ result }: { result: TraceExample["left"] }) {
  return (
    <div className={styles.resultRow}>
      <span className={styles.resultModel}>{result.model}</span>
      {result.passed ? (
        <span className={`${styles.mark} ${styles.pass}`} aria-label="passed">
          {"✓"}
        </span>
      ) : (
        <span className={`${styles.mark} ${styles.fail}`} aria-label="failed">
          {"✗"}
        </span>
      )}
      {result.turns !== undefined && (
        <span className={styles.metric}>{result.turns} turns</span>
      )}
      {result.duration !== undefined && (
        <span className={styles.metric}>{result.duration} duration</span>
      )}
      <span className={styles.metric}>${result.cost.toFixed(2)} cost</span>
    </div>
  );
}

function TraceIcon({ icon }: { icon: TraceExample["icon"] }) {
  const paths: Record<TraceExample["icon"], string> = {
    import: "M7 3h7l4 4v9H7zM14 3v4h4M9 13l2 2 4-4",
    vendor: "M4 8h16M4 8l2-4h12l2 4M4 8v11h16V8M9 12h6",
    tooling: "M12 4v16M4 12h16M6 6l12 12M18 6L6 18",
    billpay: "M7 3h7l4 4v13H7zM14 3v4h4M12 10v6M10 12h3a1.5 1.5 0 010 3h-3",
  };
  return (
    <svg
      className={styles.icon}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[icon]} />
    </svg>
  );
}
