"use client";

import { useCallback, useEffect, useState } from "react";
import { FaCheck, FaSearch, FaStore, FaTimes, FaTrash } from "react-icons/fa";
import { Button, Card, Chip, Input, Spinner } from "@heroui/react";

import BuyerEmptyState from "@/components/buyer/BuyerEmptyState";
import BuyerErrorState from "@/components/buyer/BuyerErrorState";
import BuyerPageHeader from "@/components/buyer/BuyerPageHeader";
import TableSkeleton from "@/components/buyer/TableSkeleton";
import { formatCurrency } from "@/lib/format";

export default function AdminListingsPage() {
  const [listings, setListings] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const loadListings = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      const response = await fetch(`/api/admin/listings?${params}`);
      if (!response.ok) throw new Error("Failed to load listings");
      const data = await response.json();
      setListings(data.listings);
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  useEffect(() => {
    loadListings();
  }, [loadListings]);

  useEffect(() => {
    const timeoutId = setTimeout(() => setSearch(searchInput.trim()), 300);
    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  const updateListing = async (id, updates) => {
    setUpdatingId(id);
    try {
      const response = await fetch(`/api/admin/listings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Failed to update listing");
      const data = await response.json();
      setListings((current) => current.map((item) => (item.id === id ? data.listing : item)));
    } catch (updateError) {
      setError(updateError.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteListing = async (id) => {
    setUpdatingId(id);
    try {
      const response = await fetch(`/api/admin/listings/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete listing");
      setListings((current) => current.filter((item) => item.id !== id));
    } catch (deleteError) {
      setError(deleteError.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <BuyerPageHeader title="Manage Products" description="Approve, reject, and moderate all platform listings." />
      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none" />
        <Input
          placeholder="Search products..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          variant="bordered"
          className="pl-8"
        />
      </div>

      {isLoading ? <TableSkeleton rows={5} /> : null}
      {!isLoading && error ? <BuyerErrorState message={error} onRetry={loadListings} /> : null}
      {!isLoading && !error && listings.length === 0 ? (
        <BuyerEmptyState icon={FaStore} title="No products found" description="Products listed by sellers will appear here." />
      ) : null}

      {!isLoading && !error && listings.length > 0 ? (
        <div className="space-y-3">
          {listings.map((listing) => (
            <Card key={listing.id} className="border border-slate-200 p-5 dark:border-slate-700 transition-all duration-300 hover:scale-[1.01] hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{listing.name || listing.title}</p>
                  <p className="text-sm text-slate-500">{listing.category} · {formatCurrency(listing.price)}</p>
                  <Chip size="sm" className="mt-2" variant="soft">{listing.status || "available"}</Chip>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    isLoading={updatingId === listing.id}
                    onPress={() => updateListing(listing.id, { status: "available" })}
                    className="bg-transparent border border-emerald-500 text-emerald-500 hover:bg-emerald-500/10 font-semibold"
                    startContent={<FaCheck />}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    isLoading={updatingId === listing.id}
                    onPress={() => updateListing(listing.id, { status: "rejected" })}
                    className="bg-transparent border border-orange-500 text-orange-500 hover:bg-orange-500/10 font-semibold"
                    startContent={updatingId === listing.id ? <Spinner size="sm" /> : <FaTimes />}
                  >
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    onPress={() => deleteListing(listing.id)}
                    className="bg-transparent border border-red-500 text-red-500 hover:bg-red-500/10 font-semibold"
                    startContent={updatingId === listing.id ? <Spinner size="sm" /> : <FaTrash />}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  );
}
