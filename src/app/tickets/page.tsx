'use client';

import React, { useState, useEffect } from 'react';
import {
  LifeBuoy,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Mail,
  User as UserIcon,
} from 'lucide-react';
import { TicketService } from '../../services/ticketService';
import { SupportTicket } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { TableRowSkeleton } from '../../components/common/SkeletonLoader';
import { EmptyState } from '../../components/common/EmptyState';
import { Toast } from '../../components/common/Toast';

export default function SupportTicketsPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'OPEN' | 'IN_PROGRESS' | 'RESOLVED'>('ALL');
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await TicketService.getAllTickets();
      if (res && res.tickets) {
        setTickets(res.tickets);
      }
    } catch (err: any) {
      setToastMessage({ text: err.message || 'Failed to load tickets', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleUpdateStatus = async (ticketId: string, status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED') => {
    try {
      await TicketService.updateStatus(ticketId, status);
      setToastMessage({ text: `Ticket updated to ${status}`, type: 'success' });
      setTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? { ...t, status } : t))
      );
    } catch (err: any) {
      setToastMessage({ text: err.message || 'Failed to update ticket status', type: 'error' });
    }
  };

  const filteredTickets = tickets.filter((t) => {
    if (statusFilter === 'ALL') return true;
    return t.status === statusFilter;
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
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Support Tickets</h1>
          <p className="text-sm text-gray-500 mt-1">
            Review and resolve candidate inquiries sent from the mobile application
          </p>
        </div>

        <button
          onClick={fetchTickets}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-sm transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {/* 2. Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="font-medium">Filter by Status:</span>
          <select
            value={statusFilter}
            onChange={(e: any) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 font-medium"
          >
            <option value="ALL">All Tickets</option>
            <option value="OPEN">Open Only</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved Only</option>
          </select>
        </div>
      </div>

      {/* 3. Tickets Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Candidate</th>
                <th className="py-3.5 px-6">Subject & Description</th>
                <th className="py-3.5 px-6">Priority</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Submitted</th>
                <th className="py-3.5 px-6 text-right">Update Resolution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => <TableRowSkeleton key={i} cols={6} />)
              ) : filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12">
                    <EmptyState
                      title="No support tickets"
                      description="There are currently no customer inquiries matching your filter."
                      icon={LifeBuoy}
                    />
                  </td>
                </tr>
              ) : (
                filteredTickets.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                          {t.user?.name ? t.user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 text-xs truncate">
                            {t.user?.name || 'Mobile Candidate'}
                          </p>
                          <p className="text-[11px] text-gray-500 truncate flex items-center gap-1">
                            <Mail className="w-3 h-3 text-gray-400" />
                            {t.user?.email || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 max-w-sm">
                      <p className="font-semibold text-gray-900 text-xs">{t.subject}</p>
                      <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{t.message}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2 py-0.5 text-xs font-semibold rounded-md ${
                          t.priority === 'HIGH'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : t.priority === 'MEDIUM'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-50 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {t.priority}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge status={t.status} />
                    </td>
                    <td className="py-4 px-6 text-xs text-gray-500">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <select
                        value={t.status}
                        onChange={(e: any) => handleUpdateStatus(t.id, e.target.value)}
                        className="text-xs px-2.5 py-1 border border-gray-200 rounded-lg bg-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="OPEN">Mark Open</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="RESOLVED">Resolve Ticket</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
