"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Alert, Button, Card, Input } from "@heroui/react";
import { FcGoogle } from "react-icons/fc";
import { ALLOWED_SIGNUP_ROLES } from "@/lib/user-roles";

import { signIn } from "@/lib/auth-client";
import { toast } from "@heroui/react";

export default function SignInPage() {
  const router = useRouter();
  const [callbackUrl, setCallbackUrl] = useState(null);
  const [role, setRole] = useState(null);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setCallbackUrl(params.get("callbackUrl"));
    const roleParam = params.get("role");
    if (roleParam && ALLOWED_SIGNUP_ROLES.includes(roleParam)) {
      setRole(roleParam);
    }
  }, []);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setGoogleLoading(true);

    try {
      let finalCallback = callbackUrl || "/";
    if (role) {
      const separator = finalCallback.includes("?") ? "&" : "?";
      finalCallback = `${finalCallback}${separator}role=${role}`;
    }
    const response = await signIn.social({
        provider: "google",
        callbackURL: finalCallback,
      });

      if (response?.error) {
        setError(
          response.error.message ||
            response.error.statusText ||
            "Failed to sign in with Google"
        );
        setGoogleLoading(false);
      }
    } catch (err) {
      setError(err?.message || "Something went wrong while signing in with Google");
      setGoogleLoading(false);
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await signIn.email({
        email: form.email.trim(),
        password: form.password,
      });

      if (response?.error) {
        setError(
          response.error.message ||
            response.error.statusText ||
            "Invalid email or password"
        );
        toast.error(response.error.message || response.error.statusText || "Invalid email or password");
        return;
      }

      toast.success("Signed in successfully!");
      router.push(callbackUrl || "/");
      router.refresh();
    } catch (err) {
      setError(
        err?.message ||
          "Something went wrong while signing in"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="grid min-h-[calc(100vh-80px)] w-full place-items-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 dark:from-black dark:via-slate-950 dark:to-black">
      <Card className="w-full max-w-[380px] border border-slate-200 p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">

        {/* Logo */}
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
            <img
              src="/images/company.png"
              alt="TradeHub Logo"
              className="h-14 w-14 object-contain"
            />
          </div>

          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Welcome Back
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Sign in to your TradeHub account
          </p>
        </div>

        {/* Error */}
        {error && (
          <Alert
            className="mb-4"
            color="danger"
            title={error}
          />
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <Input
            className="w-full"
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            variant="bordered"
            size="lg"
          />

          <Input
            className="w-full"
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter password"
            variant="bordered"
            size="lg"
          />

          <Button
            type="submit"
            color="primary"
            size="lg"
            className="w-full font-semibold"
            isLoading={loading}
          >
            Sign In
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">
            Don't have an account?
          </p>

          <Link
            href="/auth/signup"
            className="mt-1 inline-block font-semibold text-blue-600 hover:text-blue-700"
          >
            Create Account
          </Link>
        </div>

        {/* Divider */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800" />
          </div>
          <div className="relative bg-white px-3 text-xs uppercase text-slate-400 dark:bg-slate-900 font-medium">
            Or continue with
          </div>
        </div>

        {/* Google Sign In */}
        <Button
          type="button"
          variant="bordered"
          size="lg"
          className="w-full font-semibold border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2"
          onClick={handleGoogleSignIn}
          isLoading={googleLoading}
          isDisabled={loading}
        >
          {!googleLoading && <FcGoogle className="text-xl shrink-0" />}
          <span>Continue with Google</span>
        </Button>
      </Card>
    </section>
  );
}