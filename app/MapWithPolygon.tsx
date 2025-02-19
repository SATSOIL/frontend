'use client';

import React from 'react';
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapWithPolygonProps {
  polygonCoordinates: [number, number][];
  style?: React.CSSProperties;
}

const MapWithPolygon: React.FC<MapWithPolygonProps> = ({ polygonCoordinates, style }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapContainerRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        scrollWheelZoom: false,
      }).setView(polygonCoordinates[0], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      const polygon = L.polygon(polygonCoordinates, { color: 'blue' }).addTo(map);
      map.fitBounds(polygon.getBounds());

      return () => {
        map.remove();
      };
    }
  }, [polygonCoordinates]);

  return <div ref={mapContainerRef} style={style}></div>;
};

export default MapWithPolygon;