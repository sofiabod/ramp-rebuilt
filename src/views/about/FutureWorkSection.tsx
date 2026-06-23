import { Section } from "./Section";
import prose from "./Prose.module.css";

export function FutureWorkSection() {
  return (
    <Section id="future-work" heading="Future work">
      <p className={prose.paragraph}>
        Ramp SWE-Bench v1 is an early look at a living internal eval. We plan to
        grow the task set, evaluate richer failure taxonomies, add repeated-run
        reliability measures, compute judge-based scoring of output quality,
        build further automation around trace analysis and pairwise model
        comparisons, and experiment with other harnesses.
      </p>
    </Section>
  );
}
