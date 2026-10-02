"use client";
import { useEffect, useState } from "react";
import { useCategories } from "@/providers/category-provider";
import { useDishes } from "@/providers/dish-provider";
import { errorMessage } from "@/app/_api/api";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { FieldError } from "@/app/(auth)/_components/field-error";
import { ImageUpload } from "./image-upload";

function validate(v) {
  const errors = {};
  if (!v.name.trim()) errors.name = "Food name is required";
  const price = Number(v.price);
  if (v.price === "" || !Number.isFinite(price) || price <= 0) errors.price = "Price must be a number above 0";
  if (!v.category) errors.category = "Choose a category";
  if (v.image.trim() && !/^https?:\/\/\S+$/.test(v.image.trim())) errors.image = "Enter a link starting with http:// or https://";
  return errors;
}

const empty = (categoryId) => ({ name: "", price: "", ingredients: "", category: categoryId || "", image: "" });

export function DishFormDialog({ open, onClose, dish, defaultCategoryId }) {
  const { categories } = useCategories();
  const { addDish, updateDish } = useDishes();
  const editing = !!dish;

  const [values, setValues] = useState(empty(defaultCategoryId));
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setSubmitted(false);
    setServerError("");
    setSaving(false);
    setValues(
      dish
        ? {
            name: dish.name,
            price: String(dish.price),
            ingredients: (dish.ingredients || []).join(", "),
            category: dish.category?._id || "",
            image: dish.image || "",
          }
        : empty(defaultCategoryId)
    );
  }, [open, dish, defaultCategoryId]);

  const errors = submitted ? validate(values) : {};
  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    setServerError("");
    if (Object.keys(validate(values)).length) return;

    const payload = {
      name: values.name.trim(),
      price: Number(values.price),
      ingredients: values.ingredients,
      category: values.category,
      image: values.image.trim(),
    };

    setSaving(true);
    try {
      if (editing) await updateDish(dish._id, payload);
      else await addDish(payload);
      onClose();
    } catch (err) {
      setServerError(errorMessage(err));
      setSaving(false);
    }
  }

  const categoryName = categories.find((c) => c._id === values.category)?.categoryName;
  const title = editing ? "Edit dish" : categoryName ? `Add dish to ${categoryName}` : "Add dish";

  return (
    <Dialog open={open} onClose={saving ? () => {} : onClose} title={title}>
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <div>
          <Label htmlFor="dish-name">Food name</Label>
          <Input id="dish-name" value={values.name} onChange={set("name")} error={!!errors.name} />
          <FieldError message={errors.name} />
        </div>

        <div>
          <Label htmlFor="dish-price">Price</Label>
          <Input
            id="dish-price"
            inputMode="decimal"
            value={values.price}
            onChange={set("price")}
            error={!!errors.price}
          />
          <FieldError message={errors.price} />
        </div>

        <div>
          <Label htmlFor="dish-ingredients">Ingredients</Label>
          <Input
            id="dish-ingredients"
            placeholder="Separate with commas"
            value={values.ingredients}
            onChange={set("ingredients")}
          />
        </div>

        <div>
          <Label htmlFor="dish-category">Category</Label>
          <Select id="dish-category" value={values.category} onChange={set("category")} error={!!errors.category}>
            <option value="">Choose a category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.categoryName}
              </option>
            ))}
          </Select>
          <FieldError message={errors.category} />
        </div>

        <ImageUpload
          value={values.image}
          onChange={(url) => setValues((v) => ({ ...v, image: url }))}
          error={errors.image}
        />

        <FieldError message={serverError} />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
