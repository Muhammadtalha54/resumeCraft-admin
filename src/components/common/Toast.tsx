'use client';

import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'success',
  onClose,
  duration = 4000,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const isSuccess = type === 'success';

  return (
    <div className="fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 bg-white rounded-xl shadow-lg border border-gray-100 max-w-sm animate-in fade-in slide-in-from-top-2 duration-200">
      {isSuccess ? (
        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
      ) : (
        <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
      )}
      <p className="text-xs font-medium text-gray-800 flex-1 leading-snug">{message}</p>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 p-0.5 rounded-lg transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
