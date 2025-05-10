"use client";

import React, { useState, useEffect } from "react";
import { Code, Database, Globe, PenTool, Layers, Server, Layout, Cloud, GitBranch, Cpu, Settings } from "lucide-react";

// Custom hook to get window dimensions
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    
    // Add event listener
    window.addEventListener("resize", handleResize);
    
    // Call handler right away so state gets updated with initial window size
    handleResize();
    
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  
  return windowSize;
}

interface BackgroundElementsProps {
  opacity?: number;
  elementCount?: number; 
}

interface ElementPosition {
  left: number;
  top: number;
  size: number;
  iconIndex: number; // Track which icon was used
}

// Add responsive floating background elements
export default function BackgroundElements({ opacity = 0.2, elementCount = 12 }: BackgroundElementsProps) {
  const { width, height } = useWindowSize();
  const [elements, setElements] = useState<React.ReactNode[]>([]);
  
  // Use a fixed element count instead of calculating based on viewport
  const totalElements = elementCount;
  
  // Generate elements once when component mounts or when dependencies change
  useEffect(() => {
    if (width > 0) { // Only generate when we have valid dimensions
      setElements(generateRandomElements());
    }
  }, [width, height, elementCount]);
  
  // Icons to use
  const icons = [
    { icon: Code, color: "text-blue-400" },
    { icon: Database, color: "text-purple-400" },
    { icon: Globe, color: "text-amber-400" },
    { icon: PenTool, color: "text-green-400" },
    { icon: Layers, color: "text-blue-300" },
    { icon: Server, color: "text-red-300" },
    { icon: Layout, color: "text-indigo-400" },
    { icon: Cloud, color: "text-cyan-400" },
    { icon: GitBranch, color: "text-orange-300" },
    { icon: Cpu, color: "text-emerald-400" },
    { icon: Settings, color: "text-violet-400" }
  ];
  
  // Animation classes
  const animations = [
    "animate-float-slow",
    "animate-float-medium"
  ];
  
  // Rotations
  const rotations = [
    "rotate-0",
    "rotate-6",
    "rotate-12", 
    "rotate-45",
    "-rotate-12"
  ];
  
  // Check if two elements overlap
  const checkOverlap = (pos1: ElementPosition, pos2: ElementPosition): boolean => {
    // Calculate min distance needed to prevent overlap (half the sum of their sizes plus some margin)
    const minDistance = (pos1.size + pos2.size) / 2 + 50;
    
    // Calculate actual distance between elements
    const dx = Math.abs(pos1.left - pos2.left);
    const dy = Math.abs(pos1.top - pos2.top);
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    return distance < minDistance;
  };
  
  // Generate random elements that don't overlap and are better distributed
  const generateRandomElements = (): React.ReactNode[] => {
    const elementArray: React.ReactNode[] = [];
    const positions: ElementPosition[] = [];
    
    // Get a random icon index that's not too close to existing icons of the same type
    const getUniqueIconIndex = (left: number, top: number): number => {
      const nearbyDistance = 30; // How close is "nearby" in percentage terms
      const maxAttempts = 10;
      
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        // Get a random icon
        const randomIndex = Math.floor(Math.random() * icons.length);
        
        // Check if this icon type is already nearby
        const hasSameIconNearby = positions.some(pos => {
          // Only check if it's the same icon type
          if (pos.iconIndex !== randomIndex) return false;
          
          // Check if it's nearby
          const dx = Math.abs(pos.left - left);
          const dy = Math.abs(pos.top - top);
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          return distance < nearbyDistance;
        });
        
        // If this icon type isn't nearby, use it
        if (!hasSameIconNearby) return randomIndex;
      }
      
      // If we can't find a unique icon after max attempts, just return a random one
      return Math.floor(Math.random() * icons.length);
    };
    
    // First, make sure we place elements in the bottom-right
    const bottomRight = { xMin: 60, xMax: 90, yMin: 60, yMax: 90 };
    
    // Force some elements in the bottom-right corner (up to 1/4 of the total)
    const bottomRightCount = Math.min(3, Math.ceil(totalElements / 4));
    
    // Place elements in bottom-right (with less spacing to ensure they fit)
    for (let i = 0; i < bottomRightCount; i++) {
      // Generate position in bottom-right area
      let left = Math.random() * (bottomRight.xMax - bottomRight.xMin) + bottomRight.xMin;
      let top = Math.random() * (bottomRight.yMax - bottomRight.yMin) + bottomRight.yMin;
      
      // Add small randomness to avoid perfect alignments
      left += (Math.random() - 0.5) * 5;
      top += (Math.random() - 0.5) * 5;
      
      // Keep within bounds
      left = Math.max(bottomRight.xMin, Math.min(bottomRight.xMax, left));
      top = Math.max(bottomRight.yMin, Math.min(bottomRight.yMax, top));
      
      // Get a unique icon for this position
      const iconIndex = getUniqueIconIndex(left, top);
      const icon = icons[iconIndex];
      const animation = animations[Math.floor(Math.random() * animations.length)];
      const rotation = rotations[Math.floor(Math.random() * rotations.length)];
      
      // Size variation (16px to 28px)
      const size = Math.floor(Math.random() * 12) + 16;
      
      // Use less restrictive spacing for bottom-right
      let overlaps = false;
      if (positions.length > 0) {
        overlaps = positions.some(pos => {
          const minDistance = (pos.size + size) / 2 + 50; // Increased minimum distance
          
          const dx = Math.abs(pos.left - left);
          const dy = Math.abs(pos.top - top);
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          return distance < minDistance;
        });
      }
      
      // Only add if it doesn't overlap (or this is the first element)
      if (!overlaps || positions.length === 0) {
        positions.push({ left, top, size, iconIndex });
        
        elementArray.push(
          <div 
            key={`element-${elementArray.length}`} 
            style={{ 
              left: `${left}%`, 
              top: `${top}%` 
            }}
            className={`absolute ${icon.color} ${animation} ${rotation}`}
          >
            <icon.icon size={size} />
          </div>
        );
      }
    }
    
    // Divide the rest of the screen into quadrants for better distribution
    const quadrants = [
      { xMin: 5, xMax: 30, yMin: 5, yMax: 30 },    // Top-left
      { xMin: 30, xMax: 55, yMin: 5, yMax: 30 },   // Top-middle
      { xMin: 55, xMax: 90, yMin: 5, yMax: 30 },   // Top-right
      { xMin: 5, xMax: 30, yMin: 30, yMax: 55 },   // Middle-left
      { xMin: 30, xMax: 55, yMin: 30, yMax: 55 },  // Center
      { xMin: 55, xMax: 90, yMin: 30, yMax: 55 },  // Middle-right
      { xMin: 5, xMax: 30, yMin: 55, yMax: 90 },   // Bottom-left
      { xMin: 30, xMax: 55, yMin: 55, yMax: 90 },  // Bottom-middle
    ];
    
    // Ensure we place remaining elements in each quadrant
    const remainingElements = totalElements - Math.min(positions.length, bottomRightCount);
    const elementsPerQuadrant = Math.ceil(remainingElements / quadrants.length);
    
    for (let quadrantIndex = 0; quadrantIndex < quadrants.length; quadrantIndex++) {
      const currentQuadrant = quadrants[quadrantIndex];
      const elementsInThisQuadrant = Math.min(elementsPerQuadrant, 
                                             totalElements - elementArray.length);
      
      if (elementArray.length + elementsInThisQuadrant > totalElements) {
        break; // Don't exceed total elements
      }
      
      // Place elements in this quadrant
      for (let i = 0; i < elementsInThisQuadrant; i++) {
        // Size variation (16px to 30px)
        const size = Math.floor(Math.random() * 15) + 16;
        
        // Try up to 15 times to find a position that doesn't overlap
        let overlaps = true;
        let attempts = 0;
        let left = 0;
        let top = 0;
        let iconIndex = 0;
        
        while (overlaps && attempts < 15) {
          // Random position within the current quadrant
          left = Math.random() * (currentQuadrant.xMax - currentQuadrant.xMin) + currentQuadrant.xMin;
          top = Math.random() * (currentQuadrant.yMax - currentQuadrant.yMin) + currentQuadrant.yMin;
          
          // Add small randomness to avoid perfect alignments
          left += (Math.random() - 0.5) * 10;
          top += (Math.random() - 0.5) * 10;
          
          // Keep within bounds
          left = Math.max(currentQuadrant.xMin, Math.min(currentQuadrant.xMax, left));
          top = Math.max(currentQuadrant.yMin, Math.min(currentQuadrant.yMax, top));
          
          // Get a unique icon for this position
          iconIndex = getUniqueIconIndex(left, top);
          
          // Check against all existing positions with more sensitive distance check
          overlaps = positions.some(pos => {
            // Increase minimum distance significantly to reduce clustering
            const minDistance = (pos.size + size) / 2 + 90; 
            
            const dx = Math.abs(pos.left - left);
            const dy = Math.abs(pos.top - top);
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            return distance < minDistance;
          });
          
          attempts++;
        }
        
        // Get icon and other properties
        const icon = icons[iconIndex];
        const animation = animations[Math.floor(Math.random() * animations.length)];
        const rotation = rotations[Math.floor(Math.random() * rotations.length)];
        
        // If we couldn't find a non-overlapping position after max attempts, 
        // try anyway with the last position we checked
        positions.push({ left, top, size, iconIndex });
        
        // Add the element to our array
        elementArray.push(
          <div 
            key={`element-${elementArray.length}`} 
            style={{ 
              left: `${left}%`, 
              top: `${top}%` 
            }}
            className={`absolute ${icon.color} ${animation} ${rotation}`}
          >
            <icon.icon size={size} />
          </div>
        );
      }
    }
    
    // If we still have room for more elements, fill the rest randomly
    if (elementArray.length < totalElements) {
      const remainingToFill = totalElements - elementArray.length;
      
      for (let i = 0; i < remainingToFill; i++) {
        // Size variation (16px to 30px)
        const size = Math.floor(Math.random() * 15) + 16;
        
        // Try up to 15 times to find a position that doesn't overlap
        let overlaps = true;
        let attempts = 0;
        let left = 0;
        let top = 0;
        
        while (overlaps && attempts < 15) {
          // Random position across the entire container
          left = Math.random() * 85 + 5;
          top = Math.random() * 85 + 5;
          
          // Check against all existing positions
          overlaps = positions.some(pos => {
            const minDistance = (pos.size + size) / 2 + 90;
            
            const dx = Math.abs(pos.left - left);
            const dy = Math.abs(pos.top - top);
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            return distance < minDistance;
          });
          
          attempts++;
        }
        
        // Get a unique icon for this position
        const iconIndex = getUniqueIconIndex(left, top);
        const icon = icons[iconIndex];
        const animation = animations[Math.floor(Math.random() * animations.length)];
        const rotation = rotations[Math.floor(Math.random() * rotations.length)];
        
        positions.push({ left, top, size, iconIndex });
        
        elementArray.push(
          <div 
            key={`element-${elementArray.length}`} 
            style={{ 
              left: `${left}%`, 
              top: `${top}%` 
            }}
            className={`absolute ${icon.color} ${animation} ${rotation}`}
          >
            <icon.icon size={size} />
          </div>
        );
      }
    }
    
    return elementArray;
  };
  
  return (
    <div 
      className="absolute inset-0 overflow-hidden pointer-events-none z-0" 
      style={{ opacity }}
    >
      {elements}
      <style jsx global>{`
        /* Animation keyframes for floating elements */
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        
        .animate-float-medium {
          animation: float-medium 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
} 