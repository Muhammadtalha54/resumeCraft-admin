'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Shield, Lock, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { AuthService } from '../../services/authService';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setErrorMsg('Missing password reset token in URL. Please request a new reset link.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await AuthService.resetPassword({
        token,
        newPassword
      });

      if (res && res.success) {
        setIsSuccess(true);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-sm mb-3">
          <Shield className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Set New Password</h1>
        <p className="text-xs text-gray-500 mt-1">
          Create a strong password for your administrator account
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 mb-6 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {isSuccess ? (
        <div className="text-center py-4 space-y-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Password Reset Successful!</h2>
            <p className="text-xs text-gray-500 mt-1">
              Your administrator account password has been updated. You can now log in with your new credentials.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition"
          >
            Go to Admin Login <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              New Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Update Password <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>

          <div className="text-center pt-2">
            <Link
              href="/login"
              className="text-xs text-gray-500 hover:text-gray-800 transition"
            >
              Cancel and return to login
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center p-4">
      <Suspense fallback={
        <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 p-8 shadow-sm text-center text-xs text-gray-500">
          Loading reset session...
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
