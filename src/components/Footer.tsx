import { benchMeta } from "../data/models";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.line}>
        Ramp SWE-Bench {benchMeta.version} · Last updated: {benchMeta.updated}
      </p>
    </footer>
  );
}
