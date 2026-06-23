import { useMemo, useState } from "react";
import { benchMeta, models } from "../data/models";
import { ScatterPlot } from "./explore/ScatterPlot";
import { Histogram } from "./explore/Histogram";
import { DistributionControls } from "./explore/DistributionControls";
import { SummaryTable } from "./explore/SummaryTable";
import type { MetricKey } from "./explore/metrics";
import styles from "./ExploreView.module.css";

const DEFAULT_SELECTED = ["opus-4-7", "sonnet-4-6"];

function LinkIcon() {
  return (
    <svg
      className={styles.linkIcon}
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function SlidersIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  );
}

export function ExploreView() {
  const [metric, setMetric] = useState<MetricKey>("timeElapsedSec");
  const [selectedIds, setSelectedIds] = useState<string[]>(DEFAULT_SELECTED);
  const [bins, setBins] = useState(10);

  const toggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const selectedModels = useMemo(
    () =>
      selectedIds
        .map((id) => models.find((m) => m.id === id))
        .filter((m): m is (typeof models)[number] => Boolean(m)),
    [selectedIds],
  );

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Explore the results</h1>
        <p className={styles.subtitle}>
          Compare resolution rate, efficiency, and per-run metric distributions
          across every evaluated model.
        </p>
      </header>

      <article className={styles.card}>
        <div className={styles.cardHead}>
          <div className={styles.headText}>
            <h2 className={styles.heading}>
              Score versus spend
              <a className={styles.anchor} href="#explore" aria-label="Link">
                <LinkIcon />
              </a>
            </h2>
            <p className={styles.sub}>
              Each model's resolution rate plotted against the selected
              efficiency metric, with the Pareto frontier highlighting the best
              trade-offs.
            </p>
          </div>
          <button
            type="button"
            className={styles.toolBtn}
            aria-label="Chart settings"
          >
            <SlidersIcon />
          </button>
        </div>
        <div className={styles.caption}>
          <span>Ramp SWE-Bench</span>
          <span className={styles.captionMeta}>{benchMeta.passLabel}</span>
        </div>
        <ScatterPlot />
      </article>

      <article className={styles.card}>
        <div className={styles.cardHead}>
          <div className={styles.headText}>
            <h2 className={styles.heading}>
              Metric distributions
              <a className={styles.anchor} href="#explore" aria-label="Link">
                <LinkIcon />
              </a>
            </h2>
            <p className={styles.sub}>
              Per-run distributions for the selected metric, so you can compare
              spread and consistency between models.
            </p>
          </div>
        </div>
        <DistributionControls
          metric={metric}
          onMetricChange={setMetric}
          selectedIds={selectedIds}
          onToggle={toggle}
          bins={bins}
          onBinsChange={setBins}
        />
        <Histogram metric={metric} selected={selectedModels} bins={bins} />
      </article>

      <article className={styles.card}>
        <div className={styles.cardHead}>
          <div className={styles.headText}>
            <h2 className={styles.heading}>
              Model summary
              <a className={styles.anchor} href="#explore" aria-label="Link">
                <LinkIcon />
              </a>
            </h2>
            <p className={styles.sub}>
              Aggregate statistics for every evaluated model.
            </p>
          </div>
          <button
            type="button"
            className={styles.toolBtn}
            aria-label="Table settings"
          >
            <SlidersIcon />
          </button>
        </div>
        <SummaryTable />
      </article>
    </section>
  );
}
