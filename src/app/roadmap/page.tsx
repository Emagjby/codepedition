"use client";

import LoggedInLayout from "@/components/LoggedInLayout";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Map as MapIcon, X, ChevronUp } from "lucide-react";
import NodeCard from "@/components/NodeCard";
import ChapterChangeCircle from "@/components/ChapterChangeCircle";
import BackgroundElements from "@/components/BackgroundElements";
// @ts-ignore - Suppress all ReactFlow type errors
import ReactFlow, { NodeTypes, NodeMouseHandler, ReactFlowProvider, Node } from 'reactflow';
import 'reactflow/dist/style.css';

// Import data fetching functions
import { fetchRoadmapData, fetchRoadmaps, fetchChapters, getChapterByNumber } from "@/data/fetchRoadmapData";

// Define node types for ReactFlow
const nodeTypes: NodeTypes = {
  roadmapNode: NodeCard as any,
  chapterChangeCircle: ChapterChangeCircle as any
};

// Create a Flow component to use the ReactFlow hooks
function Flow({ 
  nodes, 
  edges,
  onChapterChange 
}: { 
  nodes: any[], 
  edges: any[],
  onChapterChange: (chapterNumber: number) => void 
}) {
  const flowContainerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [activeNode, setActiveNode] = useState<Node | null>(null);
  
  // Reset visibility when nodes/edges change
  useEffect(() => {
    // Reset animation state when new data arrives
    setVisible(false);
    
    // Short delay before showing to ensure DOM updates
    const timer = setTimeout(() => {
      setVisible(true);
      // If we have a flow instance, fit view after data loads
      if (reactFlowInstance) {
        setTimeout(() => {
          reactFlowInstance.fitView({ padding: 0.3 });
        }, 50);
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [nodes, edges, reactFlowInstance]);

  const handleNodeClick: NodeMouseHandler = (event: React.MouseEvent, node: Node) => {
    console.log('Node clicked:', node.id, node.data?.title);
    
    if (node.type === "chapterChangeCircle" && node.data?.nextChapter) {
      // Handle chapter change
      const nextChapter = parseInt(node.data.nextChapter, 10);
      if (!isNaN(nextChapter)) {
        onChapterChange(nextChapter);
      }
    } else {
      // Show node info in modal/toast instead of alert
      setActiveNode(node);
      setTimeout(() => {
        // Auto-hide after 3 seconds
        setActiveNode(null);
      }, 3000);
    }
  };
  
  // Only render ReactFlow when we actually have nodes
  if (!nodes || nodes.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-lg text-gray-500">Preparing roadmap data...</div>
      </div>
    );
  }

  return (
    <div ref={flowContainerRef} className="h-full w-full relative">
      {/* Add background elements */}
      <BackgroundElements opacity={0.2} elementCount={8} />
      
      {/* Node info tooltip/modal */}
      {activeNode && (
        <div className="absolute top-4 right-4 z-50 bg-white shadow-lg rounded-lg p-4 border border-gray-200 max-w-xs animate-fade-in">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-lg">{activeNode.data?.title}</h3>
            <button onClick={() => setActiveNode(null)} className="text-gray-500 hover:text-gray-700">
              <X size={18} />
            </button>
          </div>
          <p className="text-sm text-gray-600">Type: {activeNode.data?.type || "Default"}</p>
          {activeNode.data?.estimatedTime && (
            <p className="text-sm text-gray-600">
              Estimated time: {activeNode.data.estimatedTime}
            </p>
          )}
        </div>
      )}
      
      <style jsx global>{`
        .react-flow__attribution {
          display: none;
        }
        .react-flow__pane {
          cursor: default !important;
        }
        .react-flow__node {
          cursor: pointer !important;
          pointer-events: all !important;
          opacity: ${visible ? 1 : 0};
          transition: all 0.2s ease-out;
          transform-origin: center center;
        }
        .react-flow__node:hover {
          transform: scale(1.02);
          z-index: 10;
        }
        .react-flow__handle {
          opacity: 0;
          width: 15px;
          height: 15px;
          pointer-events: all;
          border: none;
          background-color: transparent;
        }
        .react-flow__handle-left {
          left: -10px;
        }
        .react-flow__handle-right {
          right: -10px;
        }
        .react-flow__handle-top {
          top: -10px;
        }
        .react-flow__handle-bottom {
          bottom: -10px;
        }
        .react-flow__edge-path {
          stroke-width: 2;
          opacity: ${visible ? 1 : 0};
          transition: opacity 0.3s ease-in-out;
        }
        .react-flow__edge.selected .react-flow__edge-path {
          stroke: #000000;
        }
        .react-flow__edge-text {
          font-size: 12px;
          fill: #000000;
        }
        html, body {
          overflow: hidden;
          height: 100%;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        className="bg-transparent"
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnDoubleClick={false}
        zoomOnPinch={false}
        preventScrolling={true}
        onNodeClick={handleNodeClick}
        onInit={setReactFlowInstance}
        key={`flow-${nodes.length}-${edges.length}`} // Force re-render when data changes
      />
    </div>
  );
}

// Wrap the Flow component with the ReactFlow provider
export default function RoadmapPage() {
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentChapter, setCurrentChapter] = useState(1); // Current chapter default to 1
  const [chapters, setChapters] = useState<any[]>([]); 
  const [currentChapterTitle, setCurrentChapterTitle] = useState(""); // Title of current chapter

  // Fetch available roadmaps on component mount
  useEffect(() => {
    async function loadRoadmaps() {
      try {
        const availableRoadmaps = await fetchRoadmaps();
        setRoadmaps(availableRoadmaps);
        
        // Default to Frontend roadmap by ID
        const frontendRoadmapId = "2000c2fd-17fb-4473-8f32-c8fefebcea58";
        const frontendRoadmap = availableRoadmaps.find(roadmap => roadmap.id === frontendRoadmapId);
        
        // Select frontend roadmap if available, otherwise first roadmap
        if (frontendRoadmap) {
          setSelectedRoadmap(frontendRoadmap);
        } else if (availableRoadmaps.length > 0) {
          setSelectedRoadmap(availableRoadmaps[0]);
        }
      } catch (error) {
        console.error("Failed to load roadmaps:", error);
      }
    }
    
    loadRoadmaps();
  }, []);
  
  // Load roadmap data and chapters when selected roadmap changes
  useEffect(() => {
    async function loadRoadmapData() {
      if (!selectedRoadmap) return;
      
      setLoading(true);
      // Clear previous data
      setNodes([]);
      setEdges([]);
      setChapters([]);
      setCurrentChapterTitle("");
      
      try {
        // Fetch roadmap data - all nodes and edges
        const { nodes: allRoadmapNodes, edges: allRoadmapEdges } = await fetchRoadmapData(selectedRoadmap.id);
        
        // Fetch chapters data
        let roadmapChapters = await fetchChapters(selectedRoadmap.id);
        console.log("Raw chapters response:", roadmapChapters);
        
        // If no chapters were found, create a hardcoded test chapter based on the sample data
        if (!roadmapChapters || roadmapChapters.length === 0) {
          console.warn("No chapters found from database. Creating a test chapter.");
          
          // Create a test chapter matching the expected format
          const testChapter = {
            id: "92f1b84e-d46d-4ae7-8092-b96e0a1ee1dc",
            title: "Chapter 1: Introduction",
            roadmap_id: selectedRoadmap.id,
            num_id: "1"
          };
          
          roadmapChapters = [testChapter];
        }
        
        setChapters(roadmapChapters);
        
        // Additional debugging for chapter data structure
        if (roadmapChapters.length > 0) {
          console.log("Chapter data structure example:", JSON.stringify(roadmapChapters[0]));
          console.log("Types of chapter fields:", {
            id: typeof roadmapChapters[0].id,
            title: typeof roadmapChapters[0].title,
            roadmap_id: typeof roadmapChapters[0].roadmap_id,
            num_id: typeof roadmapChapters[0].num_id,
            num_id_value: roadmapChapters[0].num_id
          });
        }
        
        // Set current chapter title
        const chapter = roadmapChapters.find(ch => {
          // Handle potential type inconsistencies between string and number
          const chapterNumId = typeof ch.num_id === 'string' ? parseInt(ch.num_id, 10) : ch.num_id;
          console.log(`Comparing chapter num_id ${ch.num_id} (${chapterNumId}) with currentChapter ${currentChapter}`);
          return chapterNumId === currentChapter;
        });
        
        console.log("Current chapter:", currentChapter, "Found chapter:", chapter);
        
        if (chapter) {
          setCurrentChapterTitle(chapter.title);
          console.log("Setting chapter title to:", chapter.title);
        } else {
          console.warn("No chapter found with num_id:", currentChapter);
          // Set to "Unavailable" instead of using the first chapter
          setCurrentChapterTitle("Unavailable");
          console.log("Setting chapter title to: Unavailable");
        }
        
        // Filter nodes for the current chapter only
        const chapterNodes = allRoadmapNodes.filter(node => 
          // Include nodes from current chapter and chapter change nodes that point to next chapter
          String(node.chapter) === String(currentChapter) || 
          (node.type === 'chapterChangeCircle' && node.data.nextChapter && parseInt(node.data.nextChapter) > currentChapter)
        );
        
        // Filter edges to only include connections between visible nodes
        const chapterNodeIds = new Set(chapterNodes.map(node => node.id));
        const chapterEdges = allRoadmapEdges.filter(edge =>
          chapterNodeIds.has(edge.source) && chapterNodeIds.has(edge.target)
        );
        
        // Only set the state when we have valid data
        if (chapterNodes && chapterNodes.length > 0) {
          setNodes(chapterNodes);
          setEdges(chapterEdges);
        } else {
          console.warn("No nodes found for this chapter:", currentChapter);
        }
      } catch (error) {
        console.error("Failed to load roadmap data:", error);
      } finally {
        setLoading(false);
      }
    }
    
    loadRoadmapData();
  }, [selectedRoadmap, currentChapter]);

  // Handle changing chapters - this will be called when a user clicks a chapter change node
  const handleChapterChange = (chapterNumber: number) => {
    console.log(`Changing to chapter ${chapterNumber}`);
    setCurrentChapter(chapterNumber);
  };

  return (
    <LoggedInLayout>
      <BackgroundElements opacity={0.2} elementCount={8} />
      <div className="h-screen overflow-hidden">
        {/* Header row with full width */}
        <div className="w-full px-4 mb-2">
          <div className="flex items-center justify-between">
            {/* Chapter Title - Only show if we have a valid chapter title */}
            {!loading && currentChapterTitle && (
              <>
                <div className="bg-white/90 backdrop-blur-sm py-2 px-5 rounded-full shadow-sm border border-gray-200 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <h2 className="text-base font-medium text-gray-800 whitespace-nowrap">
                    {currentChapterTitle}
                  </h2>
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                </div>

                {/* Previous Chapter Button - Only show when currentChapter > 1 */}
                {currentChapter > 1 && (
                  <div className="relative group">
                    <button 
                      onClick={() => handleChapterChange(currentChapter - 1)}
                      className="bg-white/90 backdrop-blur-sm py-2 px-3 rounded-full shadow-sm border border-gray-200 hover:border-gray-300 transition-all duration-200 ease-in-out flex items-center justify-center cursor-pointer hover:scale-[1.02] hover:shadow-md animate-fade-in"
                      aria-label="Go to previous chapter"
                    >
                      <ChevronUp className="w-4 h-4 text-gray-600 transition-transform duration-200 ease-in-out group-hover:-translate-y-0.5" />
                    </button>
                    {/* Tooltip */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2.5 px-2.5 py-1 bg-white/95 backdrop-blur-sm text-gray-700 text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-sm border border-gray-200">
                      Previous Chapter
                      <div className="absolute left-1/2 -translate-x-1/2 -top-1.5 w-2 h-2 bg-white/95 border-t border-l border-gray-200 rotate-45"></div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Roadmap Selector */}
            <div className="relative max-w-sm">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="cursor-pointer w-full flex items-center justify-between gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-gray-300 hover:scale-[1.02] hover:shadow-md transition-all transition-transform duration-200 group"
                disabled={loading}
              >
                <div className="flex items-center gap-3">
                  <MapIcon className="w-5 h-5 text-blue-600" />
                  <span className="text-lg font-medium text-gray-700">
                    {selectedRoadmap?.title || "Select Roadmap"}
                  </span>
                </div>
                <ChevronDown 
                  className={`w-5 h-5 text-gray-400 transition-transform duration-200 group-hover:text-gray-600 ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`} 
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div
                  className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden
                    origin-top transform scale-95 opacity-0 animate-dropdown-open"
                >
                  {roadmaps.map((roadmap) => (
                    <button
                      key={roadmap.id}
                      onClick={() => {
                        setSelectedRoadmap(roadmap);
                        setIsDropdownOpen(false);
                      }}
                      className={`cursor-pointer w-full flex items-center gap-3 px-6 py-4 text-left hover:bg-gray-50 transition-colors duration-150 ${
                        selectedRoadmap?.id === roadmap.id
                          ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                          : 'text-gray-700 border-l-4 border-transparent'
                      }`}
                    >
                      <MapIcon className={`w-5 h-5 ${
                        selectedRoadmap?.id === roadmap.id ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                      <span className="text-lg font-medium">{roadmap.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ReactFlow Implementation */}
        <div className="h-[calc(100vh-110px)] overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-xl text-gray-500">Loading roadmap data...</div>
            </div>
          ) : !selectedRoadmap ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-xl text-gray-500">Please select a roadmap</div>
            </div>
          ) : nodes.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-xl text-gray-500">No nodes found for this roadmap</div>
            </div>
          ) : (
            <ReactFlowProvider>
              <Flow 
                nodes={nodes} 
                edges={edges}
                onChapterChange={handleChapterChange} 
              />
            </ReactFlowProvider>
          )}
        </div>
      </div>
    </LoggedInLayout>
  );
} 