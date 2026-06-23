import { useMemo, useState } from "react";
import type { ModelStat } from "../../data/types";
import { metricByKey, synthesizeCounts } from "./metrics";
import type { MetricKey } from "./metrics";
import styles from "./Histogram.module.css";

const WIDTH = 720;
const HEIGHT = 380;
const PAD = { top: 24, right: 24, bottom: 52, left: 52 };

const fills = ["var(--hist-a)", "var(--hist-b)"];
const strokes = ["var(--hist-a-line)", "var(--hist-b-line)"];
const BAR_ALPHA = 0.35;

interface HistogramProps {
  metric: MetricKey;
  selected: ModelStat[];
  bins: number;
}

interface HoverState {
  index: number;
  x: number;
}

export function Histogram({ metric, selected, bins }: HistogramProps) {
  const [hover, setHover] = useState<HoverState | null>(null);
  const def = metricByKey[metric];

  const data = useMemo(() => {
    const min = def.domain.min;
    const max = def.domain.max;
    const step = (max - min) / bins;

    const edges = Array.from({ length: bins + 1 }, (_, i) => min + i * step);
    const binCenters = Array.from(
      { length: bins },
      (_, i) => min + step * (i + 0.5),
    );

    const valued = selected
      .map((m) => ({ model: m, value: def.value(m) }))
      .filter(
        (d): d is { model: ModelStat; value: number } => d.value !== null,
      );

    if (valued.length === 0) {
      return { binCenters, edges, series: [], min, max, peak: 0.1 };
    }

    const series = valued.map((d, si) => {
      const counts = synthesizeCounts(binCenters, d.value, def.domain);
      return { model: d.model, counts, index: si };
    });

    const peak = Math.max(0.001, ...series.flatMap((s) => s.counts));

    return { binCenters, edges, series, min, max, peak };
  }, [selected, bins, def]);

  const yMax = Math.max(0.1, Math.ceil(data.peak * 100) / 100);

  const plotW = WIDTH - PAD.left - PAD.right;
  const plotH = HEIGHT - PAD.top - PAD.bottom;
  const xScale = (v: number) =>
    PAD.left + ((v - data.min) / (data.max - data.min || 1)) * plotW;
  const yScale = (frac: number) => PAD.top + (1 - frac / yMax) * plotH;

  const yTicks = useMemo(() => {
    const maxPct = yMax * 100;
    const out: number[] = [];
    for (let p = 0; p < maxPct - 1; p += 10) out.push(p / 100);
    out.push(Math.round(maxPct) / 100);
    return out;
  }, [yMax]);

  const xTicks = useMemo(() => def.ticks, [def.ticks]);

  const binW =
    data.edges.length > 1 ? xScale(data.edges[1]) - xScale(data.edges[0]) : 0;

  const linePath = (counts: number[]) => {
    const pts = data.binCenters.map((c, i) => ({
      x: xScale(c),
      y: yScale(counts[i]),
    }));
    if (pts.length === 0) return "";
    if (pts.length < 3)
      return pts
        .map(
          (p, i) =>
            `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`,
        )
        .join(" ");
    let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] ?? pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] ?? p2;
      const c1x = p1.x + (p2.x - p0.x) / 6;
      const c1y = p1.y + (p2.y - p0.y) / 6;
      const c2x = p2.x - (p3.x - p1.x) / 6;
      const c2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(
        1,
      )} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    return d;
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.legend}>
        {data.series.map((s) => (
          <span key={s.model.id} className={styles.legendItem}>
            <span
              className={styles.swatch}
              style={{
                background: fills[s.index % fills.length],
              }}
            />
            {s.model.name}
          </span>
        ))}
        {data.series.length === 0 && (
          <span className={styles.empty}>Select at least one model.</span>
        )}
      </div>

      <div className={styles.plotArea}>
        <svg
          className={styles.svg}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-label={`${def.label} distribution histogram`}
        >
          {yTicks.map((t, i) => (
            <g key={`y${i}`}>
              <line
                className={styles.grid}
                x1={PAD.left}
                x2={WIDTH - PAD.right}
                y1={yScale(t)}
                y2={yScale(t)}
              />
              <text
                className={styles.tick}
                x={PAD.left - 8}
                y={yScale(t)}
                textAnchor="end"
                dominantBaseline="middle"
              >
                {(t * 100).toFixed(0)}%
              </text>
            </g>
          ))}

          {xTicks.map((t, i) => (
            <text
              key={`x${i}`}
              className={styles.tick}
              x={xScale(t.value)}
              y={HEIGHT - PAD.bottom + 18}
              textAnchor="middle"
            >
              {t.label}
            </text>
          ))}

          {data.series.map((s) =>
            s.counts.map((c, bi) => (
              <rect
                key={`${s.model.id}-${bi}`}
                x={xScale(data.edges[bi]) + 1}
                y={yScale(c)}
                width={Math.max(binW - 2, 1)}
                height={Math.max(yScale(0) - yScale(c), 0)}
                fill={fills[s.index % fills.length]}
                opacity={BAR_ALPHA}
              />
            )),
          )}

          {data.series.map((s) => (
            <path
              key={`line-${s.model.id}`}
              className={styles.curve}
              d={linePath(s.counts)}
              fill="none"
              stroke={strokes[s.index % strokes.length]}
            />
          ))}

          {hover && (
            <line
              className={styles.guide}
              x1={hover.x}
              x2={hover.x}
              y1={PAD.top}
              y2={HEIGHT - PAD.bottom}
            />
          )}

          {data.binCenters.map((_, bi) => (
            <rect
              key={`hit${bi}`}
              x={xScale(data.edges[bi])}
              y={PAD.top}
              width={binW}
              height={plotH}
              fill="transparent"
              onMouseEnter={() =>
                setHover({
                  index: bi,
                  x: xScale(data.binCenters[bi]),
                })
              }
              onMouseLeave={() => setHover(null)}
            />
          ))}

          <line
            className={styles.axis}
            x1={PAD.left}
            x2={PAD.left}
            y1={PAD.top}
            y2={HEIGHT - PAD.bottom}
          />
          <line
            className={styles.axis}
            x1={PAD.left}
            x2={WIDTH - PAD.right}
            y1={HEIGHT - PAD.bottom}
            y2={HEIGHT - PAD.bottom}
          />

          <text
            className={styles.axisTitle}
            x={PAD.left + plotW / 2}
            y={HEIGHT - 8}
            textAnchor="middle"
          >
            {def.axisLabel}
          </text>
          <text
            className={styles.axisTitle}
            x={-(PAD.top + plotH / 2)}
            y={14}
            textAnchor="middle"
            transform="rotate(-90)"
          >
            Percent
          </text>
        </svg>

        {hover && data.edges.length > 1 && (
          <div
            className={styles.tooltip}
            style={{
              left: `${(Math.min(Math.max(hover.x, PAD.left + 90), WIDTH - PAD.right - 90) / WIDTH) * 100}%`,
              top: `${((PAD.top + 8) / HEIGHT) * 100}%`,
            }}
          >
            <div className={styles.tooltipRange}>
              {def.format(data.edges[hover.index])} -{" "}
              {def.format(data.edges[hover.index + 1])}
            </div>
            {data.series.map((s) => (
              <div key={s.model.id} className={styles.tooltipRow}>
                <span
                  className={styles.tooltipDot}
                  style={{ background: strokes[s.index % strokes.length] }}
                />
                {s.model.name}
                <span className={styles.tooltipVal}>
                  {(s.counts[hover.index] * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
