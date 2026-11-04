import type { CSSProperties } from "react";
import { Link } from "react-router";
import { adminNav } from "../layout/adminNav";

// Byggs automatiskt från adminNav: alla menyval med en quickAction får ett kort här
export default function QuickActions() {
  const actions = adminNav.filter((item) => item.quickAction);

  return (
    <section className="admin-panel" aria-labelledby="quick-actions">
      <div className="admin-panel-header">
        <h2 id="quick-actions">Snabbåtgärder</h2>
      </div>

      <div className="admin-quick-grid">
        {actions.map(({ key, path, icon: Icon, tone, quickAction }) => (
          <Link
            key={key}
            to={path}
            className="admin-quick"
            style={{ "--tone": tone } as CSSProperties}
          >
            <Icon size={34} aria-hidden="true" />
            <span className="admin-quick-title">{quickAction?.title}</span>
            <span className="admin-quick-hint">{quickAction?.hint}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
