"use client";

import { LucideIcon } from "lucide-react";
// @ts-ignore - ReactFlow is installed but TypeScript can't find the types
import { Handle, Position } from "reactflow";
import React, { forwardRef } from "react";

// Updated node types - 'project' is kept for backward compatibility 
// but we'll be handling projects as chapters in the future
type NodeType = "required" | "optional" | "project";
type NodeColor = "blue" | "purple" | "amber";

interface NodeCardProps {
  type: NodeType;
  title: string;
  icon?: LucideIcon;
  onClick?: () => void;
  id: number;
  data: {
    type: NodeType;
    title: string;
    icon?: LucideIcon;
    onClick?: () => void;
    color?: NodeColor; // New prop to specify color for required nodes
  };
}

// Base colors for each type
const colorStyles = {
  blue: {
    container: "bg-blue-200 text-blue-900 border-blue-400",
    icon: "text-blue-100",
    badge: "bg-blue-300 text-blue-800",
    iconBg: "bg-blue-400"
  },
  purple: {
    container: "bg-purple-200 text-purple-900 border-purple-400",
    icon: "text-purple-100",
    badge: "bg-purple-300 text-purple-800",
    iconBg: "bg-purple-400"
  },
  amber: {
    container: "bg-amber-200 text-amber-900 border-amber-400",
    icon: "text-amber-100",
    badge: "bg-amber-300 text-amber-800",
    iconBg: "bg-amber-400"
  }
};

// Using forwardRef to expose the DOM element
const NodeCard = forwardRef<HTMLDivElement, NodeCardProps>(({ data }, ref) => {
  // Default to blue if no color specified
  const color = data.color || 'blue';
  // Get the base color styles
  const styles = colorStyles[color];
  const Icon = data.icon;
  
  // Apply dashed border if optional
  const borderStyle = data.type === 'optional' ? 'border-dashed' : 'border-solid';
  
  return (
    <div
      ref={ref}
      onClick={data.onClick}
      className={`
        ${styles.container}
        relative rounded-xl border-2 ${borderStyle} p-3
        shadow-sm hover:shadow-md
        transition-all duration-200
        cursor-pointer
        group
        min-h-[70px]
        inline-flex items-center
        whitespace-nowrap
        hover:scale-[1.05]
      `}
    >
      {/* Top Handle */}
      <Handle 
        type="target" 
        position={Position.Top} 
        id="top" 
        className="w-2 h-2" 
      />
      
      {/* Left Handle */}
      <Handle 
        type="source" 
        position={Position.Left} 
        id="left" 
        className="w-2 h-2" 
      />
      
      {/* Content */}
      <div className="flex flex-row items-center justify-center gap-3">
        {Icon && (
          <div className={`${styles.iconBg} p-1.5 rounded-lg`}>
            <Icon className={`${styles.icon} w-5 h-5`} />
          </div>
        )}
        <div>
          <h3 className="font-semibold text-base">{data.title}</h3>
        </div>
      </div>

      {/* Right Handle */}
      <Handle 
        type="source" 
        position={Position.Right} 
        id="right" 
        className="w-2 h-2" 
      />
      
      {/* Bottom Handle */}
      <Handle 
        type="source" 
        position={Position.Bottom} 
        id="bottom" 
        className="w-2 h-2" 
      />

      {/* Hover Effect */}
      <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
    </div>
  );
});

// Add display name for debugging
NodeCard.displayName = 'NodeCard';

export default NodeCard; 