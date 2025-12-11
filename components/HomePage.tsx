import React, { useState, useEffect } from 'react';
import { Shield, Cpu, Zap, Search, Globe, ChevronRight, PlayCircle, BarChart3, Database, RefreshCw, Brain, Eye, Network, Lock, Sparkles, Activity } from 'lucide-react';
import { fetchDashboardMissions } from '../services/geminiService';

interface HomePageProps {
  onQuickAction: (query: string) => void;
}

interface Mission {
  title: string;
  desc: string;
  query: string;
  icon: string;
}

const HomePage: React.FC<HomePageProps> = ({ onQuickAction }) => {
  const [missions, setMissions] = useState<Mission[]>([
    { title: "Transformer Architecture", desc: "Analyze the attention mechanism revolution.", query: "Search Transformer", icon: "brain" },
    { title: "GAN Dynamics", desc: "Tactical breakdown of adversarial networks.", query: "Search GAN", icon: "eye" },
    { title: "Reinforcement Learning", desc: "Agent-environment interaction protocols.", query: "Search Reinforcement Learning", icon: "cpu" },
    { title: "Convolutional Networks", desc: "Visual processing unit analysis.", query: "Search CNN", icon: "eye" },
    { title: "LSTM Archives", desc: "Sequence modeling historical data.", query: "Search LSTM", icon: "database" },
    { title: "Vision Transformers", desc: "Next-gen visual analysis systems.", query: "Search Vision Transformer", icon: "network" }
  ]);
  
  const [refreshTimer, setRefreshTimer] = useState(30);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    let intervalId: any;
    let timerId: any;

    const fetchNewMissions = async () => {
      setIsUpdating(true);
      try {
        const newMissions = await fetchDashboardMissions();
        if (newMissions && newMissions.length > 0) {
          setMissions(newMissions);
        }
      } catch (e) {
        console.error("Failed to refresh missions", e);
      } finally {
        setIsUpdating(false);
      }
      setRefreshTimer(30);
    };

    // Countdown timer
    timerId = setInterval(() => {
        setRefreshTimer(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);

    // Fetch every 30 seconds
    intervalId = setInterval(fetchNewMissions, 30000);

    return () => {
      clearInterval(intervalId);
      clearInterval(timerId);
    };
  }, []);

  const getIcon = (iconName: string) => {
    const name = iconName.toLowerCase();
    if (name.includes('zap')) return Zap;
    if (name.includes('cpu')) return Cpu;
    if (name.includes('shield')) return Shield;
    if (name.includes('globe')) return Globe;
    if (name.includes('database')) return Database;
    if (name.includes('search')) return Search;
    if (name.includes('brain')) return Brain;
    if (name.includes('eye')) return Eye;
    if (name.includes('vision')) return Eye;
    if (name.includes('network')) return Network;
    if (name.includes('lock')) return Lock;
    if (name.includes('sparkles')) return Sparkles;
    return Activity; // Fallback default
  };

  return (
    <div className="h-full w-full overflow-y-auto custom-scrollbar p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-space-800/80 to-space-900/80 backdrop-blur-xl border border-white/10 p-8 md:p-12 shadow-2xl group">
           {/* Background Effects */}
           <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none transition-all duration-1000 group-hover:bg-cyan-500/20"></div>
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>
           
           <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-widest">System Online</span>
                  <span className="h-px w-10 bg-cyan-500/30"></span>
              </div>
              <h1 className="text-4xl md:text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 mb-6 drop-shadow-sm">
                WELCOME, COMMANDER.
              </h1>
              <p className="text-lg md:text-xl text-slate-300 max-w-2xl font-light leading-relaxed mb-8">
                The <span className="text-cyan-400 font-mono font-bold">NOVA-7</span> Tactical Knowledge Matrix is ready for deployment. 
                Initialize simulations to break down complex machine learning architectures into actionable intelligence.
              </p>
              
              <div className="flex flex-wrap gap-4">
                  <button onClick={() => onQuickAction("Search Transformer")} className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-display font-bold tracking-wider rounded-lg transition-all shadow-[0_0_20px_rgba(8,145,178,0.4)] hover:shadow-[0_0_30px_rgba(8,145,178,0.6)] flex items-center gap-2">
                    <PlayCircle size={18} /> INITIALIZE DEMO
                  </button>
                  <button className="px-6 py-3 bg-white/5 hover:bg-white/10 text-slate-200 font-mono text-sm tracking-wide rounded-lg border border-white/10 transition-all flex items-center gap-2">
                    <Database size={16} /> BROWSE ARCHIVES
                  </button>
              </div>
           </div>
        </div>

        {/* Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-space-900/40 backdrop-blur-lg border border-white/5 rounded-2xl p-6 flex items-center gap-5 hover:bg-white/5 hover:border-cyan-500/30 transition-all group cursor-default shadow-lg">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/5 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform shadow-inner border border-blue-500/10">
                    <Cpu size={26} strokeWidth={1.5} />
                </div>
                <div>
                    <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-1">Processing Core</div>
                    <div className="text-2xl font-display font-bold text-white group-hover:text-blue-300 transition-colors">OPTIMAL</div>
                </div>
            </div>
            <div className="bg-space-900/40 backdrop-blur-lg border border-white/5 rounded-2xl p-6 flex items-center gap-5 hover:bg-white/5 hover:border-cyan-500/30 transition-all group cursor-default shadow-lg">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-600/5 flex items-center justify-center text-green-400 group-hover:scale-110 transition-transform shadow-inner border border-green-500/10">
                    <Zap size={26} strokeWidth={1.5} />
                </div>
                <div>
                    <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-1">Neural Uplink</div>
                    <div className="text-2xl font-display font-bold text-white group-hover:text-green-300 transition-colors">SECURE</div>
                </div>
            </div>
            <div className="bg-space-900/40 backdrop-blur-lg border border-white/5 rounded-2xl p-6 flex items-center gap-5 hover:bg-white/5 hover:border-cyan-500/30 transition-all group cursor-default shadow-lg">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/5 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform shadow-inner border border-purple-500/10">
                    <Shield size={26} strokeWidth={1.5} />
                </div>
                <div>
                    <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-1">Knowledge Base</div>
                    <div className="text-2xl font-display font-bold text-white group-hover:text-purple-300 transition-colors">UPDATED</div>
                </div>
            </div>
        </div>

        {/* Quick Actions / Active Missions */}
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-mono text-cyan-500 tracking-wider uppercase flex items-center gap-2">
                    <Search size={18} /> Active Missions
                </h2>
                
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-space-900/60 px-3 py-1.5 rounded border border-cyan-900/50">
                        {isUpdating ? (
                            <RefreshCw size={12} className="text-cyan-400 animate-spin" />
                        ) : (
                            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
                        )}
                        <span className="text-[10px] font-mono text-cyan-300/80 uppercase">
                            {isUpdating ? "RECEIVING DATA..." : `NEXT UPLINK: ${refreshTimer}s`}
                        </span>
                    </div>
                    <button className="text-xs text-slate-500 hover:text-white transition-colors uppercase tracking-widest font-mono flex items-center gap-1">
                        View All <ChevronRight size={12} />
                    </button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {missions.map((mission, i) => {
                    const MissionIcon = getIcon(mission.icon);
                    return (
                        <button 
                            key={i}
                            onClick={() => onQuickAction(mission.query)}
                            className="group text-left bg-space-800/40 backdrop-blur-md border border-white/5 hover:border-cyan-500/50 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-500/10 relative overflow-hidden animate-in fade-in zoom-in-95 duration-500"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 rounded bg-white/5 text-slate-400 group-hover:text-cyan-400 group-hover:bg-cyan-500/10 transition-colors">
                                    <MissionIcon size={20} />
                                </div>
                                <span className="text-[10px] font-mono text-slate-600 group-hover:text-cyan-500/70 transition-colors">ID-{100+i}</span>
                            </div>

                            <h3 className="text-lg font-display font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">{mission.title}</h3>
                            <p className="text-sm text-slate-400 mb-6 line-clamp-2 min-h-[40px]">{mission.desc}</p>
                            
                            <div className="flex items-center text-cyan-600/70 group-hover:text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider transition-colors">
                                <span className="mr-2">Initialize</span> 
                                <span className="h-px w-8 bg-cyan-600/30 group-hover:bg-cyan-400/50 transition-colors"></span>
                                <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>

        {/* Footer Stats */}
        <div className="rounded-3xl bg-black/20 backdrop-blur-md border border-white/5 p-8 flex flex-col md:flex-row items-center justify-between gap-8 mt-12">
            <div className="flex items-center gap-6">
                <div className="p-4 rounded-full bg-space-900 border border-slate-800 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                    <Globe size={32} className="text-slate-500" />
                </div>
                <div>
                    <h3 className="text-white font-display font-bold text-lg tracking-wide">GLOBAL UPLINK ACTIVE</h3>
                    <p className="text-slate-400 text-sm">Secure connection established to Galactic ML Command.</p>
                </div>
            </div>
            <div className="flex gap-2">
                 {[1,2,3,4,5].map(i => (
                     <div key={i} className={`w-1 h-8 rounded-full ${i < 4 ? 'bg-cyan-500 animate-pulse' : 'bg-slate-700'}`} style={{ animationDelay: `${i * 0.1}s` }}></div>
                 ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;