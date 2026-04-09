import React from 'react';
import { Search, Menu, User, Shield, Activity, TrendingUp, MapPin, Zap } from 'lucide-react';

export default function UIOverlay() {
  return (
    <>
      {/* Top Navigation */}
      <div className="absolute top-0 left-0 w-full z-30 p-8 flex justify-between items-start pointer-events-none">
        <div className="pointer-events-auto">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
              <Shield className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tighter text-white uppercase italic">Godeye</h1>
              <div className="text-[9px] font-mono text-blue-400 tracking-[0.4em] uppercase -mt-1">Global Intel</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 pointer-events-auto">
          <div className="hidden md:flex items-center bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 gap-3 focus-within:border-blue-500/50 transition-all">
            <Search size={16} className="text-white/40" />
            <input 
              type="text" 
              placeholder="Search coordinates or region..." 
              className="bg-transparent border-none outline-none text-sm text-white placeholder:text-white/20 w-64"
            />
          </div>
          
          <button className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
            <Activity size={18} className="text-white/60" />
          </button>
          
          <button className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
            <User size={18} className="text-white/60" />
          </button>
        </div>
      </div>

      {/* Left Sidebar Controls */}
      <div className="absolute top-1/2 -translate-y-1/2 left-8 z-30 flex flex-col gap-4">
        {[
          { icon: <Activity size={20} />, label: 'Pulse' },
          { icon: <TrendingUp size={20} />, label: 'Trends' },
          { icon: <MapPin size={20} />, label: 'Nodes' },
          { icon: <Zap size={20} />, label: 'Events' },
        ].map((item, i) => (
          <div key={i} className="group relative">
            <button className="w-12 h-12 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-blue-600 hover:border-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all">
              <div className="text-white/60 group-hover:text-white transition-colors">
                {item.icon}
              </div>
            </button>
            <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-1 bg-black border border-white/10 rounded text-[10px] font-mono uppercase tracking-widest text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

