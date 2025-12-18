"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, Zap, Terminal, Code2, Loader2, Cpu, Cloud } from 'lucide-react'; // Added Icons
import { motion, AnimatePresence } from 'framer-motion';
import ChatMessage from './ChatMessage';

interface AgentConsoleProps {
  files?: File[];
}

interface Message {
  role: 'user' | 'agent';
  content: string;
}

export default function AgentConsole({ files = [] }: AgentConsoleProps) {
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [code, setCode] = useState("");
  const [modelMode, setModelMode] = useState<"cloud" | "local">("cloud"); // New State

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, logs]);

  const runMission = async () => {
    if (!input.trim()) return;
    
    const userTask = input;
    setInput("");
    setIsProcessing(true);
    
    setMessages(prev => [...prev, { role: 'user', content: userTask }]);
    setLogs(prev => [...prev, `🚀 STARTING MISSION (${modelMode.toUpperCase()} ENGINE): ${userTask}`]);
    setCode("");

    try {
      const formData = new FormData();
      formData.append("task", userTask);
      formData.append("mode", modelMode); // Send selected mode
      files.forEach((file) => formData.append("files", file));

      const response = await fetch("http://localhost:8000/api/solve", {
        method: "POST",
        body: formData, 
      });
      
      const data = await response.json();
      
      if (data.logs) setLogs(prev => [...prev, ...data.logs]);
      
      if (data.status === 'success') {
        setMessages(prev => [...prev, { role: 'agent', content: "Mission Accomplished. Solution Verified." }]);
        setCode(data.code);
      } else {
        setMessages(prev => [...prev, { role: 'agent', content: "Mission Failed. Check logs." }]);
      }
      
    } catch (error) {
      setLogs(prev => [...prev, `❌ ERROR: ${String(error)}`]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-4 min-h-[600px] h-full relative">
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 scroll-smooth">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-gray-700 opacity-50 select-none">
            <Zap size={60} className="mb-4 text-ultra-primary/50" />
            <p className="text-lg font-medium">System Online. Select Engine & Engage.</p>
          </div>
        )}
        {messages.map((msg, i) => <ChatMessage key={i} role={msg.role} content={msg.content} />)}
        <div ref={messagesEndRef} />
      </div>

      {/* Code Preview */}
      <AnimatePresence>
        {code && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-xl overflow-hidden border border-ultra-primary/30 shadow-2xl">
            <div className="bg-ultra-card/80 p-3 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-ultra-primary"><Code2 size={16} /><span className="font-mono text-xs font-bold">SOLUTION.py</span></div>
              <button onClick={() => navigator.clipboard.writeText(code)} className="text-xs text-gray-500 hover:text-white transition-colors">COPY</button>
            </div>
            <pre className="p-4 overflow-x-auto text-sm font-mono text-blue-100 bg-[#0b0e14] max-h-60 custom-scrollbar"><code>{code}</code></pre>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input & Controls */}
      <div className="glass-panel p-2 rounded-xl flex items-center gap-2 relative focus-within:ring-2 focus-within:ring-ultra-primary/50 transition-all shadow-lg">
        
        {/* Model Switcher */}
        <div className="flex bg-black/40 rounded-lg p-1">
          <button 
            onClick={() => setModelMode("cloud")}
            className={`p-2 rounded-md transition-all ${modelMode === 'cloud' ? 'bg-ultra-primary text-white shadow-md' : 'text-gray-500 hover:text-gray-300'}`}
            title="Use Cloud API (Gemini)"
          >
            <Cloud size={18} />
          </button>
          <button 
            onClick={() => setModelMode("local")}
            className={`p-2 rounded-md transition-all ${modelMode === 'local' ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-300'}`}
            title="Use Local Neural Engine (Ollama)"
          >
            <Cpu size={18} />
          </button>
        </div>

        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && runMission()}
          disabled={isProcessing}
          placeholder={files.length > 0 ? `Analyzing ${files.length} attached file(s)...` : "Command the agent..."}
          className="flex-1 bg-transparent border-none outline-none text-white px-4 py-3 font-medium placeholder-gray-500 disabled:opacity-50"
        />
        <button 
          onClick={runMission}
          disabled={isProcessing}
          className={`p-3 rounded-lg font-bold transition-all flex items-center gap-2
            ${isProcessing ? "bg-ultra-card text-gray-500 cursor-not-allowed" : "bg-gradient-to-br from-ultra-primary to-ultra-secondary text-white hover:scale-105 shadow-lg"}`}
        >
          {isProcessing ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
        </button>
      </div>
    </div>
  );
}