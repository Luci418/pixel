import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Subscriber, NetworkNode } from '@/types';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  iconRetinaUrl: iconRetina,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom icons for different types
const subscriberIcon = L.divIcon({
  html: '<div style="background-color: #3b82f6; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>',
  className: 'custom-marker',
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

const nodeIcon = L.divIcon({
  html: '<div style="background-color: #10b981; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white;"></div>',
  className: 'custom-marker',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

interface MapCenterProps {
  center: [number, number];
}

function MapCenter({ center }: MapCenterProps) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

interface SubscriberMapProps {
  subscribers?: Subscriber[];
  nodes?: NetworkNode[];
  selectedSubscriber?: Subscriber;
  height?: string;
}

export default function SubscriberMap({
  subscribers = [],
  nodes = [],
  selectedSubscriber,
  height = '500px',
}: SubscriberMapProps) {
  const center: [number, number] = selectedSubscriber
    ? [selectedSubscriber.latitude, selectedSubscriber.longitude]
    : [40.7128, -74.006];

  return (
    <div style={{ height, width: '100%' }} className="rounded-lg overflow-hidden border">
      <MapContainer
        center={center}
        zoom={selectedSubscriber ? 15 : 12}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {selectedSubscriber && <MapCenter center={center} />}

        {/* Network Nodes */}
        {nodes.map((node) => (
          <Marker
            key={node.id}
            position={[node.latitude, node.longitude]}
            icon={nodeIcon}
          >
            <Popup>
              <div className="p-2">
                <p className="font-semibold">{node.name}</p>
                <p className="text-sm text-gray-600">{node.type}</p>
                <p className="text-sm">Status: {node.status}</p>
                <p className="text-sm">
                  Load: {node.currentLoad}/{node.capacity}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Subscribers */}
        {subscribers.map((subscriber) => (
          <Marker
            key={subscriber.id}
            position={[subscriber.latitude, subscriber.longitude]}
            icon={subscriberIcon}
          >
            <Popup>
              <div className="p-2">
                <p className="font-semibold">{subscriber.name}</p>
                <p className="text-sm text-gray-600">{subscriber.email}</p>
                <p className="text-sm">{subscriber.address}</p>
                <p className="text-sm">Package: {subscriber.packageType}</p>
                <p className="text-sm">Status: {subscriber.status}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
