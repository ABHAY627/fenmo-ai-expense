import { CATEGORIES, type Category } from "../schemas";

export type FiltersState = {
  category?: Category;
  sort: "date_desc" | "date_asc";
};

export function Filters({
  value,
  onChange,
}: {
  value: FiltersState;
  onChange: (next: FiltersState) => void;
}) {
  return (
    <div className="filters">
      <div className="filter-group">
        <button
          className={`filter-btn ${!value.category ? "active" : ""}`}
          onClick={() => onChange({ ...value, category: undefined })}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className={`filter-btn ${value.category === c ? "active" : ""}`}
            onClick={() => onChange({ ...value, category: c })}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="filter-group" style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
        <button
          className={`filter-btn ${value.sort === "date_desc" ? "active" : ""}`}
          onClick={() => onChange({ ...value, sort: "date_desc" })}
        >
          Newest First
        </button>
        <button
          className={`filter-btn ${value.sort === "date_asc" ? "active" : ""}`}
          onClick={() => onChange({ ...value, sort: "date_asc" })}
        >
          Oldest First
        </button>
      </div>
    </div>
  );
}
