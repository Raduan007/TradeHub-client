"use client";

import { useCallback, useEffect, useState } from "react";
import { FaSearch, FaUserCheck, FaUserMinus, FaUserSlash, FaUsers } from "react-icons/fa";
import { Button, Card, Chip, Input } from "@heroui/react";

import BuyerEmptyState from "@/components/buyer/BuyerEmptyState";
import BuyerErrorState from "@/components/buyer/BuyerErrorState";
import BuyerPageHeader from "@/components/buyer/BuyerPageHeader";
import TableSkeleton from "@/components/buyer/TableSkeleton";
import { USER_ROLES } from "@/lib/user-roles";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page: String(page), search, role });
      const response = await fetch(`/api/admin/users?${params}`);
      if (!response.ok) throw new Error("Failed to load users");
      const data = await response.json();
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setIsLoading(false);
    }
  }, [page, search, role]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  const updateUser = async (userId, updates) => {
    setUpdatingId(userId);
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Failed to update user");
      const data = await response.json();
      setUsers((current) => current.map((user) => (user.id === userId ? data.user : user)));
    } catch (updateError) {
      setError(updateError.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <BuyerPageHeader title="Manage Users" description="View, search, and control platform user accounts." />

      <div className="grid gap-4 md:grid-cols-[1fr_180px]">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none" />
          <Input
            placeholder="Search users..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            variant="bordered"
            className="pl-8"
          />
        </div>
        <select
          value={role}
          onChange={(e) => {
            setRole(e.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900"
        >
          <option value="">All roles</option>
          {Object.values(USER_ROLES).map((userRole) => (
            <option key={userRole} value={userRole}>
              {userRole}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? <TableSkeleton rows={6} /> : null}
      {!isLoading && error ? <BuyerErrorState message={error} onRetry={loadUsers} /> : null}
      {!isLoading && !error && users.length === 0 ? (
        <BuyerEmptyState icon={FaUsers} title="No users found" description="Try adjusting your search or filters." />
      ) : null}

      {!isLoading && !error && users.length > 0 ? (
        <>
          <div className="space-y-3">
            {users.map((user) => (
              <Card key={user.id} className="border border-slate-200 p-5 dark:border-slate-700 transition-all duration-300 hover:scale-[1.01] hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{user.name}</p>
                    <p className="text-sm text-slate-500">{user.email}</p>
                    <div className="mt-2 flex gap-2">
                      <Chip size="sm" color="primary" variant="soft">{user.role}</Chip>
                      <Chip size="sm" variant="secondary">{user.status}</Chip>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {user.status === "active" ? (
                      <Button size="sm" color="primary" variant="flat" isLoading={updatingId === user.id} onPress={() => updateUser(user.id, { status: "suspended" })}><FaUserMinus className="mr-2 text-slate-400" />Suspend</Button>
                    ) : (
                      <Button size="sm" color="success" variant="flat" isLoading={updatingId === user.id} onPress={() => updateUser(user.id, { status: "active" })}><FaUserCheck className="mr-2 text-slate-400" />Activate</Button>
                    )}
                    <Button size="sm" color="danger" variant="flat" startContent={<FaUserSlash />} isLoading={updatingId === user.id} onPress={() => updateUser(user.id, { status: "banned" })}>Block</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          {pagination.totalPages > 1 ? (
            <div className="flex items-center justify-center gap-4">
              <Button
                size="sm"
                color="primary"
                variant="flat"
                isDisabled={page <= 1}
                onPress={() => setPage((current) => Math.max(1, current - 1))}
              >
                Previous
              </Button>
              <span className="text-sm text-slate-500">
                Page {page} of {pagination.totalPages}
              </span>
              <Button
                size="sm"
                color="primary"
                variant="flat"
                isDisabled={page >= pagination.totalPages}
                onPress={() => setPage((current) => Math.min(pagination.totalPages, current + 1))}
              >
                Next
              </Button>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
