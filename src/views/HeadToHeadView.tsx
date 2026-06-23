import { useMemo, useState } from "react";
import { buildHeadToHead } from "../data/headToHead";
import { models, modelsById } from "../data/models";
import { MatchupSelector } from "./headtohead/MatchupSelector";
import { Takeaways } from "./headtohead/Takeaways";
import { WorkStyle } from "./headtohead/WorkStyle";
import { StatsGrid } from "./headtohead/StatsGrid";
import { Distributions } from "./headtohead/Distributions";
import { Outcomes } from "./headtohead/Outcomes";
import { Traces } from "./headtohead/Traces";
import styles from "./HeadToHeadView.module.css";

const DEFAULT_LEFT = "gpt-5-4";
const DEFAULT_RIGHT = "opus-4-6";

export function HeadToHeadView() {
  const [leftId, setLeftId] = useState(DEFAULT_LEFT);
  const [rightId, setRightId] = useState(DEFAULT_RIGHT);

  const detail = useMemo(
    () => buildHeadToHead(leftId, rightId),
    [leftId, rightId],
  );
  const left = modelsById[detail.leftId];
  const right = modelsById[detail.rightId];
  const leftName = shortName(left.name);
  const rightName = shortName(right.name);

  return (
    <section className={styles.view}>
      <MatchupSelector
        models={models}
        leftId={leftId}
        rightId={rightId}
        onSelectLeft={setLeftId}
        onSelectRight={setRightId}
      />
      <div className={styles.main}>
        <Takeaways items={detail.takeaways} />
        <WorkStyle
          leftName={leftName}
          rightName={rightName}
          left={detail.workStyle.left}
          right={detail.workStyle.right}
        />
        <StatsGrid
          leftName={leftName}
          rightName={rightName}
          stats={detail.stats}
        />
        <Distributions
          leftName={left.name}
          rightName={right.name}
          distributions={detail.distributions}
        />
        <Outcomes
          leftName={leftName}
          rightName={rightName}
          outcomes={detail.outcomes}
          sharedMisses={detail.sharedMisses}
        />
        <Traces traces={detail.traces} />
      </div>
    </section>
  );
}

function shortName(name: string): string {
  return name.replace(/^Claude\s+/, "");
}
