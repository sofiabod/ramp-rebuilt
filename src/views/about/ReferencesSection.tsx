import { Section } from "./Section";
import { AccentLink } from "./AccentLink";
import styles from "./ReferencesSection.module.css";

const references = [
  {
    title: "SWE-bench: Can Language Models Resolve Real-world GitHub Issues?",
    citation:
      "Jimenez, C. E., Yang, J., Wettig, A., Yao, S., Pei, K., Press, O., & Narasimhan, K. R. (2024). SWE-bench: Can Language Models Resolve Real-world GitHub Issues? In The Twelfth International Conference on Learning Representations.",
  },
  {
    title:
      "BenchGuard: Who Guards the Benchmarks? Automated Auditing of LLM Agent Benchmarks",
    citation:
      "Tu, X., Wang, T., Lu, Y. (Minta), Huang, K., Qu, Y., & Mostafavi, S. (2026). BenchGuard: Who Guards the Benchmarks? Automated Auditing of LLM Agent Benchmarks. arXiv preprint arXiv:2604.24955.",
  },
  {
    title: "mini-swe-agent",
    citation:
      "SWE-agent. (2026). mini-swe-agent: The minimal AI software engineering agent. GitHub repository.",
  },
];

export function ReferencesSection() {
  return (
    <Section id="references" heading="References">
      <ol className={styles.list}>
        {references.map((reference) => (
          <li key={reference.title} className={styles.item}>
            <div>
              <span className={styles.title}>
                <AccentLink arrow={false}>{reference.title}</AccentLink>
              </span>
              <span className={styles.citation}>{reference.citation}</span>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
