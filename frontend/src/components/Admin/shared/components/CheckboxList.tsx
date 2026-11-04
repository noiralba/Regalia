import { useState } from "react";
import { Form } from "react-bootstrap";

type Props = {
  idPrefix: string; // gör varje kryssrutas id unikt, t.ex. "movie-category"
  items: { id: string; label: string }[];
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
  /** "inline" = kryssrutor bredvid varandra, "scroll" = lista med eget rullningsfält + sökruta */
  layout?: "inline" | "scroll";
};

// Lista med kryssrutor där man väljer flera objekt (kategorier, filmer i ett tema ...)
export default function CheckboxList({
  idPrefix,
  items,
  selectedIds,
  onChange,
  layout = "inline",
}: Props) {
  const [filter, setFilter] = useState("");
  const isScroll = layout === "scroll";

  const visibleItems = isScroll
    ? items.filter((item) =>
        item.label.toLowerCase().includes(filter.trim().toLowerCase()),
      )
    : items;

  const toggle = (id: string) =>
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter((selectedId) => selectedId !== id)
        : [...selectedIds, id],
    );

  return (
    <>
      {isScroll && (
        <Form.Control
          type="search"
          size="sm"
          className="mb-2"
          placeholder="Filtrera..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      )}

      <div
        className={isScroll ? "border rounded p-2" : "d-flex flex-wrap gap-3"}
        style={isScroll ? { maxHeight: "220px", overflowY: "auto" } : undefined}
      >
        {visibleItems.length === 0 ? (
          <span className="text-secondary small">Inget hittades.</span>
        ) : (
          visibleItems.map((item) => (
            <Form.Check
              key={item.id}
              type="checkbox"
              id={`${idPrefix}-${item.id}`}
              label={item.label}
              checked={selectedIds.includes(item.id)}
              onChange={() => toggle(item.id)}
            />
          ))
        )}
      </div>
    </>
  );
}
