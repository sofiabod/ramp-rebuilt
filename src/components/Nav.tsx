import type { Route } from "../lib/useHashRoute";
import styles from "./Nav.module.css";

const tabs: { id: Route; label: string }[] = [
  { id: "about", label: "About" },
  { id: "head-to-head", label: "Head to head" },
  { id: "explore", label: "Explore" },
];

interface NavProps {
  route: Route;
  onNavigate: (next: Route) => void;
}

export function Nav({ route, onNavigate }: NavProps) {
  return (
    <div className={styles.bar}>
      <nav className={styles.pill} aria-label="Primary">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={tab.id === route ? styles.active : styles.tab}
            aria-current={tab.id === route ? "page" : undefined}
            onClick={() => onNavigate(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
