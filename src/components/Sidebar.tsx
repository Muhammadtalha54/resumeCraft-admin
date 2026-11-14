'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, FileText, Ticket, Settings, LogOut, Shield } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard Overview', href: '/', icon: LayoutDashboard },
    { name: 'User Management', href: '/users', icon: Users },
    { name: 'Resume Templates', href: '/templates', icon: FileText },
    { name: 'Support Tickets', href: '/tickets', icon: Ticket },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen p-4 flex flex-col justify-between border-r border-slate-800">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-3 py-4 mb-6 border-b border-slate-800">
          <div className="p-2 bg-blue-600 rounded-lg text-white">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-white text-lg tracking-tight">ResumeCraft AI</h1>
            <p className="text-xs text-blue-400 font-medium">Admin Control Panel</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Admin Footer info */}
      <div className="pt-4 border-t border-slate-800">
        <div className="px-3 py-2 bg-slate-800/40 rounded-lg text-xs">
          <p className="text-slate-400">Logged in as:</p>
          <p className="text-white font-medium truncate">admin@resumecraft.com</p>
        </div>
      </div>
    </aside>
  );
}
