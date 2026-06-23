import type {
  HeadToHead,
  ModelStat,
  WorkStyle,
  HeadToHeadStat,
  DistributionSeries,
  TraceExample,
} from "./types";
import { modelsById } from "./models";

const bell = (peak: number, skew: number, len = 11): number[] =>
  Array.from({ length: len }, (_, i) => {
    const sigmaLeft = 1.5;
    const sigmaRight = 3 + skew * 4;
    const sigma = i < peak ? sigmaLeft : sigmaRight;
    const x = (i - peak) / sigma;
    return Math.round(Math.exp(-x * x) * 100);
  });

const shortName = (name: string): string => name.replace(/^Claude\s+/, "");

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const seedFrom = (a: string, b: string): number => {
  let h = 2166136261;
  for (const ch of `${a}__${b}`) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
};

const peakFor = (value: number, lo: number, hi: number): number => {
  const t = clamp((value - lo) / (hi - lo), 0, 1);
  return clamp(Math.round(1 + t * 8), 1, 9);
};

const workStyleFor = (m: ModelStat, jitter: number): WorkStyle => {
  const explore = clamp(34 + (m.turns - 50) * 0.25 + jitter * 8, 26, 48);
  const test = clamp(10 + m.solveRate * 14 + jitter * 4, 8, 24);
  const write = clamp(10 + (m.outputPerTurn / 200) * 2.5, 8, 20);
  const read = clamp(100 - explore - test - write, 18, 48);
  return {
    explore: Math.round(explore),
    read: Math.round(read),
    write: Math.round(write),
    test: Math.round(test),
  };
};

const statsFor = (
  left: ModelStat,
  right: ModelStat,
  seed: number,
): HeadToHeadStat[] => {
  const firstWrite = (m: ModelStat): number =>
    Math.round(clamp(m.turns * 0.45 + 8, 12, 48));
  const revising = (m: ModelStat): number =>
    Math.round(clamp(m.turns * 0.3, 6, 30));
  const testDriven = (m: ModelStat): number =>
    Math.round(clamp(55 + m.solveRate * 50, 40, 99));
  const persistence = (m: ModelStat): number =>
    Math.round(clamp(35 + m.solveRate * 50, 30, 92));
  const multiRound = (m: ModelStat): number =>
    Math.round(clamp(30 + (m.turns - 40) * 1.1 + seed * 12, 20, 82));
  const toolError = (m: ModelStat): number =>
    clamp(1.4 + (1 - m.solveRate) * 6, 1.2, 7.5);

  return [
    {
      label: "Turns before first write",
      left: `${firstWrite(left)}`,
      right: `${firstWrite(right)}`,
    },
    {
      label: "Turns spent revising",
      hint: "Median turns after the first write",
      left: `${revising(left)}`,
      right: `${revising(right)}`,
    },
    {
      label: "Test-driven revisions",
      hint: "Runs that wrote or ran tests",
      left: `${testDriven(left)}%`,
      right: `${testDriven(right)}%`,
    },
    {
      label: "Test persistence",
      hint: "Tests kept in the final diff",
      left: `${persistence(left)}%`,
      right: `${persistence(right)}%`,
    },
    {
      label: "Multiple revision rounds",
      hint: "Runs with 2+ rewrite passes",
      left: `${multiRound(left)}%`,
      right: `${multiRound(right)}%`,
    },
    {
      label: "Tool error rate",
      left: `${toolError(left).toFixed(1)}%`,
      right: `${toolError(right).toFixed(1)}%`,
    },
  ];
};

const distributionsFor = (
  left: ModelStat,
  right: ModelStat,
): DistributionSeries[] => [
  {
    metric: "Cost",
    unit: "$",
    left: bell(peakFor(left.cost, 0, 8), 0.1),
    right: bell(peakFor(right.cost, 0, 8), -0.1),
    axis: ["$0", "$2", "$4", "$6", "$8"],
  },
  {
    metric: "Time elapsed",
    unit: "min",
    left: bell(peakFor((left.timeElapsedSec ?? 900) / 60, 0, 40), 0.2),
    right: bell(peakFor((right.timeElapsedSec ?? 900) / 60, 0, 40), 0),
    axis: ["0", "10", "20", "30", "40"],
  },
  {
    metric: "Turns",
    unit: "",
    left: bell(peakFor(left.turns, 0, 100), 0),
    right: bell(peakFor(right.turns, 0, 100), 0.1),
    axis: ["0", "25", "50", "75", "100"],
  },
  {
    metric: "Turns per minute",
    unit: "",
    left: bell(peakFor(left.turnsPerMin ?? 4, 0, 9), -0.1),
    right: bell(peakFor(right.turnsPerMin ?? 4, 0, 9), 0.1),
    axis: ["0", "3", "6", "9"],
  },
  {
    metric: "Output tokens",
    unit: "",
    left: bell(peakFor(left.outputTokens, 0, 60000), 0),
    right: bell(peakFor(right.outputTokens, 0, 60000), 0.2),
    axis: ["0", "20K", "40K", "60K"],
  },
  {
    metric: "Output tokens per turn",
    unit: "",
    left: bell(peakFor(left.outputPerTurn, 0, 1200), 0),
    right: bell(peakFor(right.outputPerTurn, 0, 1200), 0.3),
    axis: ["0", "400", "800", "1.2K"],
  },
];

