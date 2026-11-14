'use client';

import React from 'react';
import { Search, Bell, Shield, LogOut } from 'lucide-react';
import { AuthService } from '../../services/authService';

interface TopbarProps {
  title?: string;
  subtitle?: string;
}

export const Topbar: React.FC<TopbarProps> = ({
  title = 'System Overview',
  subtitle = 'Welcome back to ResumeCraft AI administration',
}) => {
  const handleLogout = () => {
    AuthService.logout();
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between sticky top-0 z-20">
      {/* Page Context / Breadcrumbs */}
      <div>
        <h2 className="text-base font-bold text-gray-900 leading-tight">{title}</h2>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Quick Search */}
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search records..."
            className="w-56 pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
          />
        </div>

        {/* Notifications Icon */}
        <button
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors relative"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full absolute top-2 right-2 ring-2 ring-white" />
        </button>

        {/* Separator */}
        <div className="h-5 w-[1px] bg-gray-200" />

        {/* Admin Profile & Logout */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-xs shadow-sm">
            AD
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-semibold text-gray-800 leading-none">Super Administrator</p>
            <p className="text-[11px] text-gray-400 mt-0.5">admin@resumecraft.com</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-1"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
