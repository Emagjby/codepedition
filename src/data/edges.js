import { MarkerType } from 'reactflow';
import lineStyles from './lineStyles.json';

const black = '#000000', blue = '#3b82f6'

export const initialEdges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    sourceHandle: 'left',
    style: { 
      stroke: black, 
      strokeWidth: 2,
      ...lineStyles.solid
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: black,
    }
  },
  {
    id: 'e1-3',
    source: '1',
    target: '3',
    sourceHandle: 'right',
    style: { 
      stroke: black, 
      strokeWidth: 2,
      ...lineStyles.solid
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: black,
    }
  },
  {
    id: 'e1-4',
    source: '1',
    target: '4',
    sourceHandle: 'bottom',
    style: { 
      stroke: black, 
      strokeWidth: 2,
      ...lineStyles.solid
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: black,
    }
  },
  {
    id: 'e4-5',
    source: '4',
    target: '5',
    sourceHandle: 'bottom',
    style: { 
      stroke: blue,
      strokeWidth: 2,
      ...lineStyles.solid
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: blue,
    }
  }
]; 