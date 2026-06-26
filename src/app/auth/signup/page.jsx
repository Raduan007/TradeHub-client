"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Alert,
  Button,
  Card,
  Fieldset,
  Input,
  Radio,
  RadioGroup,
} from "@heroui/react";

import { signUp } from "@/lib/auth-client";
import {
  ALLOWED_SIGNUP_ROLES,
  DEFAULT_USER_ROLE,
  isAllowedSignupRole,
} from "@/lib/user-roles";

const RULES = [
  {
    id: "length",
    label: "At least 8 characters",
    test: (password) => password.length >= 8,
  },
  {
    id: "upper",
    label: "One uppercase letter",
    test: (password) => /[A-Z]/.test(password),
  },
  {
    id: "lower",
    label: "One lowercase letter",
    test: (password) => /[a-z]/.test(password),
  },
  {
    id: "number",
    label: "One number",
    test: (password) => /\d/.test(password),
  },
];

const initialForm = {
  name: "",
  email: "",
  password: "",
  role: DEFAULT_USER_ROLE,
};

function PasswordHints({ password }) {
  if (!password) return null;

  return (
    <div className="mt-2 space-y-1">
      {RULES.map((rule) => {
        const passed = rule.test(password);

        return (
          <p
            key={rule.id}
            className={`text-xs ${
              passed ? "text-green-600" : "text-gray-400"
            }`}
          >
            {passed ? "✓" : "○"} {rule.label}
          </p>
        );
      })}
    </div>
  );
}

function RoleSelector({ value, onChange }) {
  return (
    <Fieldset className="w-full">
      <Fieldset.Legend className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
        Role
      </Fieldset.Legend>

      <RadioGroup
        value={value}
        onChange={onChange}
        name="role"
        className="flex flex-col gap-3"
      >
        {ALLOWED_SIGNUP_ROLES.map((role) => (
          <Radio key={role} value={role}>
            <Radio.Content className="flex cursor-pointer items-center gap-2">
              <Radio.Control>
                <Radio.Indicator />
              </Radio.Control>
              <span className="text-sm capitalize text-slate-700 dark:text-slate-200">
                {role}
              </span>
            </Radio.Content>
          </Radio>
        ))}
      </RadioGroup>
    </Fieldset>
  );
}

export default function SignUpPage() {
  const router = useRouter();

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleRoleChange = (role) => {
    setForm((current) => ({
      ...current,
      role,
    }));
  };

  const validatePassword = (password) => {
    const failedRule = RULES.find(
      (rule) => !rule.test(password)
    );

    return failedRule ? failedRule.label : null;
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      return "Please enter your name";
    }

    if (!form.email.trim()) {
      return "Please enter your email";
    }

    if (!isAllowedSignupRole(form.role)) {
      return "Please select a valid role";
    }

    const passwordError = validatePassword(form.password);

    if (passwordError) {
      return passwordError;
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const response = await signUp.email({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
      });

      if (response?.error) {
        setError(
          response.error.message ||
            response.error.statusText ||
            "Unable to create account"
        );
        return;
      }

      setSuccess("Account created successfully!");

      setForm(initialForm);

      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (err) {
      setError(
        err?.message ||
          "Something went wrong while creating account"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="grid min-h-[calc(100vh-80px)] w-full place-items-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 dark:from-black dark:via-slate-950 dark:to-black">
      <Card className="w-full max-w-[380px] border border-slate-200 p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
            <img
              src="/images/company.png"
              alt="TradeHub Logo"
              className="h-14 w-14 object-contain"
            />
          </div>

          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Create Account
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Create your TradeHub account
          </p>
        </div>

        {error && (
          <Alert
            className="mb-4"
            color="danger"
            title={error}
          />
        )}

        {success && (
          <Alert
            className="mb-4"
            color="success"
            title={success}
          />
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <Input
            className="w-full"
            label="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="John Doe"
            variant="bordered"
            size="lg"
          />

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

          <RoleSelector
            value={form.role}
            onChange={handleRoleChange}
          />

          <div>
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

            <PasswordHints password={form.password} />
          </div>

          <Button
            type="submit"
            color="primary"
            size="lg"
            className="w-full font-semibold"
            isLoading={loading}
          >
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">
            Already have an account?
          </p>

          <Link
            href="/auth/signin"
            className="mt-1 inline-block font-semibold text-blue-600 hover:text-blue-700"
          >
            Sign In
          </Link>
        </div>
      </Card>
    </section>
  );
}
