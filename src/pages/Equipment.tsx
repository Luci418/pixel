import { useState, useMemo } from 'react';
import { useNodes } from '@/hooks/useNodes';
import { useSubscribers } from '@/hooks/useSubscribers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Radio, Server, Network } from 'lucide-react';
import SubscriberMap from '@/components/SubscriberMap';

export default function Equipment() {
  const { nodes } = useNodes();
  const { subscribers } = useSubscribers();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const nodeStats = useMemo(() => {
    return nodes.map((node) => {
      const connectedSubscribers = subscribers.filter(
        (sub) => sub.nodeId === node.id && sub.status === 'active'
      );
      const loadPercentage = (node.currentLoad / node.capacity) * 100;

      return {
        ...node,
        connectedCount: connectedSubscribers.length,
        loadPercentage,
        status: node.status,
      };
    });
  }, [nodes, subscribers]);

  const selectedNode = selectedNodeId
    ? nodeStats.find((n) => n.id === selectedNodeId)
    : null;

  const selectedNodeSubscribers = selectedNodeId
    ? subscribers.filter((sub) => sub.nodeId === selectedNodeId)
    : [];

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'optical-node':
        return <Server className="h-5 w-5" />;
      case 'amplifier':
        return <Radio className="h-5 w-5" />;
      case 'splitter':
        return <Network className="h-5 w-5" />;
      default:
        return <Radio className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'success';
      case 'offline':
        return 'destructive';
      case 'maintenance':
        return 'warning';
      default:
        return 'outline';
    }
  };

  const getLoadColor = (percentage: number) => {
    if (percentage > 90) return 'destructive';
    if (percentage > 80) return 'warning';
    return 'success';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Network Equipment</h2>
        <p className="text-muted-foreground">
          Monitor and manage your cable network infrastructure
        </p>
      </div>

      {/* Network Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Equipment</CardTitle>
            <Radio className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nodes.length}</div>
            <p className="text-xs text-muted-foreground">
              {nodes.filter((n) => n.type === 'optical-node').length} optical nodes,{' '}
              {nodes.filter((n) => n.type === 'amplifier').length} amplifiers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Online Status</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {nodes.filter((n) => n.status === 'online').length}/{nodes.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {((nodes.filter((n) => n.status === 'online').length / nodes.length) * 100).toFixed(0)}% uptime
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Load</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(
                nodeStats.reduce((sum, n) => sum + n.loadPercentage, 0) / nodeStats.length
              ).toFixed(0)}
              %
            </div>
            <p className="text-xs text-muted-foreground">Across all equipment</p>
          </CardContent>
        </Card>
      </div>

      {/* Network Map */}
      <Card>
        <CardHeader>
          <CardTitle>Network Map</CardTitle>
        </CardHeader>
        <CardContent>
          <SubscriberMap
            subscribers={selectedNodeId ? selectedNodeSubscribers : subscribers}
            nodes={selectedNode ? [selectedNode] : nodes}
            height="400px"
          />
        </CardContent>
      </Card>

      {/* Equipment Table */}
      <Card>
        <CardHeader>
          <CardTitle>Equipment List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Equipment</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Load</TableHead>
                  <TableHead>Connected Subs</TableHead>
                  <TableHead>Last Maintenance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {nodeStats.map((node) => (
                  <TableRow
                    key={node.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() =>
                      setSelectedNodeId(selectedNodeId === node.id ? null : node.id)
                    }
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {getNodeIcon(node.type)}
                        {node.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{node.type}</Badge>
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      <div className="text-sm truncate">{node.address}</div>
                      <div className="text-xs text-muted-foreground">
                        {node.latitude.toFixed(4)}, {node.longitude.toFixed(4)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(node.status) as any}>
                        {node.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{node.capacity}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="text-sm">
                          {node.currentLoad}/{node.capacity}
                        </div>
                        <Badge variant={getLoadColor(node.loadPercentage) as any}>
                          {node.loadPercentage.toFixed(0)}%
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{node.connectedCount}</TableCell>
                    <TableCell>
                      {node.lastMaintenance
                        ? new Date(node.lastMaintenance).toLocaleDateString()
                        : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {selectedNode && (
        <Card>
          <CardHeader>
            <CardTitle>Connected Subscribers - {selectedNode.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {selectedNodeSubscribers.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No subscribers connected to this equipment
                </p>
              ) : (
                selectedNodeSubscribers.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div>
                      <p className="font-medium">{sub.name}</p>
                      <p className="text-sm text-muted-foreground">{sub.address}</p>
                    </div>
                    <Badge
                      variant={
                        sub.status === 'active'
                          ? 'success'
                          : sub.status === 'suspended'
                          ? 'warning'
                          : 'outline'
                      }
                    >
                      {sub.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
