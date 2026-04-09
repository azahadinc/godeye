import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, TrendingUp, MapPin, Info, ExternalLink, Sparkles, Zap } from 'lucide-react';
import { LocationInfo, TrendData } from '../App';
import { GoogleGenAI } from "@google/genai";

interface TrendDetailsProps {
  location: LocationInfo;
  trends: TrendData[];
  isLoading: boolean;
  onClose: () => void;
}

export default function TrendDetails({ location, trends, isLoading, onClose }: TrendDetailsProps) {
  const [insight, setInsight] = useState<string>("");
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);

  useEffect(() => {
    if (trends.length > 0 && !insight) {
      generateInsight();
    }
  }, [trends]);

  const generateInsight = async () => {
    setIsGeneratingInsight(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const topTrends = trends.slice(0, 5).map(t => t.title).join(", ");
      const prompt = `You are "Godeye", an advanced global intelligence AI. 
      Analyze the current top trends in ${location.country}: ${topTrends}. 
      Provide a brief, sophisticated 2-sentence insight about what these trends suggest about the current cultural or social mood in this region. 
      Keep it professional and slightly futuristic.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      setInsight(response.text || "No insight available at this moment.");
    } catch (error) {
      console.error("Error generating insight:", error);
      setInsight("Intelligence feed temporarily unavailable.");
    } finally {
      setIsGeneratingInsight(false);
    }
  };

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute top-0 right-0 w-full md:w-[450px] h-full z-40 bg-black/40 backdrop-blur-2xl border-l border-white/10 flex flex-col"
    >
      {/* Header (Recipe 3 Hardware feel) */}
      <div className="p-8 border-bottom border-white/10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-blue-400 mb-2">
              <MapPin size={12} />
              <span>Location Locked</span>
            </div>
            <h2 className="text-4xl font-light tracking-tight text-white">{location.country}</h2>
            <div className="text-[10px] font-mono text-white/30 mt-1">
              {location.lat.toFixed(4)}° N, {location.lng.toFixed(4)}° E
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full border border-white/10 hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* AI Insight Section */}
        <div className="bg-white/5 rounded-xl p-5 border border-white/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity">
            <Sparkles size={16} className="text-blue-400" />
          </div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-3 flex items-center gap-2">
            <Zap size={12} className="text-yellow-500" />
            <span>Godeye Intelligence Insight</span>
          </div>
          {isGeneratingInsight ? (
            <div className="flex flex-col gap-2">
              <div className="h-3 w-full bg-white/5 animate-pulse rounded" />
              <div className="h-3 w-2/3 bg-white/5 animate-pulse rounded" />
            </div>
          ) : (
            <p className="text-sm leading-relaxed text-white/80 italic font-serif">
              "{insight}"
            </p>
          )}
        </div>
      </div>

      {/* Trends List */}
      <div className="flex-1 overflow-y-auto p-8 pt-0 custom-scrollbar">
        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-white/40 mb-6">
          <TrendingUp size={12} />
          <span>Daily Trending Searches</span>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : trends.length > 0 ? (
          <div className="space-y-4">
            {trends.map((trend, idx) => (
              <motion.div 
                key={trend.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group p-5 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/[0.08] transition-all cursor-pointer"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium text-white group-hover:text-blue-400 transition-colors">
                    {trend.title}
                  </h3>
                  <div className="text-[10px] font-mono bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                    {trend.traffic}
                  </div>
                </div>
                
                {trend.articles?.[0] && (
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex-1">
                      <p className="text-xs text-white/40 line-clamp-1">
                        {trend.articles[0].title}
                      </p>
                      <div className="text-[9px] text-white/20 mt-1 uppercase tracking-wider">
                        {trend.articles[0].source}
                      </div>
                    </div>
                    <ExternalLink size={14} className="text-white/20 group-hover:text-white/60" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Info size={40} className="mx-auto text-white/10 mb-4" />
            <p className="text-white/40 text-sm">No trend data available for this region.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-8 border-t border-white/10 text-[9px] font-mono text-white/20 uppercase tracking-widest text-center">
        Data provided by Google Trends Engine
      </div>
    </motion.div>
  );
}
