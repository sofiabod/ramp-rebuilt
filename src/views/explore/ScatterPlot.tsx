import { useMemo } from "react";
import { ModelGlyph } from "../../components/ModelGlyph";
import { models, benchMeta, modelsById } from "../../data/models";
import { buildScatter, formatCost, formatPercent } from "../../data/derive";
import styles from "./ScatterPlot.module.css";

const WIDTH = 960;
const HEIGHT = 540;
const PAD = { top: 28, right: 140, bottom: 56, left: 56 };

const Y_MIN = 0.4;
const Y_MAX = 0.95;
const MARKER = 26;

type Anchor = "start" | "middle" | "end";

interface Label {
  text: string;
  dx: number;
  dy: number;
  anchor: Anchor;
}

const labels: Record<string, Label> = {
  "fable-5": { text: "Fable 5†", dx: 18, dy: 5, anchor: "start" },
  "opus-4-7": { text: "Opus 4.7", dx: 18, dy: 5, anchor: "start" },
  "gpt-5-5": { text: "GPT-5.5", dx: 18, dy: 5, anchor: "start" },
  "opus-4-8": { text: "Opus 4.8", dx: 18, dy: 5, anchor: "start" },
  "glm-5-2": { text: "GLM 5.2", dx: 18, dy: 5, anchor: "start" },
  "kimi-k2-7": { text: "Kimi K2.7", dx: -16, dy: -10, anchor: "end" },
  "gpt-5-4": { text: "GPT-5.4", dx: -16, dy: 0, anchor: "end" },
  "sonnet-4-6": { text: "Sonnet 4.6", dx: 0, dy: 24, anchor: "middle" },
  "deepseek-v4": { text: "DeepSeek V4", dx: 18, dy: 5, anchor: "start" },
  "gemini-3-1-pro": { text: "Gemini 3.1 Pro", dx: 18, dy: 5, anchor: "start" },
  "qwen-3-7": { text: "Qwen3.7+", dx: 18, dy: 5, anchor: "start" },
  "gpt-5-4-mini": { text: "GPT-5.4 Mini", dx: 18, dy: 5, anchor: "start" },
  "haiku-4-5": { text: "Haiku 4.5", dx: 18, dy: 5, anchor: "start" },
  "gpt-5-4-nano": { text: "GPT-5.4 Nano", dx: 18, dy: 5, anchor: "start" },
};

export function ScatterPlot() {
  const points = useMemo(() => buildScatter(models, benchMeta.n), []);

  const plotW = WIDTH - PAD.left - PAD.right;
  const plotH = HEIGHT - PAD.top - PAD.bottom;
  const xMax = 3;

  const xScale = (cost: number) => PAD.left + (cost / xMax) * plotW;
  const yScale = (rate: number) =>
    PAD.top + (1 - (rate - Y_MIN) / (Y_MAX - Y_MIN)) * plotH;

  const xTicks = useMemo(() => {
    const out: number[] = [];
    for (let c = 0; c <= xMax + 1e-9; c += 0.5) out.push(+c.toFixed(2));
    return out;
  }, []);

  const yTicks = useMemo(() => {
    const out: number[] = [];
    for (let r = Y_MIN; r <= Y_MAX + 1e-9; r += 0.05) out.push(+r.toFixed(2));
    return out;
  }, []);

  const frontierPath = useMemo(() => {
    const sorted = points
      .filter((p) => p.onFrontier)
      .sort((a, b) => a.cost - b.cost);
    return sorted
      .map(
        (p, i) =>
          `${i === 0 ? "M" : "L"} ${xScale(p.cost).toFixed(1)} ${yScale(
            p.solveRate,
          ).toFixed(1)}`,
      )
      .join(" ");
  }, [points]);

  return (
    <div className={styles.wrap}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label="Solve rate versus cost scatter plot"
      >
        {yTicks.map((t) => (
          <g key={`y${t}`}>
            <line
              className={styles.grid}
              x1={PAD.left}
              x2={WIDTH - PAD.right}
              y1={yScale(t)}
              y2={yScale(t)}
            />
            <text
              className={styles.tick}
              x={PAD.left - 10}
              y={yScale(t)}
              textAnchor="end"
              dominantBaseline="middle"
            >
              {formatPercent(t)}
            </text>
          </g>
        ))}

        {xTicks.map((t) => (
          <g key={`x${t}`}>
            <line
              className={styles.grid}
              x1={xScale(t)}
              x2={xScale(t)}
              y1={PAD.top}
              y2={HEIGHT - PAD.bottom}
            />
            <text
              className={styles.tick}
              x={xScale(t)}
              y={HEIGHT - PAD.bottom + 20}
              textAnchor="middle"
            >
              {formatCost(t)}
            </text>
          </g>
        ))}

        {frontierPath && (
          <path className={styles.frontier} d={frontierPath} fill="none" />
        )}

        {points.map((p) => {
          const cx = xScale(p.cost);
          const cy = yScale(p.solveRate);
          const model = modelsById[p.id];
          const label = labels[p.id];
          return (
            <g key={p.id}>
              <line
                className={styles.errorBar}
                x1={cx}
                x2={cx}
                y1={yScale(p.ciLow)}
                y2={yScale(p.ciHigh)}
              />
              <line
                className={styles.errorCap}
                x1={cx - 4}
                x2={cx + 4}
                y1={yScale(p.ciHigh)}
                y2={yScale(p.ciHigh)}
              />
              <line
                className={styles.errorCap}
                x1={cx - 4}
                x2={cx + 4}
                y1={yScale(p.ciLow)}
                y2={yScale(p.ciLow)}
              />
              <foreignObject
                x={cx - MARKER / 2}
                y={cy - MARKER / 2}
                width={MARKER}
                height={MARKER}
              >
                <ModelGlyph
                  glyph={model.glyph}
                  vendor={model.vendor}
                  size={MARKER}
                />
              </foreignObject>
              {label && (
                <text
                  className={styles.label}
                  x={cx + label.dx}
                  y={cy + label.dy}
                  textAnchor={label.anchor}
                >
                  {label.text}
                </text>
              )}
            </g>
          );
        })}

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
          y={HEIGHT - 10}
          textAnchor="middle"
        >
          Cost (Average)
        </text>
        <text
          className={styles.axisTitle}
          x={-(PAD.top + plotH / 2)}
          y={16}
          textAnchor="middle"
          transform="rotate(-90)"
        >
          Solve rate
        </text>
      </svg>
    </div>
  );
}
