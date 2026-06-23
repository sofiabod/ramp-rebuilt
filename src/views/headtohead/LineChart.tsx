import styles from "./LineChart.module.css";

interface LineChartProps {
  left: number[];
  right: number[];
  axis: string[];
}

const WIDTH = 400;
const HEIGHT = 170;
const PAD_X = 10;
const PAD_TOP = 12;
const PAD_BOTTOM = 12;

interface Point {
  x: number;
  y: number;
}

function smoothPath(points: Point[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let path = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i === 0 ? 0 : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1];
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    path += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return path;
}

export function LineChart({ left, right, axis }: LineChartProps) {
  const max = Math.max(1, ...left, ...right);
  const plotHeight = HEIGHT - PAD_TOP - PAD_BOTTOM;
  const plotWidth = WIDTH - PAD_X * 2;

  const toPoints = (series: number[]): Point[] =>
    series.map((value, index) => ({
      x:
        series.length > 1
          ? PAD_X + (index / (series.length - 1)) * plotWidth
          : PAD_X + plotWidth / 2,
      y: PAD_TOP + plotHeight - (value / max) * plotHeight,
    }));

  const gridLines = [0.25, 0.5, 0.75];

  return (
    <div className={styles.wrap}>
      <svg className={styles.svg} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img">
        {gridLines.map((ratio) => {
          const y = PAD_TOP + plotHeight * ratio;
          return (
            <line
              key={ratio}
              x1={PAD_X}
              y1={y}
              x2={WIDTH - PAD_X}
              y2={y}
              stroke="var(--plot-grid)"
              strokeWidth="1"
            />
          );
        })}
        <line
          x1={PAD_X}
          y1={PAD_TOP + plotHeight}
          x2={WIDTH - PAD_X}
          y2={PAD_TOP + plotHeight}
          stroke="var(--color-border-strong)"
          strokeWidth="1"
        />
        <path
          d={smoothPath(toPoints(left))}
          fill="none"
          stroke="var(--series-a)"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path
          d={smoothPath(toPoints(right))}
          fill="none"
          stroke="var(--series-b)"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
      <div className={styles.axis}>
        {axis.map((label, index) => (
          <span key={index} className={styles.tick}>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
