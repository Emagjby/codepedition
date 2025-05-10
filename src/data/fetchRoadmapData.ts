import { createClient } from "@/utils/supabase/client";
import { Globe, Code, Rocket, BookOpen, Layers, Server, Database, GitBranch, Cpu } from "lucide-react";
// @ts-ignore - Suppress all ReactFlow type errors
import { MarkerType } from 'reactflow';
import { LucideIcon } from "lucide-react";

// Color mapping for specific colors
const colorValues = {
  black: '#000000',
  blue: '#3b82f6'
};

// Define interfaces for our data
interface RoadmapNode {
  id: string;
  roadmap_id: string;
  title: string;
  type: string | null;
  estimated_time: string | null;
  tail_type: string | null;
  chapter: string | null;
  parent_side: string | null;
  pos_x: string | null;
  pos_y: string | null;
  icon: string | null;
  node_type: string;
  color: string | null;
  tail_color: string | null;
  next_chapter: string | null;
  parent_node_id: string | null;
}

interface Roadmap {
  id: string;
  title: string;
  description: string | null;
}

interface Chapter {
  id: string;
  title: string;
  roadmap_id: string;
  num_id: string | number;
}

interface FlowNode {
  id: string;
  roadmap_id: string;
  type: string;
  position: { x: number; y: number };
  chapter: string | null;
  data: {
    type: string | null;
    title: string;
    icon: LucideIcon | null;
    color: string | null;
    nextChapter: string | null;
    parentNodeId: string | null;
    parentSide: string | null;
    tailColor: string | null;
    tailType: string | null;
  };
}

interface FlowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle: string;
  style: {
    stroke: string;
    strokeWidth: number;
    strokeDasharray?: string;
  };
  markerEnd: {
    type: string;
    width: number;
    height: number;
    color: string;
  };
}

// Icon mapping to convert string names to component references
const iconMap: Record<string, LucideIcon> = {
  Globe,
  Code,
  Rocket,
  BookOpen,
  Layers,
  Server,
  Database,
  GitBranch,
  Cpu
};

/**
 * Fetch all nodes for a specific roadmap from Supabase
 * @param {string} roadmapId - UUID of the roadmap to fetch
 * @returns {Promise<FlowNode[]>} - Array of formatted nodes for ReactFlow
 */
export async function fetchNodes(roadmapId: string): Promise<FlowNode[]> {
  try {
    const supabase = createClient();
    
    const { data: nodes, error } = await supabase
      .from("nodes")
      .select("*")
      .eq("roadmap_id", roadmapId)
      .order("chapter", { ascending: true });
    
    if (error) {
      console.error("Error fetching nodes:", error);
      return [];
    }
    
    if (!nodes) return [];
    
    // Transform nodes into ReactFlow format
    return nodes.map((node: RoadmapNode) => {
      // Convert string position to numbers
      const x = parseFloat(node.pos_x || "0") || 0;
      const y = parseFloat(node.pos_y || "0") || 0;
      
      // Get the icon component from the string name
      const IconComponent = node.icon && iconMap[node.icon] ? iconMap[node.icon] : null;
      
      return {
        id: node.id,
        roadmap_id: node.roadmap_id,
        type: node.node_type,
        position: { x, y },
        chapter: node.chapter,
        data: {
          type: node.type,
          title: node.title,
          icon: IconComponent,
          color: node.color,
          nextChapter: node.next_chapter,
          parentNodeId: node.parent_node_id,
          parentSide: node.parent_side,
          tailColor: node.tail_color,
          tailType: node.tail_type
        }
      };
    });
  } catch (error) {
    console.error("Failed to fetch nodes:", error);
    return [];
  }
}

/**
 * Generate edges based on parent-child relationships in nodes
 * @param {FlowNode[]} nodes - Array of nodes with parent relationships
 * @returns {FlowEdge[]} - Array of edges for ReactFlow
 */
