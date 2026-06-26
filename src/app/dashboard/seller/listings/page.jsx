"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { FaEdit, FaList, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import { Button, Card, Input, Spinner } from "@heroui/react";

import BuyerEmptyState from "@/components/buyer/BuyerEmptyState";
import BuyerErrorState from "@/components/buyer/BuyerErrorState";
import BuyerPageHeader from "@/components/buyer/BuyerPageHeader";
import TableSkeleton from "@/components/buyer/TableSkeleton";
import { formatCurrency } from "@/lib/format";

export default function SellerListingsPage() {
  const [listings, setListings] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const loadListings = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      const response = await fetch(`/api/seller/listings?${params}`);
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

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const response = await fetch(`/api/seller/listings/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete listing");
      setListings((current) => current.filter((item) => item.id !== id));
    } catch (deleteError) {
      setError(deleteError.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <BuyerPageHeader title="My Products" description="View, edit, and manage your product listings." />
        <Link href="/dashboard/seller/add-product">
          <Button color="primary" startContent={<FaPlus />}>Add Product</Button>
        </Link>
      </div>

      <Input
        placeholder="Search listings..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        startContent={<FaSearch className="text-slate-400" />}
        variant="bordered"
      />

      {isLoading ? <TableSkeleton rows={5} /> : null}
      {!isLoading && error ? <BuyerErrorState message={error} onRetry={loadListings} /> : null}

      {!isLoading && !error && listings.length === 0 ? (
        <BuyerEmptyState icon={FaList} title="No listings yet" description="Create your first product listing." actionLabel="Add Product" onAction={() => { window.location.href = "/dashboard/seller/add-product"; }} />
      ) : null}

      {!isLoading && !error && listings.length > 0 ? (
        <div className="grid gap-4">
          {listings.map((listing) => (
            <Card key={listing.id} className="border border-slate-200 p-4 dark:border-slate-700">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <img src={listing.image || listing.images?.[0] || "/images/products/product1.jpg"} alt={listing.name || listing.title} className="h-16 w-16 rounded-lg object-cover" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{listing.name || listing.title}</p>
                    <p className="text-sm text-slate-500">{listing.category} · {formatCurrency(listing.price)}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/dashboard/seller/listings/${listing.id}/edit`}>
                    <Button variant="secondary" startContent={<FaEdit />}>Edit</Button>
                  </Link>
                  <Button color="danger" variant="flat" startContent={deletingId === listing.id ? <Spinner size="sm" /> : <FaTrash />} onPress={() => handleDelete(listing.id)} isDisabled={deletingId === listing.id}>
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
