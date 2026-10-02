
export function FieldError({ message }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-1 text-[13px] text-red-600">
      {message}
    </p>
  );
}