const takeawaysFor = (left: ModelStat, right: ModelStat): string[] => {
  const ln = shortName(left.name);
  const rn = shortName(right.name);
  const leftSolves = Math.round(left.solveRate * 80);
  const rightSolves = Math.round(right.solveRate * 80);
  const leader = leftSolves >= rightSolves ? ln : rn;
  const lagger = leftSolves >= rightSolves ? rn : ln;
  const gap = Math.abs(leftSolves - rightSolves);
  const disagreement = Math.round(
    8 + Math.abs(left.cost - right.cost) * 3 + gap,
  );
  const cheaper =
    left.cost / left.solveRate <= right.cost / right.solveRate ? ln : rn;
  const leaner = left.turns <= right.turns ? ln : rn;
  return [
    `${leader} solves ${gap === 0 ? "as many" : `${gap} more`} task${gap === 1 ? "" : "s"} than ${lagger}, with a ${disagreement} task disagreement set`,
    `${cheaper} runs leaner per solve, landing cheaper on the dollar and steadier on the clock`,
    `${leaner} takes fewer steps and gathers less context before committing to a fix`,
  ];
};

const outcomesFor = (
  left: ModelStat,
  right: ModelStat,
): HeadToHead["outcomes"] => {
  const n = 80;
  const leftSolves = Math.round(left.solveRate * n);
  const rightSolves = Math.round(right.solveRate * n);
  const both = clamp(
    Math.round(Math.min(leftSolves, rightSolves) * 0.82),
    0,
    n,
  );
  const leftOnly = clamp(leftSolves - both, 0, n);
  const rightOnly = clamp(rightSolves - both, 0, n);
  const neither = clamp(n - both - leftOnly - rightOnly, 0, n);
  return { both, leftOnly, rightOnly, neither };
};

const MISS_POOL = [
  "External firms 8",
  "Bill accounting 47",
  "Vendor payments 49",
  "Bill policies 66",
  "Ledger sync 12",
  "Card limits 31",
  "Approval chains 55",
  "Receipt match 73",
];

const sharedMissesFor = (seed: number): string[] => {
  const start = Math.floor(seed * (MISS_POOL.length - 4));
  return MISS_POOL.slice(start, start + 4);
};

const ICONS: TraceExample["icon"][] = [
  "import",
  "vendor",
  "tooling",
  "billpay",
];

const TRACE_TITLES = [
  "Bill imports 48",
  "Vendor management 28",
  "Agent tooling 79",
  "Bill pay 80",
];

const tracesFor = (
  left: ModelStat,
  right: ModelStat,
  seed: number,
): TraceExample[] => {
  const ln = left.name;
  const rn = right.name;
  const summaries = [
    `A surgical one-spot fix. ${shortName(ln)} located the exact spot and confirmed it with a throwaway test; ${shortName(rn)} kept widening the search and committed a fix one layer too high.`,
    `${shortName(rn)} mirrored an existing pattern and kept the change to a minimal surface; ${shortName(ln)} spread the edit across several files and missed.`,
    `Both reach the same fix; ${shortName(ln)} gets there after a wider search and deep reading, while ${shortName(rn)} navigates straight to it and verifies leanly.`,
    `${shortName(rn)} committed fast to an incomplete fix and missed; ${shortName(ln)} traced the failure to its real source and patched the spot that actually mattered.`,
  ];
  const patterns: { lp: boolean; rp: boolean }[] = [
    { lp: true, rp: false },
    { lp: false, rp: true },
    { lp: true, rp: true },
    { lp: true, rp: false },
  ];
  const cost = (m: ModelStat, mult: number): number =>
    Number((m.cost * mult).toFixed(2));
  const turnsOf = (m: ModelStat, mult: number): number =>
    Math.round(m.turns * mult);
  return TRACE_TITLES.map((title, i) => {
    const p = patterns[i];
    const mult = 0.9 + ((seed + i * 0.17) % 1) * 1.4;
    const withDuration = i === 2;
    return {
      id: `${title.toLowerCase().replace(/\s+/g, "-")}`,
      title,
      icon: ICONS[i],
      summary: summaries[i],
      left: withDuration
        ? {
            model: ln,
            passed: p.lp,
            cost: cost(left, mult),
            duration: `${Math.round(((left.timeElapsedSec ?? 900) / 60) * mult)}m`,
          }
        : {
            model: ln,
            passed: p.lp,
            turns: turnsOf(left, mult),
            cost: cost(left, mult),
          },
      right: withDuration
        ? {
            model: rn,
            passed: p.rp,
            cost: cost(right, mult * 0.6),
            duration: `${Math.round(((right.timeElapsedSec ?? 900) / 60) * mult * 0.6)}m`,
          }
        : {
            model: rn,
            passed: p.rp,
            turns: turnsOf(right, mult * 0.9),
            cost: cost(right, mult * 0.6),
          },
    };
  });
};

export function buildHeadToHead(leftId: string, rightId: string): HeadToHead {
  const left = modelsById[leftId];
  const right = modelsById[rightId];
  const seed = seedFrom(leftId, rightId);
  return {
    id: `${leftId}__${rightId}`,
    leftId,
    rightId,
    takeaways: takeawaysFor(left, right),
    workStyle: {
      left: workStyleFor(left, seed - 0.5),
      right: workStyleFor(right, ((seed + 0.3) % 1) - 0.5),
    },
    stats: statsFor(left, right, seed),
    distributions: distributionsFor(left, right),
    outcomes: outcomesFor(left, right),
    sharedMisses: sharedMissesFor(seed),
    traces: tracesFor(left, right, seed),
  };
}
