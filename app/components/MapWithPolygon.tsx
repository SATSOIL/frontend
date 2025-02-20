'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapWithPolygonProps {
  polygonCoordinates: [number, number][];
  style?: React.CSSProperties;
}

const MapWithPolygon: React.FC<MapWithPolygonProps> = ({ polygonCoordinates, style }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;

    // 地図インスタンスの作成
    const map = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
    });

    leafletMapRef.current = map;

    // 衛星画像タイルレイヤーの追加（ESRI World Imagery）
    const satelliteLayer = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 19,
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      }
    ).addTo(map);

    // ポリゴンを追加（黄色の半透明なライン）
    const polygon = L.polygon(polygonCoordinates, {
      color: '#FFD700',
      weight: 2,
      opacity: 0.8,
      fillColor: '#FFD700',
      fillOpacity: 0.2
    }).addTo(map);

    // 表示範囲をポリゴンに合わせる
    map.fitBounds(polygon.getBounds(), { 
      padding: [10, 10],
      maxZoom: 17
    });

    // タイルロード完了時に再描画
    satelliteLayer.on('load', () => {
      map.invalidateSize();
    });

    // リサイズ監視の設定
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapRef.current);

    // クリーンアップ関数
    return () => {
      resizeObserver.disconnect();
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [polygonCoordinates]);

  return (
    <div 
      ref={mapRef} 
      style={{
        ...style,
        background: '#f0f0f0',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '8px'
      }}
    />
  );
};

export default MapWithPolygon;