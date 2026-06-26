"use client";

import { useCallback, useEffect, useState } from "react";
import { Alert, Button, Card, Input, Switch } from "@heroui/react";

import BuyerErrorState from "@/components/buyer/BuyerErrorState";
import BuyerPageHeader from "@/components/buyer/BuyerPageHeader";

export default function SellerSettingsPage() {
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadSettings = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/seller/settings");
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
      const response = await fetch("/api/seller/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!response.ok) throw new Error("Failed to save settings");
      const data = await response.json();
      setSettings(data.settings);
      setSuccess("Settings saved successfully.");
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
      <BuyerPageHeader title="Settings" description="Configure your seller store preferences." />
      <Card className="border border-slate-200 p-6 dark:border-slate-700">
        {success ? <Alert className="mb-4" color="success" title={success} /> : null}
        <form onSubmit={handleSave} className="space-y-4">
          <Input label="Store Name" value={settings?.storeName || ""} onChange={(e) => setSettings({ ...settings, storeName: e.target.value })} variant="bordered" />
          <Switch isSelected={settings?.notifyOrders} onValueChange={(value) => setSettings({ ...settings, notifyOrders: value })}>Order notifications</Switch>
          <Switch isSelected={settings?.notifyMessages} onValueChange={(value) => setSettings({ ...settings, notifyMessages: value })}>Message notifications</Switch>
          <Switch isSelected={settings?.autoAcceptOrders} onValueChange={(value) => setSettings({ ...settings, autoAcceptOrders: value })}>Auto-accept orders</Switch>
          <Button type="submit" color="primary" isLoading={isSaving}>Save Settings</Button>
        </form>
      </Card>
    </div>
  );
}
