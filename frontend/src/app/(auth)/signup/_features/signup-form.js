"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { errorMessage } from "@/app/_api/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "../../_components/field-error";

function validate({ email, password, confirm }) {
  const errors = {};
  if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) errors.email = "Enter a valid email";
  if (password.length < 8) errors.password = "At least 8 characters";
  if (confirm !== password) errors.confirm = "Passwords don't match";
  return errors;
}

export function SignupForm() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [values, setValues] = useState({ email: "", password: "", confirm: "" });
  const [submitted, setSubmitted] = useState(false);
  const [serverErrors, setServerErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const errors = submitted ? { ...validate(values), ...serverErrors } : {};
  const set = (key) => (e) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    setServerErrors({});
  };

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    setServerErrors({});
    if (Object.keys(validate(values)).length) return;

    setSaving(true);
    try {
      await signUp({ email: values.email.trim(), password: values.password });
      router.push("/login");
    } catch (err) {
      const message = errorMessage(err);
      if (err?.response?.status === 409) setServerErrors({ email: "This email already has an account" });
      else setServerErrors({ form: message });
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="w-full max-w-sm space-y-4">
      <h1 className="text-2xl font-semibold">Create account</h1>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={values.email} onChange={set("email")} error={!!errors.email} />
        <FieldError message={errors.email} />
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={values.password}
          onChange={set("password")}
          error={!!errors.password}
        />
        <FieldError message={errors.password} />
      </div>

      <div>
        <Label htmlFor="confirm">Confirm password</Label>
        <Input
          id="confirm"
          type="password"
          value={values.confirm}
          onChange={set("confirm")}
          error={!!errors.confirm}
        />
        <FieldError message={errors.confirm} />
      </div>

      <FieldError message={errors.form} />

      <Button type="submit" className="w-full" disabled={saving}>
        {saving ? "Creating account…" : "Sign up"}
      </Button>

      <p className="text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link href="/login" className="font-medium underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
