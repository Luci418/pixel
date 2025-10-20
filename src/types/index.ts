export interface Subscriber {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  latitude: number;
  longitude: number;
  nodeId: string;
  status: 'active' | 'inactive' | 'suspended';
  packageType: 'basic' | 'premium' | 'ultimate';
  installationDate: string;
  monthlyFee: number;
}

export interface NetworkNode {
  id: string;
  name: string;
  type: 'optical-node' | 'amplifier' | 'splitter';
  status: 'online' | 'offline' | 'maintenance';
  latitude: number;
  longitude: number;
  address: string;
  capacity: number;
  currentLoad: number;
  parentNodeId?: string;
  lastMaintenance?: string;
}

export interface DashboardStats {
  totalSubscribers: number;
  activeSubscribers: number;
  inactiveSubscribers: number;
  totalRevenue: number;
  totalNodes: number;
  onlineNodes: number;
  offlineNodes: number;
}
