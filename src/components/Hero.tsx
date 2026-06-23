import styles from "./Hero.module.css";

interface Cutout {
  index: number;
  x: string;
  y: string;
  width: string;
  rotate: string;
  delay: number;
}

const cutouts: Cutout[] = [
  {
    index: 0,
    x: "-43vw",
    y: "-28vh",
    width: "clamp(158px, 21vw, 304px)",
    rotate: "-13deg",
    delay: 0,
  },
  {
    index: 3,
    x: "-28vw",
    y: "-45vh",
    width: "clamp(124px, 16vw, 238px)",
    rotate: "8deg",
    delay: 45,
  },
  {
    index: 1,
    x: "28vw",
    y: "-47vh",
    width: "clamp(164px, 21vw, 318px)",
    rotate: "-5deg",
    delay: 20,
  },
  {
    index: 6,
    x: "40vw",
    y: "-31vh",
    width: "clamp(140px, 18.5vw, 270px)",
    rotate: "11deg",
    delay: 70,
  },
  {
    index: 4,
    x: "34vw",
    y: "-4vh",
    width: "clamp(124px, 16vw, 236px)",
    rotate: "-9deg",
    delay: 35,
  },
  {
    index: 9,
    x: "25vw",
    y: "17vh",
    width: "clamp(158px, 20vw, 304px)",
    rotate: "7deg",
    delay: 95,
  },
  {
    index: 2,
    x: "43vw",
    y: "9vh",
    width: "clamp(106px, 14vw, 208px)",
    rotate: "-12deg",
    delay: 60,
  },
  {
    index: 7,
    x: "-23vw",
    y: "18vh",
    width: "clamp(140px, 18vw, 270px)",
    rotate: "6deg",
    delay: 85,
  },
  {
    index: 10,
    x: "-35vw",
    y: "5vh",
    width: "clamp(158px, 20.5vw, 304px)",
    rotate: "-7deg",
    delay: 30,
  },
  {
    index: 5,
    x: "-47vw",
    y: "-4vh",
    width: "clamp(118px, 16vw, 232px)",
    rotate: "10deg",
    delay: 105,
  },
  {
    index: 11,
    x: "-30vw",
    y: "-19vh",
    width: "clamp(112px, 15vw, 218px)",
    rotate: "5deg",
    delay: 50,
  },
  {
    index: 8,
    x: "30vw",
    y: "-20vh",
    width: "clamp(108px, 14vw, 208px)",
    rotate: "-8deg",
    delay: 75,
  },
];

function scrollToContent() {
  window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
}

function ChevronDown() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="6 13 12 19 18 13" />
    </svg>
  );
}

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.cutouts} aria-hidden="true">
        {cutouts.map((cutout) => (
          <span
            key={cutout.index}
            className={styles.cutout}
            style={{
              width: cutout.width,
              transform: `translate(-50%, -50%) translate(${cutout.x}, ${cutout.y}) rotate(${cutout.rotate})`,
            }}
          >
            <img
              className={styles.cutoutImg}
              src={`/swebench/background-images/background-${cutout.index + 1}-1024.webp`}
              alt=""
              style={{ animationDelay: `${cutout.delay * 0.05}s` }}
            />
          </span>
        ))}
      </div>

      <div className={styles.titleBlock}>
        <h1 className={styles.title}>Ramp SWE-Bench</h1>
        <p className={styles.subtitle}>
          Evaluating background coding agents on financial SWE work
        </p>
      </div>

      <div className={styles.figure}>
        <img
          className={styles.figureImg}
          src="/swebench/hero-typewriter-loop.webp"
          alt="A figure with a vacuum-tube head typing at a typewriter"
        />
        <img
          className={styles.statuette}
          src="/swebench/hero-desk-ramp-statuette.webp"
          alt=""
          aria-hidden="true"
        />
      </div>

      <button
        type="button"
        className={styles.scroll}
        aria-label="Scroll to content"
        onClick={scrollToContent}
      >
        <ChevronDown />
      </button>
    </section>
  );
}
