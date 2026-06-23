export type Vendor =
  | "anthropic"
  | "openai"
  | "google"
  | "zhipu"
  | "moonshot"
  | "deepseek"
  | "alibaba";

export type Glyph =
  | "star"
  | "sun"
  | "diamond"
  | "square"
  | "ink"
  | "whale"
  | "swirl";

export interface ModelStat {
  id: string;
  name: string;
  vendor: Vendor;
  glyph: Glyph;
  solveRate: number;
  cost: number;
  timeElapsedSec: number | null;
  turns: number;
  turnsPerMin: number | null;
  inputTokens: number;
  outputTokens: number;
  outputPerTurn: number;
  provisional?: boolean;
}

export interface WorkStyle {
  explore: number;
  read: number;
  write: number;
  test: number;
}

export interface HeadToHeadStat {
  label: string;
  hint?: string;
  left: string;
  right: string;
}

export interface DistributionSeries {
  metric: string;
  unit: string;
  left: number[];
  right: number[];
  axis: string[];
}

export interface TraceResult {
  model: string;
  passed: boolean;
  cost: number;
  turns?: number;
  duration?: string;
}

export interface TraceExample {
  id: string;
  title: string;
  icon: "import" | "vendor" | "tooling" | "billpay";
  summary: string;
  left: TraceResult;
  right: TraceResult;
}

export interface Matchup {
  id: string;
  left: string;
  right: string;
}

export interface HeadToHead {
  id: string;
  leftId: string;
  rightId: string;
  takeaways: string[];
  workStyle: { left: WorkStyle; right: WorkStyle };
  stats: HeadToHeadStat[];
  distributions: DistributionSeries[];
  outcomes: {
    both: number;
    leftOnly: number;
    rightOnly: number;
    neither: number;
  };
  sharedMisses: string[];
  traces: TraceExample[];
}

export interface ScatterPoint {
  id: string;
  solveRate: number;
  cost: number;
  ciLow: number;
  ciHigh: number;
  onFrontier: boolean;
}
