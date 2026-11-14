'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  UserCheck,
  UserX,
  Sparkles,
  RefreshCw,
  Eye,
  Sliders,
} from 'lucide-react';
import { UserService } from '../../services/userService';
import { User } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ActionMenu } from '../../components/common/ActionMenu';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { UserDrawer } from '../../components/common/UserDrawer';
import { TableRowSkeleton } from '../../components/common/SkeletonLoader';
import { EmptyState } from '../../components/common/EmptyState';
import { Toast } from '../../components/common/Toast';

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'BLOCKED'>('ALL');
  
  // Drawer & Modal state
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [blockingUser, setBlockingUser] = useState<User | null>(null);
  const [isBlocking, setIsBlocking] = useState(false);

  // Toast state
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await UserService.getUsers();
      if (res && res.users) {
        setUsers(res.users);
      }
    } catch (err: any) {
      setToastMessage({ text: err.message || 'Failed to load users', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleBlock = async () => {
    if (!blockingUser) return;
    setIsBlocking(true);
    try {
      const res = await UserService.toggleBlock(blockingUser.id);
      setToastMessage({
        text: res.message || `User status updated successfully`,
        type: 'success',
      });
      // Update local state
      setUsers((prev) =>
        prev.map((u) =>
          u.id === blockingUser.id
            ? { ...u, status: u.status === 'BLOCKED' ? 'ACTIVE' : 'BLOCKED' }
            : u
        )
      );
      setBlockingUser(null);
    } catch (err: any) {
      setToastMessage({ text: err.message || 'Failed to update user status', type: 'error' });
    } finally {
      setIsBlocking(false);
    }
  };

  const handleSaveCredits = async (userId: string, resumeCredits: number, atsCredits: number) => {
    try {
      await UserService.updateCredits({ userId, resumeCredits, atsCredits });
      setToastMessage({ text: 'User credits balance updated successfully', type: 'success' });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, resumeCredits, atsCredits } : u))
      );
    } catch (err: any) {
      setToastMessage({ text: err.message || 'Failed to update credits', type: 'error' });
    }
  };

  // Filtered users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {toastMessage && (
        <Toast
          message={toastMessage.text}
          type={toastMessage.type}
          onClose={() => setToastMessage(null)}
        />
      )}

      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">User Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage registered candidates, allocate resource credits, and enforce access controls
          </p>
        </div>

        <button
          onClick={fetchUsers}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-sm transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh List
        </button>
      </div>

      {/* 2. Filters & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by candidate name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Status:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e: any) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="BLOCKED">Blocked Only</option>
          </select>
        </div>
      </div>

      {/* 3. Main Users Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">User</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Plan</th>
                <th className="py-3.5 px-6">Credits Balance</th>
                <th className="py-3.5 px-6">Joined Date</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} cols={6} />)
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12">
                    <EmptyState
                      title="No candidates found"
                      description={
                        searchQuery
                          ? `No users matched "${searchQuery}". Try adjusting your search query.`
                          : 'There are currently no registered users in the database.'
                      }
                      icon={Users}
                    />
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 text-xs truncate">{user.name}</p>
                          <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge status={user.plan} />
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 font-mono text-xs">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md font-semibold">
                          {user.resumeCredits} RC
                        </span>
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md font-semibold">
                          {user.atsCredits} ATS
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-xs text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <ActionMenu
                        items={[
                          {
                            label: 'Inspect Profile',
                            icon: <Eye className="w-3.5 h-3.5" />,
                            onClick: () => {
                              setSelectedUser(user);
                              setIsDrawerOpen(true);
                            },
                          },
                          {
                            label: 'Edit Credits',
                            icon: <Sliders className="w-3.5 h-3.5" />,
                            onClick: () => {
                              setSelectedUser(user);
                              setIsDrawerOpen(true);
                            },
                          },
                          {
                            label: user.status === 'BLOCKED' ? 'Unblock User' : 'Block User',
                            icon:
                              user.status === 'BLOCKED' ? (
                                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <UserX className="w-3.5 h-3.5 text-rose-600" />
                              ),
                            variant: user.status === 'BLOCKED' ? 'default' : 'destructive',
                            onClick: () => {
                              setBlockingUser(user);
                            },
                          },
                        ]}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination summary */}
        {!loading && filteredUsers.length > 0 && (
          <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between text-xs text-gray-500">
            <span>
              Showing <strong className="font-semibold text-gray-700">1</strong> to{' '}
              <strong className="font-semibold text-gray-700">{filteredUsers.length}</strong> of{' '}
              <strong className="font-semibold text-gray-700">{users.length}</strong> candidates
            </span>
          </div>
        )}
      </div>

      {/* 4. Slide-Over User Drawer */}
      <UserDrawer
        user={selectedUser}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedUser(null);
        }}
        onSaveCredits={handleSaveCredits}
      />

      {/* 5. Destructive Confirm Modal for Blocking */}
      <ConfirmModal
        isOpen={Boolean(blockingUser)}
        title={blockingUser?.status === 'BLOCKED' ? 'Unblock User Account' : 'Block User Account'}
        description={
          blockingUser?.status === 'BLOCKED'
            ? `Are you sure you want to unblock ${blockingUser?.email}? The user will regain immediate access to login and resume tools.`
            : `Are you sure you want to block ${blockingUser?.email}? The user will be immediately rejected at login and barred from all API endpoints.`
        }
        confirmText={blockingUser?.status === 'BLOCKED' ? 'Unblock User' : 'Block User'}
        variant={blockingUser?.status === 'BLOCKED' ? 'primary' : 'danger'}
        isLoading={isBlocking}
        onConfirm={handleToggleBlock}
        onCancel={() => setBlockingUser(null)}
      />
    </div>
  );
}
