import { useRef, useState, type FormEvent } from "react";
import { v4 as uuid } from "uuid";
import { IndianRupee, Tag, Calendar, PenLine, Plus } from "lucide-react";
import {
  CATEGORIES,
  CreateExpenseFormSchema,
  type Category,
} from "../schemas";
import { useCreateExpense } from "../hooks";
import { ApiError } from "../api";

function todayIso(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function ExpenseForm() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(todayIso());
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  // one key per submission attempt; retries reuse it, success rotates it.
  const keyRef = useRef<string>(uuid());

  const create = useCreateExpense();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setApiError(null);

    const parsed = CreateExpenseFormSchema.safeParse({
      amount,
      category,
      description,
      date,
    });

    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = (issue.path[0] as string) || "_";
        if (!errs[key]) errs[key] = issue.message;
      }
      setFieldErrors(errs);
      return;
    }
    setFieldErrors({});

    create.mutate(
      {
        payload: {
          amount: parsed.data.amount,
          category: parsed.data.category,
          description: parsed.data.description,
          date: parsed.data.date,
        },
        idempotencyKey: keyRef.current,
      },
      {
        onSuccess: () => {
          setAmount("");
          setCategory("");
          setDescription("");
          setDate(todayIso());
          keyRef.current = uuid();
        },
        onError: (err) => {
          if (err instanceof ApiError) {
            if (err.payload.fields) {
              setFieldErrors(err.payload.fields);
            } else {
              setApiError(err.payload.message);
            }
          } else {
            setApiError("couldn't save — check your connection and try again");
          }
        },
      }
    );
  }

  const pending = create.isPending;

  return (
    <form className="card form" onSubmit={handleSubmit} noValidate>
      <div className="row">
        <label className="field">
          <span>Amount (₹)</span>
          <div className="input-wrapper">
            <IndianRupee className="input-icon" size={18} />
            <input
              className="has-icon"
              type="text"
            inputMode="decimal"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={pending}
            aria-invalid={!!fieldErrors.amount}
            />
          </div>
          {fieldErrors.amount && (
            <span className="err">{fieldErrors.amount}</span>
          )}
        </label>

        <label className="field">
          <span>Category</span>
          <div className="input-wrapper">
            <Tag className="input-icon" size={18} />
            <select
              className="has-icon"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category | "")}
            disabled={pending}
            aria-invalid={!!fieldErrors.category}
          >
            <option value="">— pick one —</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
            </select>
          </div>
          {fieldErrors.category && (
            <span className="err">{fieldErrors.category}</span>
          )}
        </label>

        <label className="field">
          <span>Date</span>
          <div className="input-wrapper">
            <Calendar className="input-icon" size={18} />
            <input
              className="has-icon"
              type="date"
              value={date}
            onChange={(e) => setDate(e.target.value)}
            disabled={pending}
            aria-invalid={!!fieldErrors.date}
            />
          </div>
          {fieldErrors.date && <span className="err">{fieldErrors.date}</span>}
        </label>
      </div>

      <label className="field">
        <span>Description</span>
        <div className="input-wrapper">
          <PenLine className="input-icon" size={18} />
          <input
            className="has-icon"
            type="text"
            placeholder="What was it for?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={pending}
          maxLength={500}
          />
        </div>
        {fieldErrors.description && (
          <span className="err">{fieldErrors.description}</span>
        )}
      </label>

      {apiError && <div className="banner err">{apiError}</div>}

      <div className="actions">
        <button type="submit" className="btn primary" disabled={pending}>
          {pending ? "Saving..." : (
            <>
              <Plus size={18} /> Add Expense
            </>
          )}
        </button>
      </div>
    </form>
  );
}
