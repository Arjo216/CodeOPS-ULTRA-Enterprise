"use client";

import React from 'react';
import { User, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatMessageProps {
  role: 'user' | 'agent';
  content: string;
  timestamp?: string;
}

export default function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-6`}
    >
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border 
        ${isUser 
          ? 'bg-ultra-primary/20 border-ultra-primary text-ultra-primary' 
          : 'bg-ultra-accent/20 border-ultra-accent text-ultra-accent'
        }`}
      >
        {isUser ? <User size={16} /> : <Terminal size={16} />}
      </div>

      {/* Message Bubble */}
      <div className={`flex flex-col max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed border 
          ${isUser 
            ? 'bg-ultra-primary/10 border-ultra-primary/30 text-gray-100 rounded-tr-none' 
            : 'bg-ultra-card border-white/10 text-gray-300 rounded-tl-none'
          }`}
        >
          {content}
        </div>
        <span className="text-[10px] text-gray-600 mt-1 uppercase font-mono tracking-widest">
          {isUser ? 'COMMANDER' : 'SYSTEM AI'}
        </span>
      </div>
    </motion.div>
  );
}