"use client";

import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, X, FileCode } from 'lucide-react';

// Props definition
interface UploadZoneProps {
  onFilesChange: (files: File[]) => void;
}

export default function UploadZone({ onFilesChange }: UploadZoneProps) {
  const [fileList, setFileList] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Notify parent whenever fileList changes
  useEffect(() => {
    onFilesChange(fileList);
  }, [fileList, onFilesChange]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFileList(prev => [...prev, ...newFiles]);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFileList(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFileList(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (type: string) => {
    if (type.includes('image')) return <ImageIcon size={18} />;
    if (type.includes('pdf')) return <FileText size={18} />;
    return <FileCode size={18} />;
  };

  return (
    <div className="glass-panel rounded-2xl p-5 h-full flex flex-col">
      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
        <UploadCloud size={16} /> Context Files
      </h3>

      <div 
        onClick={() => fileInputRef.current?.click()}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer group
          ${isDragging 
            ? 'border-ultra-primary bg-ultra-primary/10' 
            : 'border-ultra-border hover:border-ultra-primary/50 hover:bg-ultra-primary/5'
          }`}
      >
        <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileSelect} />
        <div className={`w-12 h-12 rounded-full bg-ultra-card flex items-center justify-center mb-3 transition-transform ${isDragging ? 'scale-110' : 'group-hover:scale-110'}`}>
          <UploadCloud size={24} className={isDragging ? "text-ultra-primary" : "text-gray-400 group-hover:text-ultra-primary"} />
        </div>
        <p className="text-sm text-gray-300 font-medium">Click to upload or drag & drop</p>
      </div>

      <div className="mt-6 space-y-3 flex-1 overflow-y-auto">
        {fileList.length === 0 && (
           <div className="text-center text-gray-600 text-xs py-4 italic">No files added yet</div>
        )}

        {fileList.map((file, index) => (
          <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-ultra-card/50 border border-white/5 hover:border-ultra-border transition-colors group">
            <div className="p-2 rounded bg-ultra-primary/10 text-ultra-primary">
              {getFileIcon(file.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-200 truncate">{file.name}</p>
              <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); removeFile(index); }}
              className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}