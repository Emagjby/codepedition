"use client";

import React, { forwardRef } from "react";
import { ChevronDown } from "lucide-react";
// @ts-ignore - ReactFlow is installed but TypeScript can't find the types
import { Handle, Position } from "reactflow";

interface ChapterChangeCircleProps {
  id: string;
  data: {
    title?: string;
    nextChapter?: string;
    onClick?: () => void;
  };
}

const ChapterChangeCircle = forwardRef<HTMLDivElement, ChapterChangeCircleProps>(
  ({ data }, ref) => {
    return (
      <div
        ref={ref}
        onClick={data.onClick}
        className="flex flex-col items-center justify-center"
      >
        {/* Top handle for connections */}
        <Handle
          type="target"
          position={Position.Top}
          id="top"
          className="w-2 h-2 opacity-0"
        />

        {/* The circle itself */}
        <div className="w-14 h-14 rounded-full bg-gray-100 border-2 border-blue-400 flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group">
          <ChevronDown className="w-6 h-6 text-blue-600 group-hover:text-blue-700 transition-transform duration-200 group-hover:translate-y-0.5" />
        </div>

        {/* Always show title or fallback text */}
        <div className="mt-1 text-center text-sm text-blue-600 font-bold">
          {data.title || 'Next Chapter'}
        </div>

        {/* Bottom handle for connections */}
        <Handle
          type="source"
          position={Position.Bottom}
          id="bottom"
          className="w-2 h-2 opacity-0"
        />
      </div>
    );
  }
);

// Add display name for debugging
ChapterChangeCircle.displayName = "ChapterChangeCircle";

export default ChapterChangeCircle; 