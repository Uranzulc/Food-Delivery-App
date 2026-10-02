"use client";
import { useState } from "react";
import { Select } from "@/components/ui/select";
import { errorMessage } from "@/app/_api/api";

const STATUSES = ["PENDING", "DELIVERED", "CANCELED"];

export function StatusSelect({ value, onChange }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function change(e) {
    setBusy(true);
    setError("");
    try {
      await onChange(e.target.value);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <Select value={value} onChange={change} disabled={busy} className="h-8 w-36">
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </Select>
      {error && <p className="mt-1 text-[13px] text-red-600">{error}</p>}
    </div>
  );
}
