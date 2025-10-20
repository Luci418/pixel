import { useSubscribers } from '@/hooks/useSubscribers';
import { useNodes } from '@/hooks/useNodes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, DollarSign, Radio, Activity } from 'lucide-react';
import { useMemo } from 'react';

export default function Dashboard() {
  const { subscribers } = useSubscribers();
  const { nodes } = useNodes();

  const stats = useMemo(() => {
    const activeSubscribers = subscribers.filter((s) => s.status === 'active').length;
    const inactiveSubscribers = subscribers.filter((s) => s.status === 'inactive').length;
    const totalRevenue = subscribers
      .filter((s) => s.status === 'active')
      .reduce((sum, s) => sum + s.monthlyFee, 0);
    const onlineNodes = nodes.filter((n) => n.status === 'online').length;

    return {
      totalSubscribers: subscribers.length,
      activeSubscribers,
      inactiveSubscribers,
      totalRevenue,
      onlineNodes,
      totalNodes: nodes.length,
    };
  }, [subscribers, nodes]);

  const recentSubscribers = useMemo(() => {
    return [...subscribers]
      .sort((a, b) => new Date(b.installationDate).getTime() - new Date(a.installationDate).getTime())
      .slice(0, 5);
  }, [subscribers]);

  const criticalNodes = useMemo(() => {
    return nodes.filter((node) => {
      const loadPercentage = (node.currentLoad / node.capacity) * 100;
      return loadPercentage > 80 || node.status !== 'online';
    });
  }, [nodes]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your cable TV subscriber network
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSubscribers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeSubscribers} active, {stats.inactiveSubscribers} inactive
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">From active subscribers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network Equipment</CardTitle>
            <Radio className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalNodes}</div>
            <p className="text-xs text-muted-foreground">
              {stats.onlineNodes} online, {stats.totalNodes - stats.onlineNodes} offline
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((stats.onlineNodes / stats.totalNodes) * 100).toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground">Uptime percentage</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Subscribers */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Subscribers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSubscribers.map((subscriber) => (
                <div
                  key={subscriber.id}
                  className="flex items-center justify-between border-b pb-3 last:border-0"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{subscriber.name}</p>
                    <p className="text-sm text-muted-foreground">{subscriber.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        subscriber.status === 'active'
                          ? 'success'
                          : subscriber.status === 'suspended'
                          ? 'warning'
                          : 'outline'
                      }
                    >
                      {subscriber.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Critical Nodes */}
        <Card>
          <CardHeader>
            <CardTitle>Network Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {criticalNodes.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  All network equipment operating normally
                </p>
              ) : (
                criticalNodes.map((node) => {
                  const loadPercentage = (node.currentLoad / node.capacity) * 100;
                  return (
                    <div
                      key={node.id}
                      className="flex items-center justify-between border-b pb-3 last:border-0"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{node.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Load: {node.currentLoad}/{node.capacity} ({loadPercentage.toFixed(0)}%)
                        </p>
                      </div>
                      <Badge
                        variant={
                          node.status === 'offline'
                            ? 'destructive'
                            : node.status === 'maintenance'
                            ? 'warning'
                            : loadPercentage > 90
                            ? 'destructive'
                            : 'warning'
                        }
                      >
                        {node.status === 'online' ? 'High Load' : node.status}
                      </Badge>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
