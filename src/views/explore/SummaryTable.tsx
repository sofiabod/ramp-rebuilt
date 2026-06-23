import { useMemo, useState } from "react";
import type { ModelStat } from "../../data/types";
import { models } from "../../data/models";
import { ModelGlyph } from "../../components/ModelGlyph";
import { formatTime, formatTokens, formatCost } from "../../data/derive";
import styles from "./SummaryTable.module.css";

type SortKey =
  | "name"
  | "timeElapsedSec"
  | "turns"
  | "turnsPerMin"
  | "inputTokens"
  | "outputTokens"
  | "outputPerTurn"
  | "cost";

type Direction = "asc" | "desc";

interface Column {
  key: SortKey;
  label: string;
  numeric: boolean;
}

const columns: Column[] = [
  { key: "name", label: "Model", numeric: false },
  { key: "timeElapsedSec", label: "Time elapsed", numeric: true },
  { key: "turns", label: "Turns", numeric: true },
  { key: "turnsPerMin", label: "Turns/min", numeric: true },
  { key: "inputTokens", label: "Input tokens", numeric: true },
  { key: "outputTokens", label: "Output tokens", numeric: true },
  { key: "outputPerTurn", label: "Output/turn", numeric: true },
  { key: "cost", label: "Cost", numeric: true },
];

const numericKeys: SortKey[] = [
  "timeElapsedSec",
  "turns",
  "turnsPerMin",
  "inputTokens",
  "outputTokens",
  "outputPerTurn",
  "cost",
];

const barColors: Record<SortKey, string> = {
  name: "var(--spark-blue)",
  timeElapsedSec: "var(--spark-lime)",
  turns: "var(--spark-blue)",
  turnsPerMin: "var(--spark-lime)",
  inputTokens: "var(--spark-brown)",
  outputTokens: "var(--spark-orange)",
  outputPerTurn: "var(--spark-blue)",
  cost: "var(--spark-brown)",
};

function numField(m: ModelStat, key: SortKey): number | null {
  switch (key) {
    case "timeElapsedSec":
      return m.timeElapsedSec;
    case "turns":
      return m.turns;
    case "turnsPerMin":
      return m.turnsPerMin;
    case "inputTokens":
      return m.inputTokens;
    case "outputTokens":
      return m.outputTokens;
    case "outputPerTurn":
      return m.outputPerTurn;
    case "cost":
      return m.cost;
    default:
      return null;
  }
}

export function SummaryTable() {
  const [sortKey, setSortKey] = useState<SortKey>("timeElapsedSec");
  const [direction, setDirection] = useState<Direction>("asc");

  const maxima = useMemo(() => {
    const out = {} as Record<SortKey, number>;
    for (const key of numericKeys) {
      out[key] = Math.max(...models.map((m) => numField(m, key) ?? 0), 1e-9);
    }
    return out;
  }, []);

  const sorted = useMemo(() => {
    const sign = direction === "asc" ? 1 : -1;
    return [...models].sort((a, b) => {
      if (sortKey === "name") return sign * a.name.localeCompare(b.name);
      const av = numField(a, sortKey);
      const bv = numField(b, sortKey);
      if (av === null && bv === null) return 0;
      if (av === null) return 1;
      if (bv === null) return -1;
      return sign * (av - bv);
    });
  }, [sortKey, direction]);

  const onSort = (key: SortKey) => {
    if (key === sortKey) {
      setDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setDirection(key === "name" ? "asc" : "asc");
    }
  };

  const arrow = (key: SortKey) => {
    if (key !== sortKey) return null;
    return (
      <span className={styles.arrow}>{direction === "asc" ? "↑" : "↓"}</span>
    );
  };

  const bar = (key: SortKey, value: number | null) => {
    if (value === null) return null;
    const pct = Math.max(2, Math.min(100, (value / maxima[key]) * 100));
    return (
      <span className={styles.barTrack}>
        <span
          className={styles.barFill}
          style={{ width: `${pct}%`, background: barColors[key] }}
        />
      </span>
    );
  };

  return (
    <div className={styles.scroller}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                className={c.numeric ? styles.thNum : styles.thText}
                aria-sort={
                  c.key === sortKey
                    ? direction === "asc"
                      ? "ascending"
                      : "descending"
                    : "none"
                }
              >
                <button
                  type="button"
                  className={styles.sortBtn}
                  onClick={() => onSort(c.key)}
                >
                  {c.label}
                  {arrow(c.key)}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((m) => (
            <tr key={m.id}>
              <td className={styles.modelCell}>
                <ModelGlyph glyph={m.glyph} vendor={m.vendor} size={18} />
                <span className={styles.modelName}>{m.name}</span>
                {m.provisional && (
                  <span className={styles.tag}>provisional</span>
                )}
              </td>
              <td className={styles.num}>
                <span className={styles.cellInner}>
                  <span className={styles.value}>
                    {formatTime(m.timeElapsedSec)}
                  </span>
                  {bar("timeElapsedSec", m.timeElapsedSec)}
                </span>
              </td>
              <td className={styles.num}>
                <span className={styles.cellInner}>
                  <span className={styles.value}>{m.turns}</span>
                  {bar("turns", m.turns)}
                </span>
              </td>
              <td className={styles.num}>
                <span className={styles.cellInner}>
                  <span className={styles.value}>
                    {m.turnsPerMin === null ? "—" : m.turnsPerMin.toFixed(1)}
                  </span>
                  {bar("turnsPerMin", m.turnsPerMin)}
                </span>
              </td>
              <td className={styles.num}>
                <span className={styles.cellInner}>
                  <span className={styles.value}>
                    {formatTokens(m.inputTokens)}
                  </span>
                  {bar("inputTokens", m.inputTokens)}
                </span>
              </td>
              <td className={styles.num}>
                <span className={styles.cellInner}>
                  <span className={styles.value}>
                    {formatTokens(m.outputTokens)}
                  </span>
                  {bar("outputTokens", m.outputTokens)}
                </span>
              </td>
              <td className={styles.num}>
                <span className={styles.cellInner}>
                  <span className={styles.value}>
                    {m.outputPerTurn.toLocaleString("en-US")}
                  </span>
                  {bar("outputPerTurn", m.outputPerTurn)}
                </span>
              </td>
              <td className={styles.num}>
                <span className={styles.cellInner}>
                  <span className={styles.value}>{formatCost(m.cost)}</span>
                  {bar("cost", m.cost)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
