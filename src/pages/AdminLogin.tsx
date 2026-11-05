import { useEffect, useState, type FormEvent } from "react";
import { useLocation } from "wouter";
import { getAdminToken, loginAdmin, saveAdminToken } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (getAdminToken()) {
      setLocation("/admin/events");
    }
  }, [setLocation]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get("username");
    const password = formData.get("password");

    if (typeof username !== "string" || typeof password !== "string") {
      setError("Enter your username and password.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const token = await loginAdmin({ username: username.trim(), password });
      saveAdminToken(token);
      setLocation("/admin/events");
    } catch (loginError: unknown) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : "Unable to log in. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-background px-6 py-16">
      <form
        className="w-full max-w-md space-y-6 rounded-2xl border border-border bg-white p-8 shadow-sm"
        onSubmit={handleSubmit}
      >
        <div className="text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-accent">
            DnD Cafe
          </p>
          <h1 className="font-serif text-3xl text-primary">Admin sign in</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Sign in to manage events and event history.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="admin-username">Username</Label>
          <Input
            id="admin-username"
            name="username"
            autoComplete="username"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="admin-password">Password</Label>
          <Input
            id="admin-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}

        <Button className="w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </section>
  );
}
