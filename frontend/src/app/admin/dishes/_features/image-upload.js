"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/app/(auth)/_components/field-error";

export function ImageUpload({ value, onChange, error }) {
  return (
    <div>
      <Label htmlFor="dish-image">Image URL</Label>
      <Input
        id="dish-image"
        placeholder="https://..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        error={!!error}
      />
      <FieldError message={error} />
      {value && !error && (
        <img src={value} alt="" className="mt-2 h-16 w-16 rounded-md object-cover" />
      )}
    </div>
  );
}
