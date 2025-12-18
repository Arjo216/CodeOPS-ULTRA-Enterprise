"use client";

import React, { useState } from 'react';
import AgentConsole from "@/components/dashboard/AgentConsole";
import UploadZone from "@/components/dashboard/UploadZone";

export default function Home() {
  // Shared state for files
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div className="h-[calc(100vh-100px)] grid grid-cols-12 gap-6">
      
      {/* LEFT: Agent Command Center */}
      <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
        <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-ultra-primary bg-gradient-to-r from-ultra-primary/10 to-transparent">
          <h2 className="text-2xl font-bold text-white mb-2">Welcome back, Commander.</h2>
          <p className="text-gray-400">
            System is ready for autonomous engineering tasks. 
            <span className="text-ultra-accent ml-2 font-mono text-xs px-2 py-1 rounded bg-ultra-accent/10 border border-ultra-accent/20">
              v2.5 ENTERPRISE
            </span>
          </p>
        </div>

        {/* Pass files to Console so it can send them */}
        <AgentConsole files={files} />
      </div>

      {/* RIGHT: Upload Zone */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
        {/* Pass setFiles so UploadZone can update the list */}
        <UploadZone onFilesChange={setFiles} />
        
        {/* Stats Panel */}
        <div className="glass-panel p-5 rounded-2xl flex-1">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">System Status</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Sandbox Engine</span>
              <span className="text-xs font-bold text-ultra-success bg-ultra-success/10 px-2 py-1 rounded">ONLINE</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Multimodal RAG</span>
              <span className="text-xs font-bold text-ultra-primary bg-ultra-primary/10 px-2 py-1 rounded">ACTIVE</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}