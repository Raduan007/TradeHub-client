"use client";

import { useCallback, useEffect, useState } from "react";
import { FaBan, FaCheck, FaEye, FaFlag } from "react-icons/fa";
import { Button, Card, Chip } from "@heroui/react";

import BuyerEmptyState from "@/components/buyer/BuyerEmptyState";
import BuyerErrorState from "@/components/buyer/BuyerErrorState";
import BuyerPageHeader from "@/components/buyer/BuyerPageHeader";
import { REPORT_STATUS_LABELS } from "@/lib/constants/admin";
import { formatDateTime } from "@/lib/format";

export default function AdminReportsPage() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const loadReports = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/reports");
      if (!response.ok) throw new Error("Failed to load reports");
      const data = await response.json();
      setReports(data.reports);
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const updateReport = async (reportId, status) => {
    setUpdatingId(reportId);
    try {
      const response = await fetch(`/api/admin/reports/${reportId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("Failed to update report");
      const data = await response.json();
      setReports((current) => current.map((report) => (report.id === reportId ? data.report : report)));
    } catch (updateError) {
      setError(updateError.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <BuyerPageHeader title="Reports" description="Review and resolve reported products and user issues." />
      {isLoading ? <p className="text-slate-500">Loading reports...</p> : null}
      {!isLoading && error ? <BuyerErrorState message={error} onRetry={loadReports} /> : null}
      {!isLoading && !error && reports.length === 0 ? (
        <BuyerEmptyState icon={FaFlag} title="No reports" description="User-submitted reports will appear here." />
      ) : null}

      {!isLoading && !error && reports.length > 0 ? (
        <div className="space-y-3">
          {reports.map((report) => (
            <Card key={report.id} className="border border-slate-200 p-5 dark:border-slate-700">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{report.reason || report.targetType}</p>
                  <p className="text-sm text-slate-500">{report.reporterName || "User"} · {formatDateTime(report.createdAt)}</p>
                  <Chip size="sm" className="mt-2" variant="soft">{REPORT_STATUS_LABELS[report.status] || report.status}</Chip>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" color="primary" variant="flat" startContent={<FaEye />} isLoading={updatingId === report.id} onPress={() => updateReport(report.id, "reviewing")}>Review</Button>
                  <Button size="sm" color="success" variant="flat" startContent={<FaCheck />} isLoading={updatingId === report.id} onPress={() => updateReport(report.id, "resolved")}>Resolve</Button>
                  <Button size="sm" color="danger" variant="flat" startContent={<FaBan />} isLoading={updatingId === report.id} onPress={() => updateReport(report.id, "dismissed")}>Dismiss</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  );
}
