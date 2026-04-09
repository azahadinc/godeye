import React, { useEffect, useRef, useState, useMemo } from 'react';
import Globe, { GlobeMethods } from 'react-globe.gl';
import * as THREE from 'three';

interface GlobeViewProps {
  onLocationClick: (info: { lat: number; lng: number; country: string; countryCode: string }) => void;
}

export default function GlobeView({ onLocationClick }: GlobeViewProps) {
  const globeRef = useRef<GlobeMethods>();
  const [countries, setCountries] = useState({ features: [] });

  useEffect(() => {
    // Load country boundaries
    fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(setCountries);
  }, []);

  useEffect(() => {
    if (globeRef.current) {
      // Set initial camera position
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 0.5;
      globeRef.current.pointOfView({ lat: 20, lng: 0, altitude: 2.5 });
    }
  }, []);

  const globeMaterial = useMemo(() => {
    return new THREE.MeshPhongMaterial({
      color: '#000814',
      emissive: '#001d3d',
      emissiveIntensity: 0.1,
      shininess: 0.7,
    });
  }, []);

  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing">
      <Globe
        ref={globeRef}
        backgroundColor="rgba(0,0,0,0)"
        showAtmosphere={true}
        atmosphereColor="#3a86ff"
        atmosphereAltitude={0.15}
        globeMaterial={globeMaterial}
        
        // Polygons (Countries)
        polygonsData={countries.features}
        polygonCapColor={() => 'rgba(58, 134, 255, 0.05)'}
        polygonSideColor={() => 'rgba(255, 255, 255, 0.02)'}
        polygonStrokeColor={() => 'rgba(255, 255, 255, 0.1)'}
        polygonLabel={({ properties: d }: any) => `
          <div class="bg-black/80 backdrop-blur-md border border-white/10 p-3 rounded-lg shadow-2xl">
            <div class="text-[10px] font-mono uppercase tracking-widest text-blue-400 mb-1">Region</div>
            <div class="text-sm font-medium text-white">${d.NAME}</div>
            <div class="text-[10px] text-white/40 mt-2">Click to analyze trends</div>
          </div>
        `}
        onPolygonClick={(polygon: any, event, { lat, lng }) => {
          const { NAME: country, ISO_A2: countryCode } = polygon.properties;
          
          // Smooth camera transition to clicked location
          if (globeRef.current) {
            globeRef.current.pointOfView({ lat, lng, altitude: 1.5 }, 1000);
            globeRef.current.controls().autoRotate = false;
          }
          
          onLocationClick({ lat, lng, country, countryCode });
        }}
        
        // Custom Layer for "Godeye" effect
        hexPolygonsData={countries.features}
        hexPolygonResolution={3}
        hexPolygonMargin={0.3}
        hexPolygonColor={() => 'rgba(58, 134, 255, 0.3)'}
        
        // Arcs or points could be added here for trends
      />
    </div>
  );
}
