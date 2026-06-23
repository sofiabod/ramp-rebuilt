import { Section } from "./Section";
import { AccentLink } from "./AccentLink";
import prose from "./Prose.module.css";

export function HarnessSection() {
  return (
    <Section id="harness" heading="Harness">
      <p className={prose.paragraph}>
        All models run against the same curated tasks using the{" "}
        <AccentLink>mini-swe-agent</AccentLink> harness. Agents have bash access
        in a sandboxed local development environment, and every model gets the
        exact same environment for a task. While leaner than the scaffolds
        engineers use in practice, it lets us isolate model behavior from
        harness heuristics. Each result is a single pass@1 attempt, mirroring
        the bar engineers hold background agents to: a correct, review-ready
        change on the first try.
      </p>
    </Section>
  );
}
