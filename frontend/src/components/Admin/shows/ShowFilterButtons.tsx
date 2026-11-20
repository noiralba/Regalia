import { Button, ButtonGroup } from "react-bootstrap";
import type { ShowFilter } from "./showUtils";

const FILTERS: { key: ShowFilter; label: string }[] = [
  { key: "upcoming", label: "Kommande" },
  { key: "past", label: "Tidigare" },
  { key: "all", label: "Alla" },
];

export default function ShowFilterButtons({
  value,
  onChange,
}: {
  value: ShowFilter;
  onChange: (filter: ShowFilter) => void;
}) {
  return (
    <ButtonGroup aria-label="Filtrera visningar">
      {FILTERS.map(({ key, label }) => (
        <Button
          key={key}
          size="sm"
          variant={value === key ? "primary" : "outline-secondary"}
          onClick={() => onChange(key)}
        >
          {label}
        </Button>
      ))}
    </ButtonGroup>
  );
}
