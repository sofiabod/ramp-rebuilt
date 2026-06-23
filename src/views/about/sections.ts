export type SectionMeta = {
  id: string;
  label: string;
};

export const sections: SectionMeta[] = [
  { id: "overview", label: "Overview" },
  { id: "tasks", label: "Tasks" },
  { id: "curation", label: "Curation" },
  { id: "harness", label: "Harness" },
  { id: "scoring", label: "Scoring" },
  { id: "privacy", label: "Privacy" },
  { id: "future-work", label: "Future work" },
  { id: "references", label: "References" },
];
