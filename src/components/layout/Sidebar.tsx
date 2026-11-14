'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  FileCode,
  LifeBuoy,
  Briefcase,
  Sparkles,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'User Management', href: '/users', icon: Users },
    { name: 'Resume Templates', href: '/templates', icon: FileCode },
    { name: 'Support Tickets', href: '/tickets', icon: LifeBuoy },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col justify-between flex-shrink-0 z-10">
      <div>
        {/* Logo / Brand Header */}
        <div className="h-16 px-6 border-b border-gray-100 flex items-center gap-3">
          <div className="p-2 bg-blue-600 text-white rounded-xl shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-base leading-tight">ResumeCraft AI</h1>
            <span className="text-[11px] font-medium text-gray-400">Admin Workspace</span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="p-4">
          <p className="px-3 mb-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            Main Menu
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 shadow-sm font-semibold'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Info Box */}
      <div className="p-4 border-t border-gray-100">
        <div className="p-3 bg-gray-50 border border-gray-200/60 rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-xs font-semibold text-gray-800">Scraper & API Online</p>
          </div>
          <p className="text-[11px] text-gray-500 leading-tight">
            Backend Port 5000 • Scraper 5001
          </p>
        </div>
      </div>
    </aside>
  );
};
