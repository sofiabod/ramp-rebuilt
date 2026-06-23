import { useEffect, useState } from "react";

export function useScrollSpy(ids: string[]): string {
  const [activeId, setActiveId] = useState(ids[0] ?? "");

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) {
      return;
    }

    const visible = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.set(entry.target.id, entry.intersectionRatio);
          } else {
            visible.delete(entry.target.id);
          }
        }

        let topId = "";
        let topPosition = Number.POSITIVE_INFINITY;
        for (const id of visible.keys()) {
          const element = document.getElementById(id);
          if (!element) {
            continue;
          }
          const top = element.getBoundingClientRect().top;
          if (top < topPosition) {
            topPosition = top;
            topId = id;
          }
        }

        if (topId) {
          setActiveId(topId);
        }
      },
      {
        rootMargin: "-20% 0px -70% 0px",
        threshold: [0, 0.25, 0.5, 1],
      },
    );

    for (const element of elements) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [ids]);

  return activeId;
}
