import React from 'react';
import { Bell, Cpu, Search, User } from 'lucide-react';

export default function Header() {
  return (
    <header className="h-16 border-b border-ultra-border bg-ultra-bg/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
      
      {/* Left: Page Title / Breadcrumbs */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
          <span className="text-white">Code-OPS</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-ultra-primary to-ultra-secondary neon-text">
            ULTRA
          </span>
        </h1>
        <div className="h-4 w-[1px] bg-ultra-border mx-2"></div>
        <div className="hidden md:flex items-center gap-2 px-2 py-1 rounded-md bg-ultra-primary/10 border border-ultra-primary/20">
          <Cpu size={12} className="text-ultra-primary" />
          <span className="text-xs font-mono text-ultra-primary font-bold">SYSTEM ONLINE</span>
        </div>
      </div>

      {/* Center: Search (Optional) */}
      <div className="hidden md:block w-96 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
        <input 
          type="text" 
          placeholder="Search projects, logs, or documentation..."
          className="w-full bg-ultra-card border border-ultra-border rounded-full py-1.5 pl-10 pr-4 text-sm text-gray-300 focus:outline-none focus:border-ultra-primary/50 focus:ring-1 focus:ring-ultra-primary/50 transition-all"
        />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-ultra-error rounded-full animate-pulse"></span>
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 border border-white/10 flex items-center justify-center">
          <User size={16} className="text-white" />
        </div>
      </div>
    </header>
  );
}