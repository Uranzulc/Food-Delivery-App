// Shared by the category controllers.
export const cleanName = (body) => String(body.name ?? body.categoryName ?? "").trim();

export const validateName = (name) => {
  if (!name) return "Name is required";
  if (name.length < 2 || name.length > 30) return "Name must be 2–30 characters";
  return null;
};
