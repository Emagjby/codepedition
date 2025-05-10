import { Globe, Code, Rocket, BookOpen } from "lucide-react";

// Define the initial nodes
export const initialNodes = [
  {
    id: '1',
    roadmap_id: 1,
    type: 'roadmapNode',
    position: { x: 0, y: 0 },
    chapter: 1,
    data: { 
      type: 'required',
      title: 'Intro to Web Development',
      icon: Globe,
      color: 'blue'
    }
  },
  {
    id: '2',
    roadmap_id: 1,
    type: 'roadmapNode',
    position: { x: -250, y: 150 },
    chapter: 1,
    data: { 
      type: 'required',
      title: 'How the Internet Works',
      icon: Code,
      color: 'purple'
    }
  },
  {
    id: '3',
    roadmap_id: 1,
    type: 'roadmapNode',
    position: { x: 275, y: 150 },
    chapter: 1,
    data: { 
      type: 'required',
      title: 'Web Development Roles',
      icon: Rocket,
      color: 'amber'
    }
  },
  {
    id: '4',
    roadmap_id: 1,
    type: 'roadmapNode',
    position: { x: -8.5, y: 300 },
    chapter: 1,
    data: {
      type: 'required',
      title: 'Key Front-End Technologies', 
      icon: BookOpen,
      color: 'blue'
    }
  },
  {
    id: '5',
    roadmap_id: 1,
    type: 'chapterChangeCircle',
    position: { x: 91.3, y: 430 }, 
    chapter: 1,
    data: {
      nextChapter: 2,
      title: 'Next Chapter'
    }
  }
]; 