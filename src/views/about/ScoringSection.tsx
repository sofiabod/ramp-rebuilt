import { Fragment } from "react";
import { Section } from "./Section";
import prose from "./Prose.module.css";
import styles from "./ScoringSection.module.css";

const stages = [
  {
    label: "Task given",
    icon: "M5 2h7l3 3v13H5V2ZM12 2v3h3M7 9h6M7 12h6M7 15h4",
  },
  { label: "Agent runs", icon: "M4 6l4 4-4 4M10 14h6" },
  {
    label: "Submit patch",
    icon: "M2 10h5M13 10h5M10 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z",
  },
  {
    label: "Run tests",
    icon: "M7 10l2 2 4-4M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Z",
  },
  { label: "Pass / Fail", icon: "M5 18V3M5 4h9l-2 3 2 3H5" },
];

export function ScoringSection() {
  return (
    <Section id="scoring" heading="Scoring">
      <div className={styles.stepper}>
        {stages.map((stage, index) => (
          <Fragment key={stage.label}>
            {index > 0 && (
              <span className={styles.connector} aria-hidden="true" />
            )}
            <div className={styles.stage}>
              <span className={styles.icon} aria-hidden="true">
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={stage.icon} />
                </svg>
              </span>
              <span className={styles.label}>{stage.label}</span>
            </div>
          </Fragment>
        ))}
      </div>

      <p className={prose.paragraph}>
        A run is graded as a success if the agent's diff flips the task's
        failing tests to passing without breaking the others. Runs that reach a
        context window limit are counted as failures.
      </p>
      <p className={prose.paragraph}>
        A potentially valid patch can still fail tests if they are unfair or
        overly specified, for example referencing a specific function name.
        Despite our curation pipeline greatly minimizing this failure mode, it
        is inherent to the SWE-Bench evaluation mechanism. In some tasks, tests
        are intentionally rigid, as the correct solution is to closely follow
        existing repository patterns and conventions.
      </p>
    </Section>
  );
}
