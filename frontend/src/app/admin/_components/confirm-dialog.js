"use client";
import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function ConfirmDialog({ open, title, description, confirmLabel = "Delete", onConfirm, onClose }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function confirm() {
    setBusy(true);
    setError("");
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong. Try again");
    } finally {
      setBusy(false);
    }
  }

  function close() {
    setError("");
    onClose();
  }

  return (
    <Dialog open={open} onClose={close} title={title}>
      {description && <p className="mb-4 text-sm text-slate-600">{description}</p>}
      {error && <p className="mb-3 text-[13px] text-red-600">{error}</p>}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={close} disabled={busy}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={confirm} disabled={busy}>
          {busy ? "Deleting…" : confirmLabel}
        </Button>
      </div>
    </Dialog>
  );
}
