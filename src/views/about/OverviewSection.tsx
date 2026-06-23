import { Section } from "./Section";
import { AccentLink } from "./AccentLink";
import prose from "./Prose.module.css";

const questions = [
  "How do they navigate massive codebases?",
  "Do they produce correct code?",
  "When do they decide to ship a change?",
  "How long do they run?",
  "What do they cost?",
  "Where do they break?",
];

const domains = [
  "Card authorization",
  "Bill pay",
  "Reimbursements",
  "Accounting",
  "Procurement",
  "Treasury",
  "Fraud",
  "Agents",
];

export function OverviewSection() {
  return (
    <Section id="overview">
      <p className={prose.paragraph}>
        Ramp SWE-Bench is a private, production-grounded coding benchmark
        created from engineering work in Ramp's backend. Public benchmarks
        saturate quickly and can leak into training data, with none quite
        resembling the work our engineers do every day. Building our own has
        given us and the model providers we work with a contamination-free read
        on how different models handle engineering at Ramp.
      </p>
      <p className={prose.paragraph}>
        Modeled after <AccentLink>SWE-Bench</AccentLink>, we use this benchmark
        as a behavioral instrument for studying how coding agents handle the
        work Ramp engineers already delegate to them, answering questions like:
      </p>
      <ul className={prose.bulletList}>
        {questions.map((question) => (
          <li key={question} className={prose.bulletItem}>
            {question}
          </li>
        ))}
      </ul>
      <p className={prose.paragraph}>
        Tasks derive from changes that <AccentLink>Inspect</AccentLink>, our
        in-house background coding agent, shipped to production after engineer
        review. The benchmark's one-shot nature effectively models the
        background agent lifecycle where an engineer provides a prompt, the
        agent works asynchronously, and the expected output is a review-ready
        pull request.
      </p>
      <p className={prose.paragraph}>
        Work spans Ramp product and platform domains including:
      </p>
      <div className={prose.pillRow}>
        {domains.map((domain) => (
          <span key={domain} className={prose.pill}>
            {domain}
          </span>
        ))}
      </div>
    </Section>
  );
}
