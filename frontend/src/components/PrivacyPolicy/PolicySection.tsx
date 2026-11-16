import type { ReactNode } from "react";

type SectionProps = { title: string; children: ReactNode; };
type PolicySectionProps = SectionProps & { defaultOpen?: boolean };

export default function PolicySection({ title, children, defaultOpen = false }: PolicySectionProps) {
  return (
    <details className="privacy-policy__section" open={defaultOpen}>
      <summary className="privacy-policy__summary">
        <h2 className="privacy-policy__section-title">{title}</h2>
      </summary>
      <article className="privacy-policy__section-content">{children}</article>
    </details>
  );
}