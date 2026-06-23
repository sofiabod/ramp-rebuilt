import { Section } from "./Section";
import prose from "./Prose.module.css";
import styles from "./TasksSection.module.css";

const receives = [
  "Synthesized task prompt",
  "Repository at the base commit",
  "Bash access and standard development tools",
];

const withheld = [
  "Original engineer-to-Inspect conversation",
  "Merged solution patch",
  "Merged test patch",
];

const tabs = [
  "Overview",
  "Source material",
  "Prompt",
  "Review",
  "Patches",
  "Traces",
];

type KeyValue = {
  key: string;
  value: string;
  mono?: boolean;
  link?: boolean;
  pill?: "grey" | "amber";
};

const details: KeyValue[] = [
  { key: "PR", value: "#123456", link: true },
  {
    key: "PR title",
    value: "[INC-67] Fix invoice intake validation edge case",
  },
  { key: "Inspect session", value: "Open session", link: true },
  { key: "Inspect model", value: "Claude Opus 4.7" },
  { key: "Author", value: "Shaiyon Hariri" },
  { key: "Base commit", value: "49ba6e2bd4c0", mono: true },
  { key: "Created", value: "Apr 17, 2026, 5:20 PM EDT" },
  { key: "Diff size", value: "+101 / -19", mono: true },
  { key: "Human review", value: "Pending", pill: "grey" },
  { key: "Audit ensemble triage", value: "Review", pill: "amber" },
];

type PipelineStep = {
  label: string;
  note: string;
  state: "done" | "active";
  pill?: string;
};

const pipeline: PipelineStep[] = [
  {
    label: "Mine",
    note: "101+ / 19- across 2 impl + 1 test files",
    state: "done",
  },
  { label: "Filter", note: "Passed basic filters", state: "done" },
  { label: "Validate", note: "Patch + tests apply cleanly", state: "done" },
  { label: "Prompt synthesis", note: "Score 4.67/5", state: "done" },
  {
    label: "Audit ensemble triage",
    note: "1 prompt_solution_leakage",
    state: "active",
    pill: "pending",
  },
];

export function TasksSection() {
  return (
    <Section id="tasks" heading="Tasks">
      <p className={prose.paragraph}>
        Every one of the 80 tasks in the final set derives from a pull request
        that includes business logic and tests, carries an engineer-to-Inspect
        conversation, and was merged into production after code review. Each has
        an explicit anchor in the engineer's original intent: prompts are
        synthesized from what the engineer actually asked the agent to do, not
        from issue or PR descriptions alone.
      </p>
      <p className={prose.paragraph}>
        To assemble a task, we reconstruct the repository at the PR's base
        commit, hold out the merged solution patch and associated test patch as
        gold artifacts, and synthesize a task prompt from the engineer's
        messages in the original Inspect conversation.
      </p>

      <div className={styles.compare}>
        <div className={styles.compareColumn}>
          <div className={styles.compareTitle}>Agents receive</div>
          <div className={styles.compareRows}>
            {receives.map((item) => (
              <div key={item} className={styles.compareRow}>
                <span className={styles.markPos} aria-hidden="true">
                  &#10003;
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.compareColumn}>
          <div className={styles.compareTitle}>Agents don't receive</div>
          <div className={styles.compareRows}>
            {withheld.map((item) => (
              <div key={item} className={styles.compareRow}>
                <span className={styles.markNeg} aria-hidden="true">
                  &#10007;
                </span>
                <span className={styles.rowTextMuted}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardHeaderMain}>
            <div className={styles.cardTitleRow}>
              <span className={styles.cardTitle}>ramp__repo-123456</span>
              <span className={styles.star} aria-hidden="true">
                &#9733;
              </span>
            </div>
            <div className={styles.cardSubtitle}>
              PR #123456 &middot; ramp/repo
            </div>
          </div>
          <span className={styles.cardClose} aria-hidden="true">
            &times;
          </span>
        </div>
        <div className={styles.tabs}>
          {tabs.map((tab) => (
            <span
              key={tab}
              className={tab === "Overview" ? styles.tabActive : styles.tab}
            >
              {tab}
            </span>
          ))}
        </div>
        <div className={styles.kvList}>
          {details.map((detail) => (
            <div key={detail.key} className={styles.kvRow}>
              <span className={styles.kvKey}>{detail.key}</span>
              <span
                className={
                  detail.mono
                    ? `${styles.kvValue} ${styles.kvMono}`
                    : styles.kvValue
                }
              >
                {detail.link ? (
                  <a href="#" className={styles.kvLink}>
                    {detail.value}
                    <span className={styles.linkArrow} aria-hidden="true">
                      &#8599;
                    </span>
                  </a>
                ) : detail.pill === "grey" ? (
                  <span className={styles.pillGrey}>{detail.value}</span>
                ) : detail.pill === "amber" ? (
                  <span className={styles.pillAmber}>{detail.value}</span>
                ) : (
                  detail.value
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.pipeline}>
        <div className={styles.pipelineHeading}>Pipeline</div>
        <div className={styles.pipelineRows}>
          {pipeline.map((step) => (
            <div key={step.label} className={styles.pipelineRow}>
              {step.state === "done" ? (
                <span className={styles.pipelineCheck} aria-hidden="true">
                  &#10003;
                </span>
              ) : (
                <span className={styles.pipelineDot} aria-hidden="true" />
              )}
              <span className={styles.pipelineLabel}>{step.label}</span>
              {step.pill ? (
                <span className={styles.pillAmber}>{step.pill}</span>
              ) : null}
              <span className={styles.pipelineNote}>{step.note}</span>
            </div>
          ))}
        </div>
      </div>
      <p className={styles.caption}>
        Anonymized internal task review view. Reviewers inspect source material,
        the generated prompt, patches, audit signals, and solver traces before
        accepting a task.
      </p>
    </Section>
  );
}
