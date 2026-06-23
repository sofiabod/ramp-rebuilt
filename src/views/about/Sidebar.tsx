import { sections } from "./sections";
import styles from "./Sidebar.module.css";

type SidebarProps = {
  activeId: string;
};

export function Sidebar({ activeId }: SidebarProps) {
  return (
    <nav className={styles.sidebar} aria-label="About sections">
      <ul className={styles.list}>
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className={styles.link}
              aria-current={activeId === section.id ? "true" : undefined}
              data-active={activeId === section.id ? "true" : undefined}
            >
              {section.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
