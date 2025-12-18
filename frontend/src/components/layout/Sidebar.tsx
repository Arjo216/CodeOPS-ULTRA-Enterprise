"use client";

import React from 'react';
import { 
  Terminal, 
  LayoutDashboard, 
  Settings, 
  FolderGit2, 
  Database,
  History
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { icon: LayoutDashboard, label: 'Mission Control', href: '/' },
  { icon: Terminal, label: 'Active Agent', href: '/agent' },
  { icon: FolderGit2, label: 'Projects', href: '/projects' },
  { icon: Database, label: 'Knowledge Base', href: '/knowledge' },
  { icon: History, label: 'Audit Logs', href: '/logs' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-16 lg:w-64 h-screen border-r border-ultra-border bg-ultra-card/50 flex flex-col justify-between transition-all duration-300">
      
      {/* Top: Navigation */}
      <div className="flex flex-col py-6">
        {/* Logo Icon (Mobile Only view mostly) */}
        <div className="flex items-center justify-center lg:justify-start lg:px-6 mb-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-ultra-primary to-ultra-secondary flex items-center justify-center shadow-lg shadow-ultra-primary/20">
            <Terminal size={18} className="text-white" />
          </div>
          <span className="hidden lg:block ml-3 font-bold text-lg tracking-wider text-white">
            Code-OPS
          </span>
        </div>

        <nav className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group
                  ${isActive 
                    ? 'bg-ultra-primary/10 text-ultra-primary border border-ultra-primary/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <item.icon size={20} className={isActive ? "animate-pulse" : ""} />
                <span className="hidden lg:block font-medium">{item.label}</span>
                
                {/* Active Indicator Line */}
                {isActive && (
                  <div className="absolute left-0 w-1 h-8 bg-ultra-primary rounded-r-full lg:hidden" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom: Settings */}
      <div className="p-4 border-t border-ultra-border">
        <button className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all">
          <Settings size={20} />
          <span className="hidden lg:block font-medium">Settings</span>
        </button>
      </div>
    </aside>
  );
}