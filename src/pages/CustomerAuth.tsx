import { useLocation, Link } from "wouter";
import { ArrowRight, Coffee, LockKeyhole, UserRound } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState, type FormEvent } from "react";
import { authenticateCustomer } from "@/api/customerAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CustomerAuth() {
  const [location, setLocation] = useLocation();
  const isRegister = location === "/register";
  const isAccountChoice = location === "/login";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { setError(""); }, [location]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    const data = new FormData(event.currentTarget);
    const username = String(data.get("username") || "").trim();
    const password = String(data.get("password") || "");
    if (isRegister && password !== data.get("confirmPassword")) {
      setError("Passwords do not match.");
      return;
    }
    if (new TextEncoder().encode(password).length > 72) {
      setError("Your password must contain at most 72 UTF-8 bytes.");
      return;
    }
    setIsSubmitting(true);
    setError("");
    try {
      await authenticateCustomer(isRegister ? "register" : "login", {
        username, password, ...(isRegister ? { email: String(data.get("email") || "").trim() } : {}),
      });
      toast.success(isRegister ? "Your account is ready. Welcome to DnD Cafe!" : "Welcome back!");
      setLocation("/chat");
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Unable to sign in. Please try again.");
    } finally { setIsSubmitting(false); }
  }

  if (isAccountChoice) {
    return (
      <section className="flex min-h-[42vh] items-center justify-center bg-[#fff7fa] px-5 py-16">
        <div className="flex w-full max-w-[570px] flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
          <Link
            href="/register"
            className="inline-flex min-h-[66px] w-full items-center justify-center rounded-full border border-[#f0e5e9] bg-white px-8 text-center text-base font-semibold text-[#24191d] transition-all hover:border-[#ff8cab] hover:bg-white/80 sm:w-auto sm:flex-1"
          >
            Create my profile

          </Link>
          <Link
            href="/signin"
            className="inline-flex min-h-[66px] w-full items-center justify-center rounded-full border border-[#f0e5e9] bg-white px-8 text-center text-base font-semibold text-[#24191d] transition-all hover:border-[#ff8cab] hover:bg-white/80 sm:w-auto sm:flex-[1.15]"
          >
            I already have an account
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="relative flex min-h-[78vh] items-center justify-center overflow-hidden px-5 py-16 md:px-8">
      <div className="pointer-events-none absolute -left-24 top-12 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-border bg-white shadow-xl md:grid-cols-[0.9fr_1.1fr]">
        <aside className="relative hidden min-h-[580px] flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground md:flex">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-primary-foreground/10" />
          <div className="absolute -bottom-24 -left-20 h-80 w-80 rounded-full border border-primary-foreground/10" />
          <div className="relative flex items-center gap-3 text-accent">
            <Coffee size={23} />
            <span className="text-sm font-semibold uppercase tracking-[0.22em]">DnD Cafe</span>
          </div>
          <div className="relative">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-accent">
              A little moment for you
            </p>
            <h1 className="max-w-sm text-4xl leading-tight">
              {isRegister ? "Make yourself at home." : "Good to see you again."}
            </h1>
            <p className="mt-5 max-w-sm leading-relaxed text-primary-foreground/70">
              {isRegister
                ? "Create an account to stay close to the latest happenings at DnD Cafe."
                : "Sign in to your DnD Cafe account and pick up where you left off."}
            </p>
          </div>
          <p className="relative text-sm text-primary-foreground/50">
            Diriye & Delights · Etobicoke, Ontario
          </p>
        </aside>

        <div className="p-7 sm:p-10 md:p-12">
          <div className="mb-9 md:hidden">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">DnD Cafe</p>
          </div>

          <div className="mb-8">
            <p className="mb-2 text-sm font-medium text-accent">
              {isRegister ? "Join our community" : "Welcome back"}
            </p>
            <h2 className="text-3xl text-primary">
              {isRegister ? "Create your account" : "Sign in"}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {isRegister
                ? "A few details and you're all set."
                : "Enter your details to access your account."}
            </p>
          </div>

          {error && <p role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="customer-username">
                {isRegister ? "Username" : "Username or email"}
              </Label>
              <div className="relative">
                <UserRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  id="customer-username"
                  name="username" maxLength={isRegister ? 80 : 254}
                  autoComplete="username"
                  placeholder={isRegister ? "Your username" : "Your username or email"}
                  className="h-12 pl-11"
                  required
                />
              </div>
            </div>

            {isRegister && (
              <div className="space-y-2">
                <Label htmlFor="customer-email">Email address</Label>
                <Input
                  id="customer-email"
                  name="email" maxLength={254}
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="h-12"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="customer-password">Password</Label>

              </div>
              <div className="relative">
                <LockKeyhole className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  id="customer-password"
                  name="password"
                  type="password"
                  autoComplete={isRegister ? "new-password" : "current-password"}
                  placeholder="At least 8 characters"
                  minLength={8} maxLength={72}
                  className="h-12 pl-11"
                  required
                />
              </div>
            </div>

            {isRegister && (
              <div className="space-y-2">
                <Label htmlFor="customer-confirm-password">Confirm password</Label>
                <Input
                  id="customer-confirm-password"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Enter your password again"
                  minLength={8} maxLength={72}
                  className="h-12"
                  required
                />
              </div>
            )}

            <Button type="submit" disabled={isSubmitting} aria-busy={isSubmitting} className="h-12 w-full rounded-full text-sm">
              {isSubmitting ? "Please wait..." : isRegister ? "Create account" : "Sign in"}
              <ArrowRight className="ml-2" size={17} />
            </Button>
          </form>

          <p className="mt-7 text-center text-sm text-muted-foreground">
            {isRegister ? "Already have an account?" : "New to DnD Cafe?"}{" "}
            <Link
              href={isRegister ? "/signin" : "/register"}
              className="font-semibold text-primary underline-offset-4 hover:text-accent hover:underline"
            >
              {isRegister ? "Sign in" : "Create an account"}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
