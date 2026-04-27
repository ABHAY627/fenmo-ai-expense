import { formatRupees } from "../money";

import { Wallet } from "lucide-react";

export function TotalBar({
  count,
  totalPaise,
}: {
  count: number;
  totalPaise: number;
}) {
  return (
    <div className="totalBar card">
      <div className="total-label">
        <Wallet size={24} className="accent-color" style={{ color: "#34d399" }} />
        <span className="muted">
          Showing {count} {count === 1 ? "expense" : "expenses"}
        </span>
      </div>
      <div className="total-amount">{formatRupees(totalPaise)}</div>
    </div>
  );
}
