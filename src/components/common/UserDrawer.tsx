'use client';

import React, { useState } from 'react';
import { X, User as UserIcon, Mail, Shield, Zap, Calendar, Sparkles } from 'lucide-react';
import { User } from '../../types';
import { StatusBadge } from './StatusBadge';

interface UserDrawerProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveCredits: (userId: string, resumeCredits: number, atsCredits: number) => Promise<void>;
}

export const UserDrawer: React.FC<UserDrawerProps> = ({
  user,
  isOpen,
  onClose,
  onSaveCredits,
}) => {
  if (!isOpen || !user) return null;

  const [resumeCredits, setResumeCredits] = useState<number>(user.resumeCredits);
  const [atsCredits, setAtsCredits] = useState<number>(user.atsCredits);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveCredits(user.id, resumeCredits, atsCredits);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-gray-900/30 backdrop-blur-[2px]">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-gray-200 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">User Profile Details</h2>
              <p className="text-xs text-gray-500">Inspect and adjust account balance</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 flex-1 overflow-y-auto space-y-6">
            {/* Identity Card */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-semibold text-gray-900 truncate">{user.name}</h4>
                <p className="text-xs text-gray-500 truncate flex items-center gap-1.5 mt-0.5">
                  <Mail className="w-3.5 h-3.5" />
                  {user.email}
                </p>
              </div>
            </div>

            {/* Status & Plan Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 bg-white border border-gray-200 rounded-xl">
                <p className="text-xs text-gray-500 mb-1">Account Status</p>
                <StatusBadge status={user.status} />
              </div>
              <div className="p-3.5 bg-white border border-gray-200 rounded-xl">
                <p className="text-xs text-gray-500 mb-1">Assigned Plan</p>
                <StatusBadge status={user.plan} />
              </div>
            </div>

            {/* Quick Details List */}
            <div className="space-y-3 text-xs text-gray-600 border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-gray-500">
                  <Shield className="w-4 h-4 text-gray-400" /> User Role
                </span>
                <span className="font-semibold text-gray-800">{user.role}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-gray-500">
                  <Calendar className="w-4 h-4 text-gray-400" /> Joined Date
                </span>
                <span className="font-medium text-gray-800">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Credit Adjuster Form */}
            <div className="border-t border-gray-100 pt-5 space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Manage User Resource Credits</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Resume Generation Credits
                </label>
                <input
                  type="number"
                  min="0"
                  value={resumeCredits}
                  onChange={(e) => setResumeCredits(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  ATS Score Check Credits
                </label>
                <input
                  type="number"
                  min="0"
                  value={atsCredits}
                  onChange={(e) => setAtsCredits(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              disabled={isSaving}
              onClick={handleSave}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition flex items-center gap-2 shadow-sm"
            >
              {isSaving && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              Save Balance Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
