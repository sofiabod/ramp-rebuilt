import type { ModelStat, ScatterPoint } from "./types";

export function wilsonInterval(rate: number, n: number): [number, number] {
  const z = 1;
  const denom = 1 + (z * z) / n;
  const center = rate + (z * z) / (2 * n);
  const margin = z * Math.sqrt((rate * (1 - rate)) / n + (z * z) / (4 * n * n));
  return [(center - margin) / denom, (center + margin) / denom];
}

export function paretoFrontier(items: ModelStat[]): Set<string> {
  const frontier = new Set<string>();
  for (const a of items) {
    const dominated = items.some(
      (b) =>
        b.id !== a.id &&
        b.cost <= a.cost &&
        b.solveRate >= a.solveRate &&
        (b.cost < a.cost || b.solveRate > a.solveRate),
    );
    if (!dominated) frontier.add(a.id);
  }
  return frontier;
}

export function buildScatter(items: ModelStat[], n: number): ScatterPoint[] {
  const frontier = paretoFrontier(items);
  return items.map((m) => {
    const [low, high] = wilsonInterval(m.solveRate, n);
    return {
      id: m.id,
      solveRate: m.solveRate,
      cost: m.cost,
      ciLow: low,
      ciHigh: high,
      onFrontier: frontier.has(m.id),
    };
  });
}

export function formatTime(sec: number | null): string {
  if (sec === null) return "—";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${Math.round(n / 1000)}K`;
  return String(n);
}

export function formatCost(n: number): string {
  return `$${n.toFixed(2)}`;
}

export function formatPercent(rate: number, digits = 0): string {
  return `${(rate * 100).toFixed(digits)}%`;
}
