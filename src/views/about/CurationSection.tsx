import { Section } from "./Section";
import { AccentLink } from "./AccentLink";
import prose from "./Prose.module.css";
import styles from "./CurationSection.module.css";

const steps = [
  {
    title: "Mine",
    description: "Gather merged Inspect PRs from internal repositories",
    icon: "M6 3v12M6 9a3 3 0 0 0 3 3h2a3 3 0 0 1 3 3M14 3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z",
  },
  {
    title: "Filter",
    description: "Screen out candidates without both implementation and tests",
    icon: "M3 4h14l-5.5 6.5V16l-3 1.5V10.5L3 4Z",
  },
  {
    title: "Validate",
    description:
      "Ensure the gold patch flips tests from fail to pass in a sandbox",
    icon: "M7 10l2 2 4-4M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Z",
  },
  {
    title: "Synthesize",
    description: "Distill the engineer's Inspect turns into a concise prompt",
    icon: "M3 17l1-4 9-9 3 3-9 9-4 1ZM12 4l3 3",
  },
  {
    title: "Audit",
    description:
      "LLM judges cross-examine the artifacts for fairness, ambiguity, and benchmark validity",
    icon: "M2 10s3-5 8-5 8 5 8 5-3 5-8 5-8-5-8-5Zm8 2.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  },
  {
    title: "Solve",
    description:
      "Run small, medium, and frontier models against the task, examine traces for signals",
    icon: "M4 6l4 4-4 4M10 14h6",
  },
  {
    title: "Human review",
    description:
      "Review audit and solver results, make targeted prompt or test remediations, and approve or reject the task",
    icon: "M10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM4 17a6 6 0 0 1 12 0",
  },
];

type MatrixCell = {
  code: string;
  description: string;
  axis: string;
};

const matrix: Record<"Test" | "Prompt", Record<string, MatrixCell>> = {
  Test: {
    over: {
      code: "test_overconstrained",
      description: "Tests assert details like a helper name or exact string",
      axis: "Test, over-specified",
    },
    under: {
      code: "test_missing_assertion",
      description: "Tests don't cover enough of the task's requirements",
      axis: "Test, under-specified",
    },
  },
  Prompt: {
    over: {
      code: "prompt_solution_leakage",
      description: "Leaks implementation details, handing the agent the answer",
      axis: "Prompt, over-specified",
    },
    under: {
      code: "prompt_missing_context",
      description:
        "Doesn't include critical information for completing the task",
      axis: "Prompt, under-specified",
    },
  },
};

function Cell({ cell }: { cell: MatrixCell }) {
  return (
    <td>
      <span className={styles.cellAxis} aria-hidden="true">
        {cell.axis}
      </span>
      <code className={styles.cellCode}>{cell.code}</code>
      <span className={styles.cellDesc}>{cell.description}</span>
    </td>
  );
}

export function CurationSection() {
  return (
    <Section id="curation" heading="Curation">
      <p className={prose.paragraph}>
        Task curation is automated except for final human approval, which acts
        as the primary bottleneck and quality-control step. LLMs excel at
        surfacing issues, ambiguity, and fairness risks, but human engineering
        judgement is best for ensuring benchmark quality. The pipeline extracts
        as many signals as possible before review, so reviewers can make fast,
        informed decisions.
      </p>

      <ol className={styles.steps}>
        {steps.map((step) => (
          <li key={step.title} className={styles.step}>
            <span className={styles.stepIcon} aria-hidden="true">
              <svg
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={step.icon} />
              </svg>
            </span>
            <div className={styles.stepBody}>
              <div className={styles.stepTitle}>{step.title}</div>
              <div className={styles.stepDesc}>{step.description}</div>
            </div>
          </li>
        ))}
      </ol>

      <p className={prose.paragraph}>
        Our task-auditing framework is inspired by{" "}
        <AccentLink>BenchGuard</AccentLink> view of execution-based benchmarks
        as coupled artifacts (prompt, gold patch, tests, and environment) that
        must be checked jointly for fairness and validity. LLM judges
        cross-examine each task and sort every defect two ways: whether it lives
        in the prompt or the tests, and whether it says too much
        (over-specified) or too little (under-specified). The judges run on
        different model providers to prevent same-provider bias.
      </p>

      <table className={styles.matrix}>
        <thead>
          <tr>
            <th className={styles.corner} aria-hidden="true"></th>
            <th className={styles.colHead} scope="col">
              Over-specified
            </th>
            <th className={styles.colHead} scope="col">
              Under-specified
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th className={styles.rowHead} scope="row">
              Test
            </th>
            <Cell cell={matrix.Test.over} />
            <Cell cell={matrix.Test.under} />
          </tr>
          <tr>
            <th className={styles.rowHead} scope="row">
              Prompt
            </th>
            <Cell cell={matrix.Prompt.over} />
            <Cell cell={matrix.Prompt.under} />
          </tr>
        </tbody>
      </table>

      <p className={prose.paragraph}>
        Static review only catches so much. After a clean audit, tasks are run
        against a ladder of models, from small to frontier, reading where each
        lands on the success curve. When no model solves the task, it could mean
        a brittle test or broken environment over real difficulty. When every
        model solves it, the task is discarded for carrying no signal. Tasks
        worth keeping sit in between, where capability separates models and the
        failing traces show that the miss is clean.
      </p>
    </Section>
  );
}
