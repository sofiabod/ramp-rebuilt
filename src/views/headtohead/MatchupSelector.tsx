import { useEffect, useRef, useState } from "react";
import type { ModelStat } from "../../data/types";
import { ModelGlyph } from "../../components/ModelGlyph";
import styles from "./MatchupSelector.module.css";

interface MatchupSelectorProps {
  models: ModelStat[];
  leftId: string;
  rightId: string;
  onSelectLeft: (id: string) => void;
  onSelectRight: (id: string) => void;
}

type OpenSide = "left" | "right" | null;

function shortName(name: string): string {
  return name.replace(/^Claude\s+/, "");
}

export function MatchupSelector({
  models,
  leftId,
  rightId,
  onSelectLeft,
  onSelectRight,
}: MatchupSelectorProps) {
  const [open, setOpen] = useState<OpenSide>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const left = models.find((m) => m.id === leftId);
  const right = models.find((m) => m.id === rightId);

  useEffect(() => {
    if (!open) {
      return;
    }
    function onDocClick(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(null);
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(null);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!left || !right) {
    return null;
  }

  return (
    <div className={styles.wrap} ref={containerRef}>
      <div className={styles.pill}>
        <SelectorButton
          side="left"
          model={left}
          isOpen={open === "left"}
          onToggle={() => setOpen(open === "left" ? null : "left")}
        />
        <span className={styles.vs}>vs</span>
        <SelectorButton
          side="right"
          model={right}
          isOpen={open === "right"}
          onToggle={() => setOpen(open === "right" ? null : "right")}
        />
        {open === "left" ? (
          <Dropdown
            side="left"
            models={models}
            activeId={leftId}
            onPick={(id) => {
              onSelectLeft(id);
              setOpen(null);
            }}
          />
        ) : null}
        {open === "right" ? (
          <Dropdown
            side="right"
            models={models}
            activeId={rightId}
            onPick={(id) => {
              onSelectRight(id);
              setOpen(null);
            }}
          />
        ) : null}
      </div>
    </div>
  );
}

interface SelectorButtonProps {
  side: "left" | "right";
  model: ModelStat;
  isOpen: boolean;
  onToggle: () => void;
}

function SelectorButton({
  side,
  model,
  isOpen,
  onToggle,
}: SelectorButtonProps) {
  const ringClass = side === "left" ? styles.ringLeft : styles.ringRight;
  return (
    <button
      type="button"
      className={isOpen ? `${styles.selector} ${ringClass}` : styles.selector}
      aria-haspopup="listbox"
      aria-expanded={isOpen}
      onClick={onToggle}
    >
      <ModelGlyph vendor={model.vendor} size={20} />
      <span className={styles.selName}>{shortName(model.name)}</span>
      <svg
        className={styles.chevron}
        viewBox="0 0 16 16"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 6l4 4 4-4" />
      </svg>
    </button>
  );
}

interface DropdownProps {
  side: "left" | "right";
  models: ModelStat[];
  activeId: string;
  onPick: (id: string) => void;
}

function Dropdown({ side, models, activeId, onPick }: DropdownProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filtered = models.filter((m) =>
    m.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <div
      className={
        side === "left"
          ? `${styles.dropdown} ${styles.dropdownLeft}`
          : `${styles.dropdown} ${styles.dropdownRight}`
      }
      role="listbox"
    >
      <div className={styles.searchRow}>
        <input
          ref={inputRef}
          type="text"
          className={styles.search}
          placeholder="Search models"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <svg
          className={styles.searchIcon}
          viewBox="0 0 16 16"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="7" cy="7" r="4.5" />
          <path d="M10.5 10.5l3 3" />
        </svg>
      </div>
      <ul className={styles.list}>
        {filtered.map((m) => (
          <li key={m.id}>
            <button
              type="button"
              role="option"
              aria-selected={m.id === activeId}
              className={
                m.id === activeId
                  ? `${styles.option} ${styles.optionActive}`
                  : styles.option
              }
              onClick={() => onPick(m.id)}
            >
              <ModelGlyph vendor={m.vendor} size={20} />
              <span className={styles.optionName}>{m.name}</span>
            </button>
          </li>
        ))}
        {filtered.length === 0 ? (
          <li className={styles.empty}>No models found</li>
        ) : null}
      </ul>
    </div>
  );
}
