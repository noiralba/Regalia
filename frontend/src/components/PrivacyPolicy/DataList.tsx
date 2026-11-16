import type { ReactNode } from "react";
import "./Policy.scss"

type DataListProps = { items: { label: string; value: ReactNode }[] };

export default function DataList({ items }: DataListProps) {
  return (
    <ul className="privacy-policy__list">
      {items.map(({ label, value }) => (
        <li className="privacy-policy__value" key={label}>
          <strong className="privacy-policy__label">{label}:</strong> {value}
        </li>
      ))}
    </ul>
  );
}
