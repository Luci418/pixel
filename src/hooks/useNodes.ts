import { useLocalStorage } from './useLocalStorage';
import type { NetworkNode } from '@/types';
import { mockNodes } from '@/data/mockData';

export function useNodes() {
  const [nodes, setNodes] = useLocalStorage<NetworkNode[]>(
    'cable-tv-nodes',
    mockNodes
  );

  const addNode = (node: Omit<NetworkNode, 'id'>) => {
    const newNode: NetworkNode = {
      ...node,
      id: `node-${Date.now()}`,
    };
    setNodes([...nodes, newNode]);
    return newNode;
  };

  const updateNode = (id: string, updates: Partial<NetworkNode>) => {
    setNodes(nodes.map((node) => (node.id === id ? { ...node, ...updates } : node)));
  };

  const deleteNode = (id: string) => {
    setNodes(nodes.filter((node) => node.id !== id));
  };

  const getNodeById = (id: string) => {
    return nodes.find((node) => node.id === id);
  };

  return {
    nodes,
    addNode,
    updateNode,
    deleteNode,
    getNodeById,
  };
}
