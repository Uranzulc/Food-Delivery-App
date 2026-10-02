"use client";
import { useState } from "react";
import { useCategories } from "@/providers/category-provider";
import { useDishes } from "@/providers/dish-provider";
import { errorMessage } from "@/app/_api/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldError } from "@/app/(auth)/_components/field-error";
import { ConfirmDialog } from "../../_components/confirm-dialog";
import { cn } from "@/lib/utils";

function validateName(name) {
  const n = name.trim();
  if (!n) return "Name is required";
  if (n.length < 2 || n.length > 30) return "Name must be 2–30 characters";
  return "";
}

export function CategorySidebar({ selectedId, onSelect }) {
  const { categories, loading, error, addCategory, renameCategory, deleteCategory } = useCategories();
  const { dishes } = useDishes();

  const [newName, setNewName] = useState("");
  const [addSubmitted, setAddSubmitted] = useState(false);
  const [addServerError, setAddServerError] = useState("");
  const [adding, setAdding] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editSubmitted, setEditSubmitted] = useState(false);
  const [editServerError, setEditServerError] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const [toDelete, setToDelete] = useState(null);

  const countFor = (id) => dishes.filter((d) => d.category?._id === id).length;

  const addError = addSubmitted ? validateName(newName) || addServerError : "";
  const editError = editSubmitted ? validateName(editName) || editServerError : "";

  async function onAdd(e) {
    e.preventDefault();
    setAddSubmitted(true);
    setAddServerError("");
    if (validateName(newName)) return;
    setAdding(true);
    try {
      await addCategory(newName.trim());
      setNewName("");
      setAddSubmitted(false);
    } catch (err) {
      setAddServerError(errorMessage(err));
    } finally {
      setAdding(false);
    }
  }

  function startEdit(c) {
    setEditingId(c._id);
    setEditName(c.categoryName);
    setEditSubmitted(false);
    setEditServerError("");
  }

  async function onSaveEdit(e) {
    e.preventDefault();
    setEditSubmitted(true);
    setEditServerError("");
    if (validateName(editName)) return;
    setSavingEdit(true);
    try {
      await renameCategory(editingId, editName.trim());
      setEditingId(null);
    } catch (err) {
      setEditServerError(errorMessage(err));
    } finally {
      setSavingEdit(false);
    }
  }

  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold">Categories</h2>

      {error && <p className="mb-2 text-[13px] text-red-600">{error}</p>}
      {loading && <p className="text-sm text-slate-500">Loading…</p>}

      <ul className="space-y-1">
        <li>
          <button
            onClick={() => onSelect(null)}
            className={cn(
              "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm",
              selectedId === null ? "bg-slate-900 text-white" : "hover:bg-slate-100"
            )}
          >
            <span>All</span>
            <span>{dishes.length}</span>
          </button>
        </li>

        {categories.map((c) => (
          <li key={c._id}>
            {editingId === c._id ? (
              <form onSubmit={onSaveEdit} noValidate className="space-y-2 rounded-md border border-slate-200 p-2">
                <Input value={editName} onChange={(e) => setEditName(e.target.value)} error={!!editError} autoFocus />
                <FieldError message={editError} />
                <div className="flex gap-2">
                  <Button type="submit" size="sm" disabled={savingEdit}>
                    {savingEdit ? "Saving…" : "Save"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingId(null)} disabled={savingEdit}>
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div
                className={cn(
                  "flex items-center justify-between rounded-md pr-1",
                  selectedId === c._id ? "bg-slate-900 text-white" : "hover:bg-slate-100"
                )}
              >
                <button onClick={() => onSelect(c._id)} className="flex-1 truncate px-3 py-2 text-left text-sm">
                  {c.categoryName} <span className="opacity-70">{countFor(c._id)}</span>
                </button>
                <button
                  onClick={() => startEdit(c)}
                  className="rounded px-1.5 py-1 text-xs underline-offset-2 hover:underline"
                >
                  Rename
                </button>
                <button
                  onClick={() => setToDelete(c)}
                  className="rounded px-1.5 py-1 text-xs underline-offset-2 hover:underline"
                >
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      <form onSubmit={onAdd} noValidate className="mt-4 space-y-2">
        <div className="flex gap-2">
          <Input
            placeholder="New category"
            value={newName}
            onChange={(e) => {
              setNewName(e.target.value);
              setAddServerError("");
            }}
            error={!!addError}
          />
          <Button type="submit" disabled={adding}>
            {adding ? "Adding…" : "Add"}
          </Button>
        </div>
        <FieldError message={addError} />
      </form>

      <ConfirmDialog
        open={!!toDelete}
        title={toDelete ? `Delete "${toDelete.categoryName}"?` : ""}
        description="This removes the category. It can't be undone."
        onClose={() => setToDelete(null)}
        onConfirm={async () => {
          await deleteCategory(toDelete._id);
          if (selectedId === toDelete._id) onSelect(null);
        }}
      />
    </section>
  );
}
