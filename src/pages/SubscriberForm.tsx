import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSubscribers } from '@/hooks/useSubscribers';
import { useNodes } from '@/hooks/useNodes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { ArrowLeft, MapPin } from 'lucide-react';
import SubscriberMap from '@/components/SubscriberMap';
import type { Subscriber } from '@/types';

export default function SubscriberForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addSubscriber, updateSubscriber, getSubscriberById } =
    useSubscribers();
  const { nodes } = useNodes();

  const isEditMode = id !== 'new';
  const existingSubscriber = isEditMode ? getSubscriberById(id!) : null;

  const [formData, setFormData] = useState<{
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
  }>({
    name: '',
    email: '',
    phone: '',
    address: '',
    latitude: 40.7128,
    longitude: -74.006,
    nodeId: '',
    status: 'active',
    packageType: 'basic',
    installationDate: new Date().toISOString().split('T')[0],
    monthlyFee: 49.99,
  });

  useEffect(() => {
    if (existingSubscriber) {
      setFormData({
        name: existingSubscriber.name,
        email: existingSubscriber.email,
        phone: existingSubscriber.phone,
        address: existingSubscriber.address,
        latitude: existingSubscriber.latitude,
        longitude: existingSubscriber.longitude,
        nodeId: existingSubscriber.nodeId,
        status: existingSubscriber.status,
        packageType: existingSubscriber.packageType,
        installationDate: existingSubscriber.installationDate,
        monthlyFee: existingSubscriber.monthlyFee,
      });
    }
  }, [existingSubscriber]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode && id) {
      updateSubscriber(id, formData);
    } else {
      addSubscriber(formData);
    }
    navigate('/subscribers');
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'latitude' || name === 'longitude' || name === 'monthlyFee'
          ? parseFloat(value)
          : value,
    }));
  };

  const handlePackageChange = (packageType: 'basic' | 'premium' | 'ultimate') => {
    const fees = { basic: 49.99, premium: 79.99, ultimate: 99.99 };
    setFormData((prev) => ({
      ...prev,
      packageType,
      monthlyFee: fees[packageType],
    }));
  };

  const previewSubscriber: Subscriber = {
    id: 'preview',
    ...formData,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/subscribers')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {isEditMode ? 'Edit Subscriber' : 'Add New Subscriber'}
          </h2>
          <p className="text-muted-foreground">
            {isEditMode ? 'Update subscriber information' : 'Create a new subscriber record'}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Subscriber Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="latitude">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Latitude *
                  </Label>
                  <Input
                    id="latitude"
                    name="latitude"
                    type="number"
                    step="0.0001"
                    value={formData.latitude}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Longitude *
                  </Label>
                  <Input
                    id="longitude"
                    name="longitude"
                    type="number"
                    step="0.0001"
                    value={formData.longitude}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nodeId">Network Node *</Label>
                <Select
                  id="nodeId"
                  name="nodeId"
                  value={formData.nodeId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a network node</option>
                  {nodes.map((node) => (
                    <option key={node.id} value={node.id}>
                      {node.name} ({node.type})
                    </option>
                  ))}
                </Select>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="packageType">Package Type *</Label>
                  <Select
                    id="packageType"
                    name="packageType"
                    value={formData.packageType}
                    onChange={(e) =>
                      handlePackageChange(e.target.value as any)
                    }
                    required
                  >
                    <option value="basic">Basic - $49.99/mo</option>
                    <option value="premium">Premium - $79.99/mo</option>
                    <option value="ultimate">Ultimate - $99.99/mo</option>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="installationDate">Installation Date *</Label>
                  <Input
                    id="installationDate"
                    name="installationDate"
                    type="date"
                    value={formData.installationDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthlyFee">Monthly Fee *</Label>
                  <Input
                    id="monthlyFee"
                    name="monthlyFee"
                    type="number"
                    step="0.01"
                    value={formData.monthlyFee}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1">
                  {isEditMode ? 'Update Subscriber' : 'Add Subscriber'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/subscribers')}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Location Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <SubscriberMap
              subscribers={[previewSubscriber]}
              nodes={nodes.filter((n) => n.id === formData.nodeId)}
              selectedSubscriber={previewSubscriber}
              height="600px"
            />
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">Location Details:</p>
              <p className="text-sm text-muted-foreground">
                Coordinates: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
              </p>
              <p className="text-sm text-muted-foreground">Address: {formData.address || 'Not set'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
