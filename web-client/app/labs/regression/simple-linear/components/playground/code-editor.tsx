'use client';

import React, { useEffect } from 'react';

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
}

export default function CodeEditor({ code, onChange }: CodeEditorProps) {
  return (
    <div className="h-full flex flex-col">
      <textarea
        value={code}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 w-full p-4 bg-[#0f1419] text-gray-100 font-mono text-sm resize-none focus:outline-none overflow-auto"
        spellCheck={false}
        style={{
          lineHeight: '1.6',
          tabSize: 2,
        }}
      />
      <div className="p-3 bg-[#0f1419] border-t border-cyan-500/20 text-xs text-gray-500 flex justify-between">
        <span>{code.split('\n').length} lines</span>
        <span>{code.length} characters</span>
      </div>
    </div>
  );
}