export function generateEdges(nodes: FlowNode[]): FlowEdge[] {
  const edges: FlowEdge[] = [];
  
  console.log("Generating edges from nodes:", nodes);
  
  // Process each node with a parent
  nodes.forEach(node => {
    // Skip nodes without parent info
    if (!node.data.parentNodeId) {
      console.log(`Node ${node.id} (${node.data.title}) has no parent node ID, skipping`);
      return;
    }
    
    console.log(`Processing node ${node.id} (${node.data.title}) with parent ${node.data.parentNodeId}`);
    
    const parentNode = nodes.find(n => n.id === node.data.parentNodeId);
    
    if (!parentNode) {
      console.warn(`Parent node ${node.data.parentNodeId} not found for node ${node.id} (${node.data.title})`);
      return;
    }
    
    // Generate a unique edge ID
    const edgeId = `e${parentNode.id}-${node.id}`;
    
    // Determine source handle based on parent_side
    const sourceHandle = node.data.parentSide || 'bottom';
    console.log(`  Source handle for edge: ${sourceHandle}`);
    
    // Get tail color and type from the node
    const tailColor = node.data.tailColor || 'black'; // Default to black if not specified
    const stroke = colorValues[tailColor as keyof typeof colorValues] || tailColor; // Map specific colors to hex values
    
    const edgeStyle = node.data.tailType === 'dashed' 
      ? { stroke, strokeWidth: 2, strokeDasharray: '5,5' } 
      : { stroke, strokeWidth: 2 };
    
    // Create the edge
    const edge = {
      id: edgeId,
      source: parentNode.id,
      target: node.id,
      sourceHandle: sourceHandle,
      style: edgeStyle,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: stroke,
      }
    };
    
    console.log(`  Created edge: ${edge.id} (${edge.source} -> ${edge.target})`);
    edges.push(edge);
  });
  
  console.log(`Generated ${edges.length} edges total`);
  return edges;
}

/**
 * Fetch all available roadmaps from Supabase
 * @returns {Promise<Roadmap[]>} - Array of roadmaps
 */
export async function fetchRoadmaps(): Promise<Roadmap[]> {
  try {
    const supabase = createClient();
    
    const { data: roadmaps, error } = await supabase
      .from("roadmaps")
      .select("*")
      .order("title", { ascending: true });
    
    if (error) {
      console.error("Error fetching roadmaps:", error);
      return [];
    }
    
    return roadmaps || [];
  } catch (error) {
    console.error("Failed to fetch roadmaps:", error);
    return [];
  }
}

/**
 * Fetch all chapters for a specific roadmap from Supabase
 * @param {string} roadmapId - UUID of the roadmap to fetch chapters for
 * @returns {Promise<Chapter[]>} - Array of chapters for the roadmap
 */
export async function fetchChapters(roadmapId: string): Promise<Chapter[]> {
  try {
    const supabase = createClient();
    console.log("Fetching chapters for roadmap ID:", roadmapId);
    
    // Try with just "chapters" first
    let { data: chapters, error } = await supabase
      .from("chapters")
      .select("*")
      .eq("roadmap_id", roadmapId)
      .order("num_id", { ascending: true });
    
    if (error || !chapters || chapters.length === 0) {
      console.log("First attempt failed with 'chapters', trying with 'public.chapters'");
      
      // If that fails, try with explicit public schema
      const response = await supabase
        .from("public.chapters")
        .select("*")
        .eq("roadmap_id", roadmapId)
        .order("num_id", { ascending: true });
      
      chapters = response.data;
      error = response.error;
    
    if (error) {
        console.error("Error fetching chapters with public.chapters:", error);
        
        // One last attempt - try using raw SQL query
        const { data: rawData, error: rawError } = await supabase
          .rpc('get_chapters_for_roadmap', { roadmap_id_param: roadmapId });
        
        if (rawError) {
          console.error("Raw query attempt failed:", rawError);
      return [];
        } else {
          console.log("Raw SQL query succeeded:", rawData);
          return rawData || [];
        }
      }
    }
    
    console.log("Chapters response:", chapters);
    return chapters || [];
  } catch (error) {
    console.error("Failed to fetch chapters:", error);
    return [];
  }
}

/**
 * Get a specific chapter by number for a roadmap
 * @param {string} roadmapId - UUID of the roadmap
 * @param {number} chapterNumber - The chapter number (num_id) to fetch
 * @returns {Promise<Chapter|null>} - The chapter or null if not found
 */
export async function getChapterByNumber(roadmapId: string, chapterNumber: number): Promise<Chapter|null> {
  try {
    const chapters = await fetchChapters(roadmapId);
    return chapters.find(chapter => chapter.num_id === chapterNumber) || null;
  } catch (error) {
    console.error("Failed to get chapter by number:", error);
    return null;
  }
}

/**
 * Fetch all data needed for a roadmap
 * @param {string} roadmapId - UUID of the roadmap to fetch
 * @returns {Promise<{nodes: FlowNode[], edges: FlowEdge[]}>} - Object containing nodes and edges
 */
export async function fetchRoadmapData(roadmapId: string): Promise<{
  nodes: FlowNode[];
  edges: FlowEdge[];
}> {
  try {
    // Get nodes for the roadmap
    const nodes = await fetchNodes(roadmapId);
    
    // Generate edges from node relationships
    const edges = generateEdges(nodes);
    
    return { nodes, edges };
  } catch (error) {
    console.error("Failed to fetch roadmap data:", error);
    return { nodes: [], edges: [] };
  }
} 