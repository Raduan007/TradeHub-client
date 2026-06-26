"use client";

import { useCallback, useEffect, useState } from "react";
import { Alert, Button, Card, Input, Switch } from "@heroui/react";

import BuyerErrorState from "@/components/buyer/BuyerErrorState";
import BuyerPageHeader from "@/components/buyer/BuyerPageHeader";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadSettings = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/settings");
      if (!response.ok) throw new Error("Failed to load settings");
      const data = await response.json();
      setSettings(data.settings);
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleSave = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setSuccess("");
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!response.ok) throw new Error("Failed to save settings");
      const data = await response.json();
      setSettings(data.settings);
      setSuccess("Platform settings updated.");
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <p className="p-6 text-slate-500">Loading settings...</p>;
  if (error && !settings) return <BuyerErrorState message={error} onRetry={loadSettings} />;

  return (
    <div className="space-y-6">
      <BuyerPageHeader title="Platform Settings" description="Configure global marketplace settings." />
      <Card className="border border-slate-200 p-6 dark:border-slate-700">
        {success ? <Alert className="mb-4" color="success" title={success} /> : null}
        <form onSubmit={handleSave} className="space-y-4">
          <Input label="Site Name" value={settings?.siteName || ""} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} variant="bordered" />
          <Input label="Support Email" value={settings?.supportEmail || ""} onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })} variant="bordered" />
          <Input label="Commission Rate (%)" type="number" value={String(settings?.commissionRate ?? 5)} onChange={(e) => setSettings({ ...settings, commissionRate: Number(e.target.value) })} variant="bordered" />
          <Switch isSelected={settings?.maintenanceMode} onValueChange={(value) => setSettings({ ...settings, maintenanceMode: value })}>Maintenance mode</Switch>
          <Switch isSelected={settings?.allowRegistration} onValueChange={(value) => setSettings({ ...settings, allowRegistration: value })}>Allow new registrations</Switch>
          <Button type="submit" color="primary" isLoading={isSaving}>Save Settings</Button>
        </form>
      </Card>
    </div>
  );
}
