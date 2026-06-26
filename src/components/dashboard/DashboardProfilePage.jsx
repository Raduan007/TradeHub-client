"use client";

import { useCallback, useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import {
  Alert,
  Avatar,
  Button,
  Card,
  Chip,
  Input,
  Skeleton,
} from "@heroui/react";

import BuyerErrorState from "@/components/buyer/BuyerErrorState";
import BuyerPageHeader from "@/components/buyer/BuyerPageHeader";
import { getUserInitials } from "@/lib/dashboard-nav";

export default function DashboardProfilePage({ apiPath, roleLabel }) {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: "", image: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(apiPath);

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || "Failed to load profile");
      }

      const data = await response.json();
      setProfile(data.profile);
      setForm({
        name: data.profile.name || "",
        image: data.profile.image || "",
      });
    } catch (fetchError) {
      setError(fetchError.message || "Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  }, [apiPath]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(apiPath, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "Failed to update profile");
      }

      setProfile(data.profile);
      setSuccess("Profile updated successfully.");
    } catch (fetchError) {
      setError(fetchError.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <BuyerPageHeader
        title="Profile"
        description={`Manage your ${roleLabel} account information.`}
      />

      {isLoading ? (
        <Card className="border border-slate-200 p-6 dark:border-slate-700">
          <Skeleton className="h-24 w-24 rounded-full" />
        </Card>
      ) : null}

      {!isLoading && error && !profile ? (
        <BuyerErrorState
          title="Unable to load profile"
          message={error}
          onRetry={loadProfile}
        />
      ) : null}

      {!isLoading && profile ? (
        <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
          <Card className="border border-slate-200 p-6 dark:border-slate-700">
            <div className="flex flex-col items-center text-center">
              <Avatar size="lg" color="accent">
                {profile.image ? (
                  <Avatar.Image src={profile.image} alt={profile.name} />
                ) : null}
                <Avatar.Fallback>{getUserInitials(profile)}</Avatar.Fallback>
              </Avatar>
              <h2 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">
                {profile.name}
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {profile.email}
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <Chip size="sm" color="accent" variant="soft">
                  {profile.role}
                </Chip>
                <Chip size="sm" variant="secondary">
                  {profile.status}
                </Chip>
              </div>
            </div>
          </Card>

          <Card className="border border-slate-200 p-6 dark:border-slate-700">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                <FaUser />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Account Details
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Update your display name and profile image URL.
                </p>
              </div>
            </div>

            {error ? <Alert className="mb-4" color="danger" title={error} /> : null}
            {success ? <Alert className="mb-4" color="success" title={success} /> : null}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                variant="bordered"
                isRequired
              />
              <Input
                label="Email"
                value={profile.email}
                isReadOnly
                variant="bordered"
              />
              <Input
                label="Profile Image URL"
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="https://example.com/avatar.jpg"
                variant="bordered"
              />
              <Button type="submit" color="primary" isLoading={isSaving}>
                Save changes
              </Button>
            </form>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
