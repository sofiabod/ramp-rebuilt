import type { ReactNode } from "react";
import styles from "./Prose.module.css";

type AccentLinkProps = {
  children: ReactNode;
  arrow?: boolean;
};

export function AccentLink({ children, arrow = true }: AccentLinkProps) {
  return (
    <a href="#" className={styles.link}>
      {children}
      {arrow ? (
        <span className={styles.linkArrow} aria-hidden="true">
          &#8599;
        </span>
      ) : null}
    </a>
  );
}
