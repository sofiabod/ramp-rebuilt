import type { ModelStat } from "../../data/types";
import { formatCost, formatTokens } from "../../data/derive";

export type MetricKey =
  | "timeElapsedSec"
  | "cost"
  | "turns"
  | "turnsPerMin"
  | "outputTokens";

export interface MetricTick {
  value: number;
  label: string;
}

export interface MetricDef {
  key: MetricKey;
  label: string;
  axisLabel: string;
  value: (m: ModelStat) => number | null;
  format: (v: number) => string;
  domain: { min: number; max: number };
  ticks: MetricTick[];
}

function timeLabel(v: number): string {
  const total = Math.max(0, Math.round(v));
  const mm = Math.floor(total / 60);
  const ss = total % 60;
  return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
}

export const metricDefs: MetricDef[] = [
  {
    key: "timeElapsedSec",
    label: "Time elapsed",
    axisLabel: "Time elapsed",
    value: (m) => m.timeElapsedSec,
    format: timeLabel,
    domain: { min: 0, max: 2520 },
    ticks: [
      { value: 0, label: "00:00" },
      { value: 600, label: "10:00" },
      { value: 1200, label: "20:00" },
      { value: 1800, label: "30:00" },
      { value: 2400, label: "40:00" },
    ],
  },
  {
    key: "cost",
    label: "Cost",
    axisLabel: "Cost",
    value: (m) => m.cost,
    format: (v) => formatCost(v),
    domain: { min: 0, max: 8 },
    ticks: [
      { value: 0, label: "$0" },
      { value: 2, label: "$2" },
      { value: 4, label: "$4" },
      { value: 6, label: "$6" },
      { value: 8, label: "$8" },
    ],
  },
  {
    key: "turns",
    label: "Turns",
    axisLabel: "Turns",
    value: (m) => m.turns,
    format: (v) => String(Math.round(v)),
    domain: { min: 0, max: 100 },
    ticks: [
      { value: 0, label: "0" },
      { value: 25, label: "25" },
      { value: 50, label: "50" },
      { value: 75, label: "75" },
      { value: 100, label: "100" },
    ],
  },
  {
    key: "turnsPerMin",
    label: "Turns per minute",
    axisLabel: "Turns per minute",
    value: (m) => m.turnsPerMin,
    format: (v) => v.toFixed(1),
    domain: { min: 0, max: 9 },
    ticks: [
      { value: 0, label: "0" },
      { value: 3, label: "3" },
      { value: 6, label: "6" },
      { value: 9, label: "9" },
    ],
  },
  {
    key: "outputTokens",
    label: "Output tokens",
    axisLabel: "Output tokens",
    value: (m) => m.outputTokens,
    format: (v) => formatTokens(v),
    domain: { min: 0, max: 60000 },
    ticks: [
      { value: 0, label: "0" },
      { value: 20000, label: "20K" },
      { value: 40000, label: "40K" },
      { value: 60000, label: "60K" },
    ],
  },
];

export const metricByKey: Record<MetricKey, MetricDef> = Object.fromEntries(
  metricDefs.map((d) => [d.key, d]),
) as Record<MetricKey, MetricDef>;

export function synthesizeCounts(
  binCenters: number[],
  mean: number,
  domain: { min: number; max: number },
): number[] {
  const span = domain.max - domain.min || 1;
  const mode = domain.min + (mean - domain.min) * 0.6;
  const shape = 2.4;
  const ref = Math.max(mode - domain.min, span * 0.04);
  const scale = ref / (shape - 1);
  const raw = binCenters.map((c) => {
    const x = c - domain.min;
    if (x <= 0) return 0;
    const t = x / scale;
    return Math.pow(t, shape - 1) * Math.exp(-t);
  });
  const total = raw.reduce((a, b) => a + b, 0) || 1;
  return raw.map((r) => r / total);
}
