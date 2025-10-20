import { useState, useMemo } from 'react';
import { useSubscribers } from '@/hooks/useSubscribers';
import { useNodes } from '@/hooks/useNodes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Plus, MapPin, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import SubscriberMap from '@/components/SubscriberMap';
import type { Subscriber } from '@/types';

export default function Subscribers() {
  const { subscribers } = useSubscribers();
  const { nodes } = useNodes();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | undefined>();

  const filteredSubscribers = useMemo(() => {
    return subscribers.filter((subscriber) => {
      const matchesSearch =
        subscriber.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subscriber.address.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' || subscriber.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [subscribers, searchTerm, statusFilter]);

  const getNodeName = (nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId);
    return node ? node.name : 'Unknown';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Subscribers</h2>
          <p className="text-muted-foreground">Manage your cable TV subscribers</p>
        </div>
        <Link to="/subscribers/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Subscriber
          </Button>
        </Link>
      </div>

      {/* Map View */}
      <Card>
        <CardHeader>
          <CardTitle>Subscriber Locations</CardTitle>
        </CardHeader>
        <CardContent>
          <SubscriberMap
            subscribers={filteredSubscribers}
            nodes={nodes}
            selectedSubscriber={selectedSubscriber}
            height="400px"
          />
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Subscriber List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('all')}
              >
                All
              </Button>
              <Button
                variant={statusFilter === 'active' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('active')}
              >
                Active
              </Button>
              <Button
                variant={statusFilter === 'inactive' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('inactive')}
              >
                Inactive
              </Button>
              <Button
                variant={statusFilter === 'suspended' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('suspended')}
              >
                Suspended
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Network Node</TableHead>
                  <TableHead>Package</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Monthly Fee</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscribers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground">
                      No subscribers found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubscribers.map((subscriber) => (
                    <TableRow key={subscriber.id}>
                      <TableCell className="font-medium">{subscriber.name}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{subscriber.email}</div>
                          <div className="text-muted-foreground">{subscriber.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <div className="text-sm truncate">{subscriber.address}</div>
                        <div className="text-xs text-muted-foreground">
                          {subscriber.latitude.toFixed(4)}, {subscriber.longitude.toFixed(4)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{getNodeName(subscriber.nodeId)}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{subscriber.packageType}</Badge>
                      </TableCell>
                      <TableCell>
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
                      </TableCell>
                      <TableCell>${subscriber.monthlyFee}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedSubscriber(subscriber)}
                          >
                            <MapPin className="h-4 w-4" />
                          </Button>
                          <Link to={`/subscribers/${subscriber.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
