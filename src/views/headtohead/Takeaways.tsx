import styles from "./Takeaways.module.css";

interface TakeawaysProps {
  items: string[];
}

export function Takeaways({ items }: TakeawaysProps) {
  return (
    <section className={styles.card}>
      <h2 className={styles.heading}>Key takeaways</h2>
      <ul className={styles.list}>
        {items.map((item, index) => (
          <li key={index} className={styles.item}>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
