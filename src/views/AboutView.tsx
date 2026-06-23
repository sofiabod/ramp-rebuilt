import { Sidebar } from "./about/Sidebar";
import { OverviewSection } from "./about/OverviewSection";
import { TasksSection } from "./about/TasksSection";
import { CurationSection } from "./about/CurationSection";
import { HarnessSection } from "./about/HarnessSection";
import { ScoringSection } from "./about/ScoringSection";
import { PrivacySection } from "./about/PrivacySection";
import { FutureWorkSection } from "./about/FutureWorkSection";
import { ReferencesSection } from "./about/ReferencesSection";
import { useScrollSpy } from "./about/useScrollSpy";
import { sections } from "./about/sections";
import styles from "./AboutView.module.css";

const sectionIds = sections.map((section) => section.id);

export function AboutView() {
  const activeId = useScrollSpy(sectionIds);

  return (
    <div className={styles.layout}>
      <Sidebar activeId={activeId} />
      <div className={styles.content}>
        <OverviewSection />
        <TasksSection />
        <CurationSection />
        <HarnessSection />
        <ScoringSection />
        <PrivacySection />
        <FutureWorkSection />
        <ReferencesSection />
      </div>
    </div>
  );
}
