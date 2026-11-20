import type { CSSProperties } from "react";
import type { IconType } from "react-icons";

export type Stat = {
  label: string;
  value: number | undefined; // undefined visas som "–" (laddar)
  icon: IconType;
  tone: string; // färg på ikonen
};

export default function StatCards({ stats }: { stats: Stat[] }) {
  return (
    <section className="admin-stats" aria-label="Nyckeltal">
      {stats.map(({ label, value, icon: Icon, tone }) => (
        <div
          key={label}
          className="admin-stat"
          style={{ "--tone": tone } as CSSProperties}
        >
          <span className="admin-stat-icon">
            <Icon size={26} aria-hidden="true" />
          </span>
          <div>
            <span className="admin-stat-label">{label}</span>
            <span className="admin-stat-value">{value ?? "–"}</span>
          </div>
        </div>
      ))}
    </section>
  );
}
