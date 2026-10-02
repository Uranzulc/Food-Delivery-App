"use client";
import { useState } from "react";
import { useCategories } from "@/providers/category-provider";
import { useDishes } from "@/providers/dish-provider";
import { Button } from "@/components/ui/button";
import { DishCard } from "../_components/dish-card";
import { DishFormDialog } from "./dish-form-dialog";
import { ConfirmDialog } from "../../_components/confirm-dialog";

export function DishGrid({ categoryId }) {
  const { categories } = useCategories();
  const { dishes, loading, error, deleteDish } = useDishes();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(undefined);
  const [toDelete, setToDelete] = useState(null);

  const shown = categoryId ? dishes.filter((d) => d.category?._id === categoryId) : dishes;
  const current = categories.find((c) => c._id === categoryId);

  function openAdd() {
    setEditing(undefined);
    setDialogOpen(true);
  }
  function openEdit(dish) {
    setEditing(dish);
    setDialogOpen(true);
  }

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {current ? current.categoryName : "All dishes"} ({shown.length})
        </h2>
        <Button onClick={openAdd} disabled={categories.length === 0}>
          + Add dish
        </Button>
      </div>

      {categories.length === 0 && <p className="mb-3 text-sm text-slate-600">Add a category first, then add dishes.</p>}
      {error && <p className="mb-2 text-[13px] text-red-600">{error}</p>}
      {loading && <p className="text-sm text-slate-500">Loading…</p>}
      {!loading && shown.length === 0 && categories.length > 0 && (
        <p className="text-sm text-slate-600">No dishes yet. Click “+ Add dish”.</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {shown.map((d) => (
          <DishCard key={d._id} dish={d} onEdit={openEdit} onDelete={setToDelete} />
        ))}
      </div>

      <DishFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        dish={editing}
        defaultCategoryId={categoryId}
      />

      <ConfirmDialog
        open={!!toDelete}
        title={toDelete ? `Delete "${toDelete.name}"?` : ""}
        description="This removes the dish for everyone. It can't be undone."
        onClose={() => setToDelete(null)}
        onConfirm={() => deleteDish(toDelete._id)}
      />
    </section>
  );
}
