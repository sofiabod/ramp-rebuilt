import type { ReactNode } from "react";
import styles from "./Section.module.css";

type SectionProps = {
  id: string;
  heading?: string;
  children: ReactNode;
};

export function Section({ id, heading, children }: SectionProps) {
  return (
    <section id={id} className={styles.section}>
      {heading ? <h2 className={styles.heading}>{heading}</h2> : null}
      {children}
    </section>
  );
}
