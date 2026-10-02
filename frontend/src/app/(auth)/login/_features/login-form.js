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
import Image from "next/image";

function validate({ email, password }) {
  const errors = {};
  if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) errors.email = "Enter a valid email";
  if (!password) errors.password = "Password is required";
  return errors;
}

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [values, setValues] = useState({ email: "", password: "" });
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");
  const [saving, setSaving] = useState(false);

  const errors = submitted ? validate(values) : {};
  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    setServerError("");
    if (Object.keys(validate(values)).length) return;

    setSaving(true);
    try {
      const user = await login({ email: values.email.trim(), password: values.password });
      router.push(user.role === "ADMIN" ? "/admin/dishes" : "/");
    } catch (err) {
      setServerError(errorMessage(err));
      setSaving(false);
    }
  }

  return (
<div>    <form onSubmit={onSubmit} noValidate className="w-full max-w-sm space-y-4">
      <h1 className="text-2xl font-semibold">Log in</h1>

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

      <FieldError message={serverError} />

      <Button type="submit" className="w-full" disabled={saving}>
        {saving ? "Logging in…" : "Log in"}
      </Button>

      <p className="text-center text-sm text-slate-600">
        No account?{" "}
        <Link href="/signup" className="font-medium underline">
          Sign up
        </Link>
      </p>
    </form>
 
  </div>
  );
}
