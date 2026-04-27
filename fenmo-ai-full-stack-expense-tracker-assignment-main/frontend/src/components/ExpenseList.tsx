import type { Expense } from "../api";
import { formatRupees } from "../money";

import { ShoppingCart, Utensils, Plane, Zap, HelpCircle } from "lucide-react";

function CategoryIcon({ category }: { category: string }) {
  switch (category) {
    case "Food":
      return <Utensils size={20} className="expense-icon-box food" />;
    case "Travel":
      return <Plane size={20} className="expense-icon-box travel" />;
    case "Bills":
      return <Zap size={20} className="expense-icon-box bills" />;
    case "Shopping":
      return <ShoppingCart size={20} className="expense-icon-box shopping" />;
    default:
      return <HelpCircle size={20} className="expense-icon-box other" />;
  }
}

export function ExpenseList({
  items,
  isLoading,
  error,
  onRetry,
}: {
  items: Expense[];
  isLoading: boolean;
  error: Error | null;
  onRetry: () => void;
}) {
  if (isLoading && items.length === 0) {
    return (
      <div className="card center muted">
        <Zap size={32} style={{ animation: "pulse 2s infinite" }} />
        Loading expenses...
      </div>
    );
  }

  if (error) {
    return (
      <div className="card center">
        <div className="err">Couldn't load expenses</div>
        <button className="btn" onClick={onRetry} style={{ marginTop: "12px" }}>
          Retry
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="card center muted">
        <ShoppingCart size={40} style={{ opacity: 0.3 }} />
        No expenses match your criteria. Add one above!
      </div>
    );
  }

  return (
    <div className="expense-list-container">
      {items.map((e, index) => (
        <div
          key={e.id}
          className="expense-item glass-card"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <div className="expense-info">
            <CategoryIcon category={e.category} />
            <div className="expense-details">
              <span className="expense-desc">{e.description || "Uncategorized Expense"}</span>
              <span className="expense-date">{e.date}</span>
            </div>
          </div>
          <div className="expense-price">
            {formatRupees(e.amount_paise)}
            <span className={`expense-category-pill ${e.category.toLowerCase()}`}>
              {e.category}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
