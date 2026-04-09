import React, { useState, useEffect, useCallback, useRef } from 'react';
import GlobeView from './components/GlobeView';
import TrendDetails from './components/TrendDetails';
import UIOverlay from './components/UIOverlay';
import { motion, AnimatePresence } from 'motion/react';
import { Globe as GlobeIcon, Zap, MapPin, TrendingUp } from 'lucide-react';

export interface TrendData {
  title: string;
  traffic: string;
  articles: any[];
}

export interface LocationInfo {
  lat: number;
  lng: number;
  country: string;
  countryCode: string;
}

export default function App() {
  const [selectedLocation, setSelectedLocation] = useState<LocationInfo | null>(null);
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(true); // Placeholder for auth

  const fetchTrends = useCallback(async (geo: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/trends?geo=${geo}`);
      const data = await response.json();
      
      // Parse google-trends-api response
      const dailyTrends = data.default?.trendingSearchesDays?.[0]?.trendingSearches || [];
      const formattedTrends = dailyTrends.map((t: any) => ({
        title: t.title.query,
        traffic: t.formattedTraffic,
        articles: t.articles || [],
      }));
      
      setTrends(formattedTrends);
    } catch (error) {
      console.error("Error fetching trends:", error);
      setTrends([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLocationClick = (info: LocationInfo) => {
    setSelectedLocation(info);
    fetchTrends(info.countryCode);
  };

  const handleCloseDetails = () => {
    setSelectedLocation(null);
    setTrends([]);
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-sans text-white">
      {/* Background Atmosphere (Recipe 7) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            background: `
              radial-gradient(circle at 50% 30%, #1a1a2e 0%, transparent 60%),
              radial-gradient(circle at 10% 80%, #0f3460 0%, transparent 50%),
              radial-gradient(circle at 90% 10%, #533483 0%, transparent 40%)
            `,
            filter: 'blur(80px)'
          }}
        />
      </div>

      {/* Main Globe View */}
      <div className="absolute inset-0 z-10">
        <GlobeView onLocationClick={handleLocationClick} />
      </div>

      {/* UI Overlays */}
      <UIOverlay />

      {/* Details Panel */}
      <AnimatePresence>
        {selectedLocation && (
          <TrendDetails 
            location={selectedLocation} 
            trends={trends} 
            isLoading={isLoading}
            onClose={handleCloseDetails} 
          />
        )}
      </AnimatePresence>

      {/* Status Bar */}
      <div className="absolute bottom-6 left-6 z-30 flex items-center gap-4 text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>System Online</span>
        </div>
        <div className="w-px h-3 bg-white/10" />
        <div className="flex items-center gap-2">
          <GlobeIcon size={12} />
          <span>Real-time Earth Constellation</span>
        </div>
        <div className="w-px h-3 bg-white/10" />
        <div className="flex items-center gap-2">
          <TrendingUp size={12} />
          <span>Google Trends Feed</span>
        </div>
      </div>
    </div>
  );
}
