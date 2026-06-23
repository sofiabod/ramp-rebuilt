import { Section } from "./Section";
import prose from "./Prose.module.css";

export function PrivacySection() {
  return (
    <Section id="privacy" heading="Privacy & contamination">
      <p className={prose.paragraph}>
        Because tasks derive from private Ramp production code, we cannot
        release prompts, patches, tests, or repository states. Our public
        dashboard reports aggregate metrics, pairwise comparisons, and redacted
        examples. Ramp SWE-Bench data is never used for training, enforced
        through agreements with model providers.
      </p>
    </Section>
  );
}
