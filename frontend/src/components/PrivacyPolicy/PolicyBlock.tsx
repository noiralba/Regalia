import type { ReactNode } from "react";
import "./Policy.scss";

type SectionProps = { title: string; children: ReactNode };

export default function PolicyBlock({ title, children }: SectionProps) {
  return (
    <article className="privacy-policy__block">
      <h3 className="privacy-policy__block-title">{title}</h3>
      {children}
    </article>
  );
}
